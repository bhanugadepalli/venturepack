import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { getDefaultAdaptiveChecklistQuestions } from "@/src/lib/adaptiveChecklistQuestions";
import { generateAdaptiveChecklistWithGemini } from "@/src/lib/geminiAdaptiveChecklist";
import type { ValidatedAdaptiveChecklistAiOutput } from "@/src/lib/adaptiveChecklistAiSchema";

type ChecklistQuestionTemplate = {
  categoryKey: string;
  categoryName: string;
  questionKey: string;
  questionText: string;
  answerType: string;
  required: boolean;
  whyItMatters: string;
  outputUse: string;
  sortOrder: number;
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

function questionResponse(question: {
  id: string;
  sessionId: string;
  categoryKey: string;
  categoryName: string;
  questionKey: string;
  questionText: string;
  answerType: string;
  required: boolean;
  whyItMatters: string | null;
  outputUse: string | null;
  sortOrder: number;
  createdBy: string;
  createdAt: Date;
}) {
  return {
    id: question.id,
    sessionId: question.sessionId,
    categoryKey: question.categoryKey,
    categoryName: question.categoryName,
    questionKey: question.questionKey,
    questionText: question.questionText,
    answerType: question.answerType,
    required: question.required,
    whyItMatters: question.whyItMatters,
    outputUse: question.outputUse,
    sortOrder: question.sortOrder,
    createdBy: question.createdBy,
    createdAt: question.createdAt.toISOString(),
  };
}

function questionsFromGeminiOutput(output: ValidatedAdaptiveChecklistAiOutput): ChecklistQuestionTemplate[] {
  let sortOrder = 0;

  return output.categories.flatMap((category) =>
    category.questions.map((question) => {
      sortOrder += 1;

      return {
        categoryKey: category.categoryKey,
        categoryName: category.categoryName,
        questionKey: question.questionKey,
        questionText: question.questionText,
        answerType: question.answerType,
        required: question.required,
        whyItMatters: question.whyItMatters,
        outputUse: question.outputUse,
        sortOrder,
      };
    }),
  );
}

export async function POST() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    const company = await getCurrentCompany(userId);

    if (!company) {
      return NextResponse.json({
        ok: false,
        error: "NO_ACTIVE_CHECKLIST_SESSION",
      });
    }

    const session = await prisma.checklistSession.findFirst({
      where: {
        userId,
        companyId: company.id,
        status: "active",
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!session) {
      return NextResponse.json({
        ok: false,
        error: "NO_ACTIVE_CHECKLIST_SESSION",
      });
    }

    const geminiResult = await generateAdaptiveChecklistWithGemini({ company, session });
    const provider = geminiResult.ok ? "gemini" : "rules";
    const questionTemplates = geminiResult.ok
      ? questionsFromGeminiOutput(geminiResult.checklist)
      : getDefaultAdaptiveChecklistQuestions(session);
    const questions = await prisma.$transaction(async (tx) => {
      await tx.checklistAnswer.deleteMany({
        where: { sessionId: session.id },
      });
      await tx.checklistQuestion.deleteMany({
        where: { sessionId: session.id },
      });
      await tx.checklistQuestion.createMany({
        data: questionTemplates.map((question) => ({
          sessionId: session.id,
          categoryKey: question.categoryKey,
          categoryName: question.categoryName,
          questionKey: question.questionKey,
          questionText: question.questionText,
          answerType: question.answerType,
          required: question.required,
          whyItMatters: question.whyItMatters,
          outputUse: question.outputUse,
          sortOrder: question.sortOrder,
          createdBy: provider === "gemini" ? "ai_validated" : "rules",
        })),
      });

      if (provider === "gemini") {
        await tx.checklistSession.update({
          where: { id: session.id },
          data: {
            aiModelName: "gemini-1.5-flash",
            aiPromptVersion: "adaptive_checklist_v1",
          },
        });
      }

      return tx.checklistQuestion.findMany({
        where: { sessionId: session.id },
        orderBy: { sortOrder: "asc" },
      });
    });

    return NextResponse.json({
      ok: true,
      provider,
      questions: questions.map(questionResponse),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to generate checklist questions.",
      },
      { status: 500 },
    );
  }
}
