export type InformationSuggestionInput = {
  companyName?: string;
  completionPercentage?: number;
  incompleteItems?: Array<{
    title: string;
    description?: string;
    suggestedNextAction?: string;
  }>;
  context?: {
    matterType?: string;
    page?: string;
  };
};

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const fillerPhrases = [
  "compile information",
  "compile the information",
  "organize information",
  "founder supplied information",
  "before generating your counsel packet",
  "before speaking with counsel",
  "useful to compile",
  "may be useful",
];

const genericSuggestionKeys = new Set([
  "compile information",
  "compile founder supplied information",
  "organize founder supplied information",
  "add more information",
  "review your information",
]);

const ignoredOverlapWords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "for",
  "before",
  "with",
  "your",
  "you",
  "is",
  "are",
  "be",
  "that",
  "this",
]);

export function normalizeSuggestionKey(text: string): string {
  let normalized = text.toLowerCase().trim();

  for (const phrase of fillerPhrases) {
    normalized = normalized.split(phrase).join(" ");
  }

  return normalized
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meaningfulTokens(text: string) {
  return normalizeSuggestionKey(text)
    .split(" ")
    .filter((word) => word.length > 2 && !ignoredOverlapWords.has(word));
}

function hasHighTokenOverlap(first: string, second: string) {
  const firstTokens = new Set(meaningfulTokens(first));
  const secondTokens = new Set(meaningfulTokens(second));
  const smallerTokenCount = Math.min(firstTokens.size, secondTokens.size);

  if (smallerTokenCount === 0) {
    return false;
  }

  let sharedCount = 0;
  for (const token of firstTokens) {
    if (secondTokens.has(token)) {
      sharedCount += 1;
    }
  }

  return sharedCount / smallerTokenCount > 0.7;
}

function isGenericSuggestion(item: string) {
  const key = normalizeSuggestionKey(item);

  return genericSuggestionKeys.has(key) || key.length < 10 || meaningfulTokens(key).length < 3;
}

function repeatsExistingText(item: string, existingText: string[]) {
  const key = normalizeSuggestionKey(item);

  return existingText.some((existing) => {
    const existingKey = normalizeSuggestionKey(existing);

    return (
      existingKey.length > 0 &&
      (key === existingKey || key.includes(existingKey) || existingKey.includes(key) || hasHighTokenOverlap(key, existingKey))
    );
  });
}

export function dedupeStrings(items: string[], existingText: string[] = [], maxItems = 5): string[] {
  const result: string[] = [];

  for (const item of items) {
    const trimmed = cleanText(item);
    const normalized = normalizeSuggestionKey(trimmed);

    if (!normalized || trimmed.length < 20 || isGenericSuggestion(trimmed) || repeatsExistingText(trimmed, existingText)) {
      continue;
    }

    const isDuplicate = result.some((existing) => {
      const existingNormalized = normalizeSuggestionKey(existing);

      return (
        existingNormalized === normalized ||
        existingNormalized.includes(normalized) ||
        normalized.includes(existingNormalized) ||
        hasHighTokenOverlap(existing, trimmed)
      );
    });

    if (!isDuplicate) {
      result.push(trimmed);
    }

    if (result.length >= maxItems) {
      break;
    }
  }

  return result;
}

function itemLabel(item: { title: string; description?: string; suggestedNextAction?: string }) {
  return cleanText(item.title || item.description || item.suggestedNextAction || "this checklist item");
}

function getTopItems(input: InformationSuggestionInput) {
  return (input.incompleteItems ?? []).filter((item) => item.title || item.description || item.suggestedNextAction).slice(0, 5);
}

function suggestionForItem(item: { title: string; description?: string; suggestedNextAction?: string }) {
  const titleKey = normalizeSuggestionKey(item.title);

  if (titleKey.includes("company basics")) {
    return "Add the company name, product or service description, current stage, primary location, and any operating notes still missing.";
  }

  if (titleKey.includes("founder roles")) {
    return "List each founder or contributor, their role, responsibilities, and what they have contributed so far.";
  }

  if (titleKey.includes("ownership context")) {
    return "Summarize any ownership discussions, expectations, written notes, and who participated in those conversations.";
  }

  if (titleKey.includes("contributor history")) {
    return "List each contributor, what they worked on, when they contributed, and whether the work was paid or documented.";
  }

  if (titleKey.includes("startup timeline")) {
    return "Create a timeline of key company events, major decisions, deadlines, launches, and fundraising conversations.";
  }

  if (titleKey.includes("matter preparation")) {
    return "Write down the matter background, relevant people, important dates, related records, and open questions.";
  }

  if (titleKey.includes("supporting records")) {
    return "List the records you already have, where they are stored, what each record relates to, and what is still missing.";
  }

  if (titleKey.includes("questions for counsel")) {
    return "Group your open questions by topic and add the facts or documents connected to each question.";
  }

  if (titleKey.includes("counsel packet review")) {
    return "Review the packet draft for missing names, dates, documents, open questions, and unclear background notes.";
  }

  const label = itemLabel(item);

  return `Add specific names, dates, documents, current status, and open questions related to ${label}.`;
}

export function getSuggestedMissingDetails(input: InformationSuggestionInput): string[] {
  const items = getTopItems(input);
  const suggestions = items.map(suggestionForItem);

  if (suggestions.length < 5 && typeof input.completionPercentage === "number" && input.completionPercentage < 100) {
    suggestions.push("Add any missing names, dates, documents, current status notes, and open decisions from the remaining checklist items.");
  }

  if (suggestions.length < 5 && input.context?.matterType) {
    suggestions.push(`Write a short background summary for ${cleanText(input.context.matterType)}, including people involved, dates, records, and open questions.`);
  }

  if (suggestions.length === 0) {
    suggestions.push("Add missing names, dates, documents, people involved, current status notes, and open questions from your checklist.");
  }

  return dedupeStrings(suggestions);
}

export function getQuestionsForCounsel(input: InformationSuggestionInput): string[] {
  const items = getTopItems(input);
  const questions = items.map((item) => `What additional information about ${itemLabel(item)} would be useful for counsel to review?`);

  if (questions.length < 5 && input.context?.matterType) {
    questions.push(`What background details about ${cleanText(input.context.matterType)} should we prepare before the discussion?`);
  }

  if (questions.length < 5) {
    questions.push("Are there specific documents, dates, or people counsel would like us to gather before the next conversation?");
  }

  return dedupeStrings(questions);
}
