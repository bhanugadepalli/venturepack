import { fixedCategories } from "@/src/lib/adaptiveChecklist";

export const allowedAdaptiveChecklistCategoryKeys = [
  "VENTURE_BASICS",
  "TEAM_AND_FOUNDERS",
  "PRODUCT_OR_SERVICE",
  "CUSTOMER_AND_MARKET_FACTS",
  "ASSETS_AND_OWNERSHIP",
  "PITCH_PREPARATION",
  "COUNSEL_PREPARATION",
  "LAUNCH_PREPARATION",
] as const;

export const allowedAdaptiveChecklistAnswerTypes = ["text", "textarea", "boolean", "date", "select", "multiselect", "url"] as const;

export const allowedAdaptiveChecklistOutputUses = ["COUNSEL_BRIEF", "PITCH_BRIEF", "BOTH"] as const;

export type AdaptiveChecklistAiCategoryKey = (typeof allowedAdaptiveChecklistCategoryKeys)[number];
export type AdaptiveChecklistAiAnswerType = (typeof allowedAdaptiveChecklistAnswerTypes)[number];
export type AdaptiveChecklistAiOutputUse = (typeof allowedAdaptiveChecklistOutputUses)[number];
export type AdaptiveChecklistAiGoal = Extract<AdaptiveChecklistAiOutputUse, "COUNSEL_BRIEF" | "PITCH_BRIEF">;

export type ValidatedAdaptiveChecklistAiQuestion = {
  questionKey: string;
  questionText: string;
  answerType: AdaptiveChecklistAiAnswerType;
  required: boolean;
  whyItMatters: string;
  outputUse: AdaptiveChecklistAiOutputUse;
  sensitiveDataWarning: boolean;
};

export type ValidatedAdaptiveChecklistAiCategory = {
  categoryKey: AdaptiveChecklistAiCategoryKey;
  categoryName: (typeof fixedCategories)[AdaptiveChecklistAiCategoryKey];
  questions: ValidatedAdaptiveChecklistAiQuestion[];
};

export type ValidatedAdaptiveChecklistAiOutput = {
  checklistTitle: string;
  goal: AdaptiveChecklistAiGoal;
  categories: ValidatedAdaptiveChecklistAiCategory[];
  missingFactsSummary: string[];
  suggestedNextActions: string[];
};

const maxQuestionsPerCategory = 5;
const maxTotalQuestions = 32;
const minimumValidQuestions = 3;
const blockedPhrases = [
  "legal advice",
  "legal conclusion",
  "legally ready",
  "compliant",
  "compliance score",
  "risk score",
  "red flag",
  "contract review",
  "investor ready",
  "guaranteed",
  "safe from risk",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeLegalAdviceWording(value: unknown) {
  let nextValue = trimString(value);

  for (const phrase of blockedPhrases) {
    nextValue = nextValue.replace(new RegExp(escapeRegExp(phrase), "gi"), "").replace(/\s+/g, " ").trim();
  }

  return nextValue;
}

function safeSlug(value: unknown, fallback: string) {
  const slug = trimString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);

  return slug || fallback;
}

function isAllowedCategoryKey(value: unknown): value is AdaptiveChecklistAiCategoryKey {
  return allowedAdaptiveChecklistCategoryKeys.includes(value as AdaptiveChecklistAiCategoryKey);
}

function isAllowedAnswerType(value: unknown): value is AdaptiveChecklistAiAnswerType {
  return allowedAdaptiveChecklistAnswerTypes.includes(value as AdaptiveChecklistAiAnswerType);
}

function isAllowedOutputUse(value: unknown): value is AdaptiveChecklistAiOutputUse {
  return allowedAdaptiveChecklistOutputUses.includes(value as AdaptiveChecklistAiOutputUse);
}

function isAllowedGoal(value: unknown): value is AdaptiveChecklistAiGoal {
  return value === "COUNSEL_BRIEF" || value === "PITCH_BRIEF";
}

function dedupeStrings(values: unknown[], maxItems: number) {
  const seen = new Set<string>();
  const results: string[] = [];

  for (const value of values) {
    const text = removeLegalAdviceWording(value);
    const key = text.toLowerCase();

    if (!text || seen.has(key)) {
      continue;
    }

    seen.add(key);
    results.push(text);

    if (results.length >= maxItems) {
      break;
    }
  }

  return results;
}

function uniqueQuestionKey(baseKey: string, usedKeys: Set<string>) {
  let key = baseKey;
  let suffix = 2;

  while (usedKeys.has(key)) {
    key = `${baseKey}_${suffix}`;
    suffix += 1;
  }

  usedKeys.add(key);
  return key;
}

