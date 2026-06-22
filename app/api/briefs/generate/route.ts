import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import {
  calculateCategoryPreparationCompletion,
  calculateOverallVentureProgress,
  getTopMissingFacts,
  type AdaptiveChecklistAnswer,
  type AdaptiveChecklistQuestion,
} from "@/src/lib/adaptiveChecklist";
import {
  generateCounselBriefContent,
  generatePitchBriefContent,
} from "@/src/lib/generatedBriefs";
import { generateBriefDraftWithGemini } from "@/src/lib/geminiBriefDrafting";

type BriefType = "COUNSEL_BRIEF" | "PITCH_BRIEF";

type QuestionRecord = AdaptiveChecklistQuestion & {
  id: string;
  categoryKey: string;
  categoryName: string;
  questionText: string;
};

type AnswerRecord = AdaptiveChecklistAnswer & {
  questionId: string;
  value: unknown;
  evidenceText: string | null;
  founderConfirmed: boolean;
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Authentication required.",
    },
    { status: 401 },
  );
}

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

async function getCurrentCompany(ownerId: string) {
  return prisma.company.findFirst({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });
}

function briefTypeFromBody(body: unknown): BriefType | null {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return record.briefType === "COUNSEL_BRIEF" || record.briefType === "PITCH_BRIEF" ? record.briefType : null;
}

function missingFactText(question: AdaptiveChecklistQuestion) {
  return (question as QuestionRecord).questionText;
}

function buildProgress(questions: QuestionRecord[], answers: AnswerRecord[]) {
  const categoryGroups = new Map<string, QuestionRecord[]>();

  for (const question of questions) {
    categoryGroups.set(question.categoryKey, [...(categoryGroups.get(question.categoryKey) ?? []), question]);
  }

  const categories = Array.from(categoryGroups.entries()).map(([categoryKey, categoryQuestions]) => {
    const categoryAnswers = answers.filter((answer) => categoryQuestions.some((question) => question.id === answer.questionId));

    return {
      categoryKey,
      categoryName: categoryQuestions[0]?.categoryName ?? categoryKey,
      preparationCompletion: calculateCategoryPreparationCompletion(categoryQuestions, categoryAnswers),
    };
  });

  return {
    ventureProgress: calculateOverallVentureProgress(categories.map((category) => category.preparationCompletion)),
    categories,
    topMissingFacts: getTopMissingFacts(questions, answers, 8).map(missingFactText),
  };
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    let body: unknown = {};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "INVALID_BRIEF_REQUEST" }, { status: 400 });
    }

    const briefType = briefTypeFromBody(body);

    if (!briefType) {
      return NextResponse.json({ ok: false, error: "INVALID_BRIEF_TYPE" }, { status: 400 });
    }

    const company = await getCurrentCompany(userId);

    if (!company) {
      return NextResponse.json({ ok: false, error: "NO_ACTIVE_CHECKLIST_SESSION" }, { status: 400 });
    }

    const session = await prisma.checklistSession.findFirst({
      where: {
        userId,
        companyId: company.id,
        status: "active",
      },
      orderBy: { updatedAt: "desc" },
      include: {
        questions: {
          orderBy: { sortOrder: "asc" },
        },
        answers: true,
      },
    });

    if (!session) {
      return NextResponse.json({ ok: false, error: "NO_ACTIVE_CHECKLIST_SESSION" }, { status: 400 });
    }

    const questions = session.questions as QuestionRecord[];
    const answers = session.answers as AnswerRecord[];
    const progress = buildProgress(questions, answers);
    const contentInput = {
      company,
      session,
      questions,
      answers,
      progress,
    };
    const rulesBasedContent =
      briefType === "COUNSEL_BRIEF"
        ? generateCounselBriefContent(contentInput)
        : generatePitchBriefContent(contentInput);
    const geminiDraft = await generateBriefDraftWithGemini({
      briefType,
      company,
      session,
      questions,
      answers,
      progress,
      rulesBasedContent,
    });
    const provider = geminiDraft.ok ? "gemini" : "rules";
    const content = geminiDraft.ok ? geminiDraft.content : rulesBasedContent;
    const generatedAt = new Date();
    const title = briefType === "COUNSEL_BRIEF" ? "Counsel Brief Preview" : "Pitch Brief Preview";
    const savedBrief = await prisma.generatedBrief.create({
      data: {
        companyId: company.id,
        userId,
        checklistSessionId: session.id,
        briefType,
        title,
        generatedContent: content as unknown as Prisma.InputJsonValue,
        founderApprovalStatus: "draft",
        generatedAt,
      },
    });

    return NextResponse.json({
      ok: true,
      provider,
      brief: {
        id: savedBrief.id,
        briefType,
        title,
        generatedContent: content,
        generatedAt: generatedAt.toISOString(),
        founderApprovalStatus: savedBrief.founderApprovalStatus,
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "BRIEF_GENERATION_FAILED",
      },
      { status: 500 },
    );
  }
}
