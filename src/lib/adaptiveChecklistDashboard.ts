import { prisma } from "@/src/lib/prisma";
import {
  calculateCategoryPreparationCompletion,
  calculateOverallVentureProgress,
  getTopMissingFacts,
  type AdaptiveChecklistAnswer,
  type AdaptiveChecklistQuestion,
} from "@/src/lib/adaptiveChecklist";

type ChecklistDashboardInput = {
  userId: string;
  companyId: string;
};

type QuestionRecord = AdaptiveChecklistQuestion & {
  id: string;
  categoryKey: string;
  categoryName: string;
  questionText: string;
  sortOrder: number;
};

type AnswerRecord = AdaptiveChecklistAnswer & {
  questionId: string;
  value: unknown;
  evidenceText: string | null;
  founderConfirmed: boolean;
};

function missingFactText(question: AdaptiveChecklistQuestion) {
  return (question as QuestionRecord).questionText;
}

// This dashboard summary uses deterministic preparation-completion scoring only.
// It does not use AI and does not evaluate legal, compliance, risk, or investment readiness.
export async function getAdaptiveChecklistDashboardData({ userId, companyId }: ChecklistDashboardInput) {
  const session = await prisma.checklistSession.findFirst({
    where: {
      userId,
      companyId,
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
    return {
      hasSession: false,
      session: null,
      ventureProgress: 0,
      topMissingFacts: [],
    };
  }

  const questions = session.questions as QuestionRecord[];
  const answers = session.answers as AnswerRecord[];
  const categoryGroups = new Map<string, QuestionRecord[]>();

  for (const question of questions) {
    categoryGroups.set(question.categoryKey, [...(categoryGroups.get(question.categoryKey) ?? []), question]);
  }

  const categoryPercentages = Array.from(categoryGroups.values()).map((categoryQuestions) => {
    const categoryAnswers = answers.filter((answer) => categoryQuestions.some((question) => question.id === answer.questionId));
    return calculateCategoryPreparationCompletion(categoryQuestions, categoryAnswers);
  });

  return {
    hasSession: true,
    session,
    ventureProgress: calculateOverallVentureProgress(categoryPercentages),
    topMissingFacts: getTopMissingFacts(questions, answers, 3).map(missingFactText),
  };
}
