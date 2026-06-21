export type PreparationStatus = "not_started" | "in_progress" | "needs_review" | "complete";

export type PreparationChecklistItem = {
  id: string;
  title: string;
  description: string;
  status: PreparationStatus;
  suggestedNextAction: string;
  href: string;
};

export type PreparationChecklistInput = {
  company?: unknown;
  profile?: unknown;
  people?: unknown[] | null;
  relationships?: unknown[] | null;
  matters?: unknown[] | null;
  counselPackets?: unknown[] | null;
  preparationTasks?: unknown[] | null;
  attorneyMatchRequests?: unknown[] | null;
};

export type PreparationChecklistData = PreparationChecklistInput;

const nextActions = {
  companyBasics: "Add core company details so your workspace has a reliable starting point.",
  founderRoles: "Clarify who is involved and what each person is contributing.",
  ownershipContext: "Compile any ownership discussions or expectations that have already happened.",
  contributorHistory: "Record who has contributed work, when, and whether anything was documented.",
  startupTimeline: "Add key events so the company history is easier to understand.",
  matterPreparation: "Choose a matter and compile the facts, context, and open questions around it.",
  supportingRecords: "Attach or list supporting records that may help explain the company context.",
  questionsForCounsel: "Prepare open questions you want to discuss with qualified counsel.",
  counselPacketReview: "Review your packet before sharing or downloading it.",
} as const;

const descriptions = {
  companyBasics: "Core company facts, product context, stage, location, and operating basics.",
  founderRoles: "Founder involvement, roles, responsibilities, and contribution context.",
  ownershipContext: "Ownership discussions, expectations, written notes, and relationship context.",
  contributorHistory: "Contributor, contractor, IP, and work-history information.",
  startupTimeline: "Key company events, deadlines, stage history, and preparation timing.",
  matterPreparation: "Matter objective, facts, people, records, missing information, and open questions.",
  supportingRecords: "Document inventory, related materials, notes, drafts, and supporting records.",
  questionsForCounsel: "Open questions and meeting goals to discuss with qualified counsel.",
  counselPacketReview: "Founder review status and packet preparation context before sharing or downloading.",
} as const;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown[] | null | undefined): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function getText(source: unknown, keys: string[]): string {
  const record = asRecord(source);

  for (const key of keys) {
    const value = text(record[key]);

    if (value) {
      return value;
    }
  }

  return "";
}

function hasText(source: unknown, keys: string[]): boolean {
  return Boolean(getText(source, keys));
}

function countPresent(source: unknown, keyGroups: string[][]): number {
  return keyGroups.filter((keys) => hasText(source, keys)).length;
}

function anyItemHasText(items: unknown[], keyGroups: string[][]): boolean {
  return items.some((item) => countPresent(item, keyGroups) > 0);
}

function itemCountWithText(items: unknown[], keyGroups: string[][]): number {
  return items.filter((item) => countPresent(item, keyGroups) > 0).length;
}

function statusFromCount(count: number, total: number, reviewThreshold = total): PreparationStatus {
  if (count <= 0) {
    return "not_started";
  }

  if (count >= total) {
    return "complete";
  }

  if (count >= reviewThreshold) {
    return "needs_review";
  }

  return "in_progress";
}

function completeWhen(condition: boolean, fallback: PreparationStatus): PreparationStatus {
  return condition ? "complete" : fallback;
}

function item(
  id: string,
  title: string,
  description: string,
  status: PreparationStatus,
  suggestedNextAction: string,
  href: string,
): PreparationChecklistItem {
  return { id, title, description, status, suggestedNextAction, href };
}

