import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import {
  calculateCategoryPreparationCompletion,
  calculateOverallVentureProgress,
  getMissingFacts,
  getTopMissingFacts,
  type AdaptiveChecklistAnswer,
  type AdaptiveChecklistQuestion,
} from "@/src/lib/adaptiveChecklist";

const progressNote =
  "This percentage reflects completion of requested preparation information. It is not a legal opinion, compliance rating, investment judgment, or guarantee.";

type QuestionRecord = AdaptiveChecklistQuestion & {
  id: string;
  categoryKey: string;
  categoryName: string;
  questionText: string;
  required: boolean;
  sortOrder: number;
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

function emptyProgressResponse() {
  return NextResponse.json({
    ok: true,
    ventureProgress: 0,
    categories: [],
    topMissingFacts: [],
    note: progressNote,
  });
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

function hasAnswerValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function answerForQuestion(question: QuestionRecord, answers: AnswerRecord[]) {
  return answers.find((answer) => answer.questionId === question.id);
}

function missingFactText(question: AdaptiveChecklistQuestion) {
  const record = question as QuestionRecord;
  return record.questionText;
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    const company = await getCurrentCompany(userId);

    if (!company) {
      return emptyProgressResponse();
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
      return emptyProgressResponse();
    }

    const questions = session.questions as QuestionRecord[];
    const answers = session.answers as AnswerRecord[];
    const categoryGroups = new Map<string, QuestionRecord[]>();

    for (const question of questions) {
      categoryGroups.set(question.categoryKey, [...(categoryGroups.get(question.categoryKey) ?? []), question]);
    }

    const categories = Array.from(categoryGroups.entries()).map(([categoryKey, categoryQuestions]) => {
      const categoryAnswers = answers.filter((answer) => categoryQuestions.some((question) => question.id === answer.questionId));
      const missingFacts = getMissingFacts(categoryQuestions, categoryAnswers).map(missingFactText);
      const requiredQuestions = categoryQuestions.filter((question) => question.required);
      const answeredRequiredCount = requiredQuestions.filter((question) => {
        const answer = answerForQuestion(question, answers);
        return answer ? hasAnswerValue(answer.value) : false;
      }).length;

      return {
        categoryKey,
        categoryName: categoryQuestions[0]?.categoryName ?? categoryKey,
        preparationCompletion: calculateCategoryPreparationCompletion(categoryQuestions, categoryAnswers),
        requiredQuestionCount: requiredQuestions.length,
        answeredRequiredCount,
        missingFacts,
      };
    });
    const ventureProgress = calculateOverallVentureProgress(categories.map((category) => category.preparationCompletion));
    const topMissingFacts = getTopMissingFacts(questions, answers, 5).map(missingFactText);

    return NextResponse.json({
      ok: true,
      ventureProgress,
      categories,
      topMissingFacts,
      note: progressNote,
    });
  } catch {
    return emptyProgressResponse();
  }
}
