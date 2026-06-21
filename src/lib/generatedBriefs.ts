type GeneratedBriefInput = {
  company?: any;
  session?: any;
  questions?: any[];
  answers?: any[];
  progress?: any;
};

type BriefSection = {
  title: string;
  founderSuppliedFacts: string[];
  platformOrganizedSummary: string;
  missingInformation: string[];
};

type BriefContent = {
  sections: BriefSection[];
  warnings: string[];
  disclaimer: string;
};

const notProvided = "Not yet provided.";
const counselDisclaimer = "VenturePack organizes preparation information. It is not a law firm and does not provide legal advice.";
const pitchDisclaimer =
  "VenturePack organizes founder-supplied preparation information. This brief does not claim investor approval, funding readiness, or investment quality.";

function text(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function valueText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(valueText).filter(Boolean).join("; ");
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, nextValue]) => {
        const nextText = valueText(nextValue);
        return nextText ? `${key}: ${nextText}` : "";
      })
      .filter(Boolean)
      .join("; ");
  }
  return "";
}

function asArray(value: any[] | null | undefined): any[] {
  return Array.isArray(value) ? value : [];
}

function questionId(question: any): string {
  return text(question?.id || question?.questionId || question?.questionKey);
}

function answerQuestionId(answer: any): string {
  return text(answer?.questionId || answer?.questionKey);
}

function answerForQuestion(question: any, answers: any[]) {
  const id = questionId(question);
  return answers.find((answer) => answerQuestionId(answer) === id);
}

function questionAnswerFacts(input: GeneratedBriefInput, matcher: (question: any) => boolean) {
  const answers = asArray(input.answers);

  return asArray(input.questions)
    .filter(matcher)
    .map((question) => {
      const answer = answerForQuestion(question, answers);
      const answerText = valueText(answer?.value);
      return answerText ? `${text(question.questionText)} ${answerText}` : "";
    })
    .filter(Boolean);
}

function missingFromQuestions(input: GeneratedBriefInput, matcher: (question: any) => boolean) {
  const answers = asArray(input.answers);

  return asArray(input.questions)
    .filter(matcher)
    .filter((question) => !valueText(answerForQuestion(question, answers)?.value))
    .map((question) => text(question.questionText))
    .filter(Boolean);
}

function companyFacts(company: any, keys: string[]) {
  return keys
    .map((key) => {
      const nextText = valueText(company?.[key]);
      return nextText ? `${key}: ${nextText}` : "";
    })
    .filter(Boolean);
}

function factsOrNotProvided(facts: string[]) {
  return facts.length > 0 ? facts : [notProvided];
}

function missingOrDefault(missing: string[]) {
  return missing.length > 0 ? missing : [notProvided];
}

function section(title: string, facts: string[], summary: string, missing: string[]): BriefSection {
  return {
    title,
    founderSuppliedFacts: factsOrNotProvided(facts),
    platformOrganizedSummary: summary || notProvided,
    missingInformation: missingOrDefault(missing),
  };
}

function categoryMatcher(categoryKey: string) {
  return (question: any) => text(question?.categoryKey) === categoryKey;
}

function keyMatcher(keys: string[]) {
  return (question: any) => keys.some((key) => text(question?.questionKey).includes(key));
}

function combinedMissing(input: GeneratedBriefInput) {
  const progressMissing = asArray(input.progress?.topMissingFacts).map(text).filter(Boolean);
  const questionMissing = missingFromQuestions(input, () => true);

  return [...progressMissing, ...questionMissing].filter(Boolean);
}

export function getBriefMissingInformation(input: GeneratedBriefInput) {
  return missingOrDefault(combinedMissing(input));
}