export function getPreparationChecklist(input: PreparationChecklistInput = {}): PreparationChecklistItem[] {
  const company = input.company ?? input.profile ?? null;
  const people = asArray(input.people);
  const relationships = asArray(input.relationships);
  const matters = asArray(input.matters);
  const counselPackets = asArray(input.counselPackets);
  const preparationTasks = asArray(input.preparationTasks);
  const attorneyMatchRequests = asArray(input.attorneyMatchRequests);

  const companyBasicsCount = countPresent(company, [
    ["companyName", "proposedCompanyName", "name"],
    ["businessDescription", "description", "industry"],
    ["productDescription", "productOrService", "product", "service"],
    ["developmentStage", "stage", "companyStage"],
    ["primaryOperatingLocation", "formationLocation", "location"],
  ]);

  const peopleWithRoles = itemCountWithText(people, [["role"], ["contributionDescription", "contribution", "ownershipSummary"]]);
  const profileFounderSignals = countPresent(company, [["founderNames"], ["founderRoles"], ["otherFounders"]]);
  const founderRolesStatus = people.length > 0
    ? completeWhen(peopleWithRoles >= people.length && peopleWithRoles > 0, peopleWithRoles > 0 ? "in_progress" : "not_started")
    : statusFromCount(profileFounderSignals, 3, 2);

  const ownershipRelationshipSignals = itemCountWithText(relationships, [
    ["ownershipDiscussed"],
    ["ownershipWrittenDown"],
    ["relationshipType"],
    ["confirmationStatus"],
  ]);
  const ownershipProfileSignals = countPresent(company, [["ownershipDiscussed"], ["ownershipWrittenDown"], ["ownershipSummary"]]);
  const ownershipStatus = relationships.length > 0
    ? statusFromCount(ownershipRelationshipSignals, Math.min(relationships.length * 2, 4), 2)
    : statusFromCount(ownershipProfileSignals, 3, 2);

  const contributorRelationshipSignals = itemCountWithText(relationships, [
    ["contributionDescription"],
    ["sourceOfInformation"],
    ["relationshipType"],
  ]);
  const contributorProfileSignals = countPresent(company, [["ipSummary"], ["contractorsSummary"], ["contractorsUsed"], ["founderRoles"]]);
  const contributorStatus = relationships.length > 0 || people.length > 0
    ? statusFromCount(contributorRelationshipSignals + peopleWithRoles, Math.max(2, relationships.length), 2)
    : statusFromCount(contributorProfileSignals, 4, 3);

  // Timeline fields are not yet formalized, so this heuristic stays conservative and only uses available history-like text.
  const timelineSignals = countPresent(company, [
    ["developmentStage", "stage"],
    ["createdAt", "submittedAt"],
    ["fundraisingTimeline", "deadline"],
    ["businessDescription", "companyHistory", "timeline"],
  ]) + (anyItemHasText(matters, [["createdAt"], ["knownDeadline", "deadline"], ["description"]]) ? 1 : 0);
  const timelineStatus = timelineSignals >= 3 ? "in_progress" : timelineSignals > 0 ? "in_progress" : "not_started";

  const bestMatter = matters[0] ?? null;
  const matterSignals = bestMatter
    ? countPresent(bestMatter, [
        ["title"],
        ["matterType", "type"],
        ["founderObjective"],
        ["description"],
        ["openQuestions"],
        ["missingInformation"],
      ])
    : 0;
  const matterStatus = matters.length > 0 ? statusFromCount(matterSignals, 6, 4) : "not_started";

  const supportingRecordSignals = countPresent(company, [["documentsAvailable", "documentInventory"], ["fundraisingMaterials"]])
    + itemCountWithText(matters, [["relatedDocuments"]])
    + itemCountWithText(preparationTasks, [["completionEvidence"], ["requiredInformation"]]);
  const supportingRecordsStatus = statusFromCount(supportingRecordSignals, 3, 2);

  const questionSignals = countPresent(company, [["questions", "counselQuestions"], ["meetingGoals"], ["founderQuestions"]])
    + itemCountWithText(matters, [["openQuestions"], ["founderObjective"]])
    + itemCountWithText(attorneyMatchRequests, [["legalSubjectArea"], ["matterUrgency"]]);
  const questionsStatus = statusFromCount(questionSignals, 3, 2);

  const packetSignals = itemCountWithText(counselPackets, [["founderApprovalStatus"], ["includedInformation"], ["generatedContent"]])
    + countPresent(company, [["companyName", "name"], ["documentInventory", "documentsAvailable"], ["counselQuestions", "questions"]])
    + (matters.length > 0 ? 1 : 0);
  const packetStatus = counselPackets.length > 0 ? statusFromCount(packetSignals, 4, 2) : statusFromCount(packetSignals, 4, 3);

  return [
    item("company-basics", "Company Basics", descriptions.companyBasics, statusFromCount(companyBasicsCount, 5, 4), nextActions.companyBasics, "/app/company"),
    item("founder-roles", "Founder Roles", descriptions.founderRoles, founderRolesStatus, nextActions.founderRoles, "/app/onboarding"),
    item("ownership-context", "Ownership Context", descriptions.ownershipContext, ownershipStatus, nextActions.ownershipContext, "/app/onboarding"),
    item("contributor-history", "Contributor History", descriptions.contributorHistory, contributorStatus, nextActions.contributorHistory, "/app/company"),
    item("startup-timeline", "Startup Timeline", descriptions.startupTimeline, timelineStatus, nextActions.startupTimeline, "/app/company"),
    item("matter-preparation", "Matter Preparation", descriptions.matterPreparation, matterStatus, nextActions.matterPreparation, "/app/matters"),
    item("supporting-records", "Supporting Records", descriptions.supportingRecords, supportingRecordsStatus, nextActions.supportingRecords, "/app/counsel-packet"),
    item("questions-for-counsel", "Questions for Counsel", descriptions.questionsForCounsel, questionsStatus, nextActions.questionsForCounsel, "/app/matters"),
    item("counsel-packet-review", "Counsel Packet Review", descriptions.counselPacketReview, packetStatus, nextActions.counselPacketReview, "/app/counsel-packet"),
  ];
}

export function calculatePreparationCompletion(items: PreparationChecklistItem[]) {
  if (!items.length) {
    return 0;
  }

  const weights: Record<PreparationStatus, number> = {
    complete: 1,
    needs_review: 0.75,
    in_progress: 0.5,
    not_started: 0,
  };
  const total = items.reduce((sum, checklistItem) => sum + weights[checklistItem.status], 0);

  return Math.round((total / items.length) * 100);
}

export function getPreparationStatusLabel(status: PreparationStatus) {
  switch (status) {
    case "not_started":
      return "Not started";
    case "in_progress":
      return "In progress";
    case "needs_review":
      return "Needs review";
    case "complete":
      return "Complete";
  }
}

export function getPreparationStatusTone(status: PreparationStatus) {
  switch (status) {
    case "not_started":
      return "slate";
    case "in_progress":
      return "blue";
    case "needs_review":
      return "amber";
    case "complete":
      return "green";
  }
}

export function getIncompletePreparationItems(items: PreparationChecklistItem[]) {
  return items.filter((item) => item.status !== "complete");
}