export function sanitizeAiChecklistQuestions(validatedOutput: ValidatedAdaptiveChecklistAiOutput): ValidatedAdaptiveChecklistAiOutput {
  const categories: ValidatedAdaptiveChecklistAiCategory[] = [];
  const seenQuestionText = new Set<string>();
  const usedQuestionKeys = new Set<string>();
  let totalQuestions = 0;

  for (const category of validatedOutput.categories) {
    if (totalQuestions >= maxTotalQuestions || !isAllowedCategoryKey(category.categoryKey)) {
      continue;
    }

    const questions: ValidatedAdaptiveChecklistAiQuestion[] = [];

    for (const question of category.questions) {
      if (questions.length >= maxQuestionsPerCategory || totalQuestions >= maxTotalQuestions) {
        break;
      }

      if (!isAllowedAnswerType(question.answerType) || !isAllowedOutputUse(question.outputUse)) {
        continue;
      }

      const questionText = removeLegalAdviceWording(question.questionText);
      const whyItMatters = removeLegalAdviceWording(question.whyItMatters);
      const textKey = questionText.toLowerCase();

      if (!questionText || !whyItMatters || seenQuestionText.has(textKey)) {
        continue;
      }

      seenQuestionText.add(textKey);
      questions.push({
        questionKey: uniqueQuestionKey(safeSlug(question.questionKey, safeSlug(questionText, `question_${totalQuestions + 1}`)), usedQuestionKeys),
        questionText,
        answerType: question.answerType,
        required: question.required === true,
        whyItMatters,
        outputUse: question.outputUse,
        sensitiveDataWarning: question.sensitiveDataWarning === true,
      });
      totalQuestions += 1;
    }

    if (questions.length > 0) {
      categories.push({
        categoryKey: category.categoryKey,
        categoryName: fixedCategories[category.categoryKey],
        questions,
      });
    }
  }

  return {
    checklistTitle: removeLegalAdviceWording(validatedOutput.checklistTitle) || "Adaptive Venture Checklist",
    goal: validatedOutput.goal,
    categories,
    missingFactsSummary: dedupeStrings(validatedOutput.missingFactsSummary, 8),
    suggestedNextActions: dedupeStrings(validatedOutput.suggestedNextActions, 8),
  };
}

export function validateAdaptiveChecklistAiOutput(raw: unknown): ValidatedAdaptiveChecklistAiOutput | null {
  if (!isRecord(raw) || !isAllowedGoal(raw.goal) || !Array.isArray(raw.categories)) {
    return null;
  }

  const categories: ValidatedAdaptiveChecklistAiCategory[] = [];

  for (const categoryValue of raw.categories) {
    if (!isRecord(categoryValue) || !isAllowedCategoryKey(categoryValue.categoryKey) || !Array.isArray(categoryValue.questions)) {
      continue;
    }

    const questions: ValidatedAdaptiveChecklistAiQuestion[] = [];

    for (const questionValue of categoryValue.questions) {
      if (!isRecord(questionValue)) {
        continue;
      }

      const questionText = trimString(questionValue.questionText);

      if (!questionText || !isAllowedAnswerType(questionValue.answerType) || !isAllowedOutputUse(questionValue.outputUse)) {
        continue;
      }

      questions.push({
        questionKey: safeSlug(questionValue.questionKey, safeSlug(questionText, "question")),
        questionText,
        answerType: questionValue.answerType,
        required: questionValue.required === true,
        whyItMatters: trimString(questionValue.whyItMatters),
        outputUse: questionValue.outputUse,
        sensitiveDataWarning: questionValue.sensitiveDataWarning === true,
      });
    }

    if (questions.length > 0) {
      categories.push({
        categoryKey: categoryValue.categoryKey,
        categoryName: fixedCategories[categoryValue.categoryKey],
        questions,
      });
    }
  }

  const sanitized = sanitizeAiChecklistQuestions({
    checklistTitle: trimString(raw.checklistTitle) || "Adaptive Venture Checklist",
    goal: raw.goal,
    categories,
    missingFactsSummary: Array.isArray(raw.missingFactsSummary) ? raw.missingFactsSummary : [],
    suggestedNextActions: Array.isArray(raw.suggestedNextActions) ? raw.suggestedNextActions : [],
  });
  const totalQuestions = sanitized.categories.reduce((sum, category) => sum + category.questions.length, 0);

  return totalQuestions >= minimumValidQuestions ? sanitized : null;
}
