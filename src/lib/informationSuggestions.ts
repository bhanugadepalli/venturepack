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

function normalizeForCompare(value: string) {
  return cleanText(value).toLowerCase();
}

export function dedupeStrings(items: string[]): string[] {
  const result: string[] = [];

  for (const item of items) {
    const trimmed = cleanText(item);
    const normalized = normalizeForCompare(trimmed);

    if (!normalized) {
      continue;
    }

    const isDuplicate = result.some((existing) => {
      const existingNormalized = normalizeForCompare(existing);

      return (
        existingNormalized === normalized ||
        existingNormalized.includes(normalized) ||
        normalized.includes(existingNormalized)
      );
    });

    if (!isDuplicate) {
      result.push(trimmed);
    }

    if (result.length >= 5) {
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

export function getSuggestedMissingDetails(input: InformationSuggestionInput): string[] {
  const items = getTopItems(input);
  const suggestions = items.map((item) => {
    const label = itemLabel(item);
    const nextAction = item.suggestedNextAction ? ` Include notes for: ${cleanText(item.suggestedNextAction)}` : "";

    return `Compile the facts, dates, names, documents, and current status related to ${label}.${nextAction}`;
  });

  if (suggestions.length < 5 && typeof input.completionPercentage === "number" && input.completionPercentage < 100) {
    suggestions.push("Review the remaining checklist items and add any known dates, people involved, files, and open decisions.");
  }

  if (suggestions.length < 5 && input.context?.matterType) {
    suggestions.push(`Organize the information connected to ${cleanText(input.context.matterType)} so counsel can quickly understand the background.`);
  }

  if (suggestions.length === 0) {
    suggestions.push("Review your preparation checklist and compile any missing facts, dates, documents, people, and open questions.");
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
