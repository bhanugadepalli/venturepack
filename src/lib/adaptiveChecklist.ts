export const businessTypes = [
  "Software app",
  "AI tool",
  "Marketplace",
  "Service business",
  "E commerce",
  "Campus or student venture",
] as const;

export const ventureStages = [
  "Idea",
  "Class project",
  "Prototype",
  "Beta users",
  "Launched",
  "Revenue",
  "Pitch competition",
  "Accelerator applicant",
] as const;

export const immediateGoals = [
  "First attorney meeting",
  "Pitch competition or presentation",
  "Launching website or app",
  "Applying to accelerator",
  "Talking to mentor",
] as const;

export const teamStatuses = [
  "Solo founder",
  "Cofounders",
  "Contributors",
  "Contractors",
  "Mixed team",
] as const;

export const fixedCategories = {
  VENTURE_BASICS: "Venture Basics",
  TEAM_AND_FOUNDERS: "Team and Founders",
  PRODUCT_OR_SERVICE: "Product or Service",
  CUSTOMER_AND_MARKET_FACTS: "Customer and Market Facts",
  ASSETS_AND_OWNERSHIP: "Assets and Ownership",
  PITCH_PREPARATION: "Pitch Preparation",
  COUNSEL_PREPARATION: "Counsel Preparation",
  LAUNCH_PREPARATION: "Launch Preparation",
} as const;

export type AdaptiveChecklistQuestion = {
  id?: string | null;
  questionId?: string | null;
  questionKey?: string | null;
  categoryKey?: string | null;
  required?: boolean | null;
};

export type AdaptiveChecklistAnswer = {
  questionId?: string | null;
  questionKey?: string | null;
  value?: unknown;
  evidenceText?: string | null;
  founderConfirmed?: boolean | null;
};

function asQuestionArray(questions: AdaptiveChecklistQuestion[] | null | undefined) {
  return Array.isArray(questions) ? questions : [];
}

function asAnswerArray(answers: AdaptiveChecklistAnswer[] | null | undefined) {
  return Array.isArray(answers) ? answers : [];
}

function questionIdentifier(question: AdaptiveChecklistQuestion) {
  return question.id || question.questionId || question.questionKey || "";
}

function answerIdentifier(answer: AdaptiveChecklistAnswer) {
  return answer.questionId || answer.questionKey || "";
}

function hasAnswerValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function findAnswerForQuestion(question: AdaptiveChecklistQuestion, answers: AdaptiveChecklistAnswer[]) {
  const id = questionIdentifier(question);

  if (!id) return undefined;

  return answers.find((answer) => answerIdentifier(answer) === id);
}

function roundPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// This score reflects completion of requested preparation information only.
// It is deterministic and is never calculated by AI.
export function calculateCategoryPreparationCompletion(
  questions: AdaptiveChecklistQuestion[] | null | undefined,
  answers: AdaptiveChecklistAnswer[] | null | undefined,
) {
  const activeQuestions = asQuestionArray(questions);
  const answerList = asAnswerArray(answers);

  if (activeQuestions.length === 0) {
    return 0;
  }

  const total = activeQuestions.reduce((sum, question) => {
    const answer = findAnswerForQuestion(question, answerList);
    const hasRequiredAnswer = answer ? hasAnswerValue(answer.value) : false;
    const hasEvidence = Boolean(answer?.evidenceText?.trim());
    const hasFounderConfirmation = answer?.founderConfirmed === true;

    return sum + (hasRequiredAnswer ? 70 : 0) + (hasEvidence ? 20 : 0) + (hasFounderConfirmation ? 10 : 0);
  }, 0);

  return roundPercentage(total / activeQuestions.length);
}

// Overall Venture Progress is the average of active category overall preparation percentages.
export function calculateOverallVentureProgress(categoryPercentages: Array<number | null | undefined> | null | undefined) {
  const activePercentages = Array.isArray(categoryPercentages)
    ? categoryPercentages.filter((percentage): percentage is number => typeof percentage === "number" && Number.isFinite(percentage))
    : [];

  if (activePercentages.length === 0) {
    return 0;
  }

  const total = activePercentages.reduce((sum, percentage) => sum + Math.max(0, Math.min(100, percentage)), 0);

  return roundPercentage(total / activePercentages.length);
}

export function getMissingFacts(
  questions: AdaptiveChecklistQuestion[] | null | undefined,
  answers: AdaptiveChecklistAnswer[] | null | undefined,
) {
  const answerList = asAnswerArray(answers);

  return asQuestionArray(questions).filter((question) => {
    const answer = findAnswerForQuestion(question, answerList);

    return !answer || !hasAnswerValue(answer.value);
  });
}

export function getTopMissingFacts(
  questions: AdaptiveChecklistQuestion[] | null | undefined,
  answers: AdaptiveChecklistAnswer[] | null | undefined,
  limit: number | null | undefined,
) {
  const safeLimit = typeof limit === "number" && Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;

  return getMissingFacts(questions, answers).slice(0, safeLimit);
}