export function generateCounselBriefContent(input: GeneratedBriefInput): BriefContent {
  const company = input.company ?? {};
  const warnings = getBriefMissingInformation(input);

  return {
    sections: [
      section(
        "Company Overview",
        [
          ...companyFacts(company, ["companyName", "proposedCompanyName", "businessDescription", "productDescription", "developmentStage"]),
          ...questionAnswerFacts(input, categoryMatcher("VENTURE_BASICS")),
        ],
        "Platform-organized summary of the company background using saved company details and checklist answers.",
        missingFromQuestions(input, categoryMatcher("VENTURE_BASICS")),
      ),
      section(
        "Founder and Contributor Information",
        questionAnswerFacts(input, categoryMatcher("TEAM_AND_FOUNDERS")),
        "Platform-organized summary of founder, contributor, contractor, and team information supplied by the founder.",
        missingFromQuestions(input, categoryMatcher("TEAM_AND_FOUNDERS")),
      ),
      section(
        "Formation and Operating Status",
        companyFacts(company, ["existingEntityStatus", "entityType", "formationState", "primaryOperatingLocation", "revenueStatus"]),
        "Platform-organized summary of saved formation and operating-status fields.",
        ["Confirm any missing entity, location, operating, or revenue-status details."],
      ),
      section(
        "Product, Assets, and Ownership Notes",
        [
          ...questionAnswerFacts(input, categoryMatcher("PRODUCT_OR_SERVICE")),
          ...questionAnswerFacts(input, categoryMatcher("ASSETS_AND_OWNERSHIP")),
        ],
        "Platform-organized summary of product, asset, creator, and ownership-context notes supplied by the founder.",
        [
          ...missingFromQuestions(input, categoryMatcher("PRODUCT_OR_SERVICE")),
          ...missingFromQuestions(input, categoryMatcher("ASSETS_AND_OWNERSHIP")),
        ],
      ),
      section(
        "Contractors, Employees, and User Data",
        [
          ...companyFacts(company, ["contractorsUsed", "employeesUsed", "personalInfoCollected"]),
          ...questionAnswerFacts(input, keyMatcher(["contractor", "employee", "accounts", "data", "inputs"])),
        ],
        "Platform-organized summary of saved contractor, employee, user-account, and data-collection facts.",
        missingFromQuestions(input, keyMatcher(["contractor", "employee", "accounts", "data", "inputs"])),
      ),
      section(
        "Fundraising and Pitch Activity",
        [
          ...companyFacts(company, ["expectsToRaiseMoney", "moneyAlreadyAccepted", "investorMeetingScheduled", "pitchCompetitionApproaching"]),
          ...questionAnswerFacts(input, categoryMatcher("PITCH_PREPARATION")),
        ],
        "Platform-organized summary of saved fundraising and pitch-preparation facts.",
        missingFromQuestions(input, categoryMatcher("PITCH_PREPARATION")),
      ),
      section(
        "Documents Available and Missing",
        [
          ...companyFacts(company, ["documentsAvailable", "dataRoomExists"]),
          ...questionAnswerFacts(input, keyMatcher(["documents", "records", "materials", "files"])),
        ],
        "Platform-organized summary of documents, links, records, and materials identified by the founder.",
        missingFromQuestions(input, keyMatcher(["documents", "records", "materials", "files"])),
      ),
      section(
        "Questions for Counsel",
        questionAnswerFacts(input, categoryMatcher("COUNSEL_PREPARATION")),
        "Platform-organized list of founder-supplied questions and discussion goals for counsel.",
        missingFromQuestions(input, categoryMatcher("COUNSEL_PREPARATION")),
      ),
      section(
        "Information Requiring Verification",
        getBriefMissingInformation(input),
        "Platform-organized list of missing or unconfirmed information to verify before using this brief.",
        getBriefMissingInformation(input),
      ),
      section("Disclaimer", [counselDisclaimer], counselDisclaimer, [notProvided]),
    ],
    warnings,
    disclaimer: counselDisclaimer,
  };
}

export function generatePitchBriefContent(input: GeneratedBriefInput): BriefContent {
  const company = input.company ?? {};
  const tractionFacts = [
    ...companyFacts(company, ["revenueStatus"]),
    ...questionAnswerFacts(input, keyMatcher(["traction", "evidence", "customer_evidence", "transactions"])),
  ];
  const warnings = getBriefMissingInformation(input);

  return {
    sections: [
      section(
        "One Sentence Venture Summary",
        [
          ...companyFacts(company, ["companyName", "businessDescription"]),
          ...questionAnswerFacts(input, keyMatcher(["one_sentence_summary"])),
        ],
        "Platform-organized venture summary using founder-supplied description fields.",
        missingFromQuestions(input, keyMatcher(["one_sentence_summary"])),
      ),
      section(
        "Problem",
        questionAnswerFacts(input, keyMatcher(["customer_problem"])),
        "Platform-organized summary of the customer problem described by the founder.",
        missingFromQuestions(input, keyMatcher(["customer_problem"])),
      ),
      section(
        "Solution",
        [
          ...companyFacts(company, ["productDescription"]),
          ...questionAnswerFacts(input, categoryMatcher("PRODUCT_OR_SERVICE")),
        ],
        "Platform-organized product or service summary from saved facts.",
        missingFromQuestions(input, categoryMatcher("PRODUCT_OR_SERVICE")),
      ),
      section(
        "Target Customer",
        questionAnswerFacts(input, keyMatcher(["customer_target", "customer_type", "demand_side", "campus_users"])),
        "Platform-organized target customer summary.",
        missingFromQuestions(input, keyMatcher(["customer_target", "customer_type", "demand_side", "campus_users"])),
      ),
      section(
        "Current Product Status",
        [
          ...companyFacts(company, ["developmentStage"]),
          ...questionAnswerFacts(input, keyMatcher(["current_status", "demo_status", "venture_current_stage"])),
        ],
        "Platform-organized product status summary from saved facts.",
        missingFromQuestions(input, keyMatcher(["current_status", "demo_status", "venture_current_stage"])),
      ),
      section(
        "Traction and Validation Evidence",
        tractionFacts.length > 0 ? tractionFacts : ["Traction or validation evidence has not yet been provided."],
        tractionFacts.length > 0
          ? "Platform-organized summary of founder-supplied traction or validation evidence."
          : "Traction or validation evidence has not yet been provided.",
        tractionFacts.length > 0 ? missingFromQuestions(input, keyMatcher(["customer_evidence", "transactions"])) : ["Traction or validation evidence has not yet been provided."],
      ),
      section(
        "Team",
        questionAnswerFacts(input, categoryMatcher("TEAM_AND_FOUNDERS")),
        "Platform-organized team summary from founder-supplied details.",
        missingFromQuestions(input, categoryMatcher("TEAM_AND_FOUNDERS")),
      ),
      section(
        "Assets",
        questionAnswerFacts(input, categoryMatcher("ASSETS_AND_OWNERSHIP")),
        "Platform-organized asset summary from founder-supplied details.",
        missingFromQuestions(input, categoryMatcher("ASSETS_AND_OWNERSHIP")),
      ),
      section(
        "Milestones and Next Steps",
        [
          ...questionAnswerFacts(input, keyMatcher(["next_milestone", "pitch_deadline", "venture_timeline", "launch"])),
          ...companyFacts(company, ["knownDeadlines", "primaryPreparationReason"]),
        ],
        "Platform-organized milestone and next-step summary.",
        missingFromQuestions(input, keyMatcher(["next_milestone", "pitch_deadline", "venture_timeline", "launch"])),
      ),
      section(
        "Open Questions and Risks",
        [
          ...companyFacts(company, ["founderQuestions", "unresolvedDecisions"]),
          ...questionAnswerFacts(input, keyMatcher(["open_questions", "open_decisions"])),
        ],
        "Platform-organized open questions and unresolved items supplied by the founder.",
        missingFromQuestions(input, keyMatcher(["open_questions", "open_decisions"])),
      ),
      section(
        "Presentation Notes",
        questionAnswerFacts(input, categoryMatcher("PITCH_PREPARATION")),
        "Platform-organized presentation notes from saved pitch-preparation answers.",
        missingFromQuestions(input, categoryMatcher("PITCH_PREPARATION")),
      ),
    ],
    warnings,
    disclaimer: pitchDisclaimer,
  };
}
