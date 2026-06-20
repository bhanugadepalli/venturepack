import type { CompanyProfile } from "@/src/types/company";
import type {
  PreparationCategory,
  PreparationCategoryScore,
  PreparationItem,
  PreparationScore,
} from "@/src/types/readiness";

type Rule = {
  complete: boolean;
  missingItem: string;
};

function filled(value: string) {
  return value.trim().length > 0;
}

function saysYes(value: string) {
  return ["yes", "y", "true"].includes(value.trim().toLowerCase());
}

function saysNo(value: string) {
  return ["no", "n", "false"].includes(value.trim().toLowerCase());
}

function mentionsAny(value: string, terms: string[]) {
  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function scoreRules({
  category,
  rules,
  nextAction,
  counselReviewSuggested = false,
}: {
  category: PreparationCategory;
  rules: Rule[];
  nextAction: string;
  counselReviewSuggested?: boolean;
}): PreparationCategoryScore {
  const completed = rules.filter((rule) => rule.complete).length;
  const percentComplete = rules.length === 0 ? 0 : Math.round((completed / rules.length) * 100);

  return {
    category,
    percentComplete,
    missingItems: rules.filter((rule) => !rule.complete).map((rule) => rule.missingItem),
    nextAction,
    counselReviewSuggested,
  };
}

export function calculatePreparationScore(items: Array<PreparationCategoryScore | PreparationItem>): PreparationScore {
  const total = items.reduce((sum, item) => sum + ("percentComplete" in item ? 100 : item.total), 0);
  const completed = items.reduce(
    (sum, item) => sum + ("percentComplete" in item ? item.percentComplete : item.completed),
    0,
  );

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getCategoryPercent(item: PreparationCategoryScore | PreparationItem): number {
  if ("percentComplete" in item) {
    return item.percentComplete;
  }

  return item.total === 0 ? 0 : Math.round((item.completed / item.total) * 100);
}

export function scorePreparationCategories(profile: CompanyProfile): PreparationCategoryScore[] {
  const multipleFounders = saysYes(profile.otherFounders);
  const ownershipNotWritten = !saysYes(profile.ownershipWrittenDown);
  const ipLikelyInvolved = mentionsAny(
    [
      profile.productOrService,
      profile.businessDescription,
      profile.ipSummary,
      profile.documentInventory,
    ].join(" "),
    ["software", "design", "designs", "content", "trademark", "trademarks", "patent", "patents", "trade secret"],
  );
  const ipContributorsUnclear = !filled(profile.ipSummary) || !mentionsAny(profile.ipSummary, ["founder", "contractor", "employee", "created", "contributor"]);
  const contractorsUsed = saysYes(profile.contractorsUsed);
  const contractorAgreementsPresent = mentionsAny(profile.contractorsSummary, ["agreement", "signed", "contract"]);
  const personalInfoCollected = saysYes(profile.personalInformationCollected);
  const privacyPolicyPresent = mentionsAny(profile.dataPractices, ["privacy policy", "policy"]);
  const fundraisingExpected = saysYes(profile.expectsToRaise) || profile.expectsToRaise.trim().toLowerCase() === "maybe";
  const noOutsideCounsel = saysNo(profile.outsideCounselExists);

  return [
    scoreRules({
      category: "Company structure",
      rules: [
        { complete: filled(profile.companyName), missingItem: "Company name" },
        { complete: filled(profile.businessDescription), missingItem: "Business description" },
        { complete: filled(profile.productOrService), missingItem: "Product or service description" },
        { complete: filled(profile.developmentStage), missingItem: "Development stage" },
        { complete: filled(profile.revenueStatus), missingItem: "Revenue status" },
        { complete: filled(profile.formationLocation), missingItem: "Primary operating location" },
        { complete: filled(profile.expectedCustomerLocations), missingItem: "Expected customer locations" },
        { complete: filled(profile.entityStatus), missingItem: "Existing entity status" },
        { complete: filled(profile.entityType), missingItem: "Entity type preference or uncertainty" },
      ],
      nextAction: "Confirm company basics and note any entity questions for counsel.",
    }),
    scoreRules({
      category: "Founder alignment",
      rules: [
        { complete: filled(profile.founderNames), missingItem: "Founder names" },
        { complete: filled(profile.founderRoles), missingItem: "Founder roles" },
        { complete: filled(profile.otherFounders), missingItem: "Other founder status" },
        {
          complete: !(multipleFounders && ownershipNotWritten),
          missingItem: "Written ownership understanding",
        },
      ],
      nextAction: multipleFounders
        ? "Write down founder ownership and role assumptions before counsel review."
        : "Capture any founder role or ownership questions before counsel review.",
      counselReviewSuggested: multipleFounders && ownershipNotWritten,
    }),
    scoreRules({
      category: "Ownership information",
      rules: [
        { complete: filled(profile.ownershipDiscussed), missingItem: "Ownership discussion status" },
        { complete: saysYes(profile.ownershipWrittenDown), missingItem: "Written ownership understanding" },
        { complete: filled(profile.ownershipSummary), missingItem: "Ownership notes or open questions" },
      ],
      nextAction: "Document current ownership expectations and unresolved ownership questions.",
      counselReviewSuggested: ownershipNotWritten && (multipleFounders || saysYes(profile.ownershipDiscussed)),
    }),
    scoreRules({
      category: "Intellectual property",
      rules: [
        { complete: filled(profile.productOrService), missingItem: "Product or service assets" },
        { complete: !ipLikelyInvolved || filled(profile.ipSummary), missingItem: "IP asset inventory" },
        {
          complete: !ipLikelyInvolved || !ipContributorsUnclear,
          missingItem: "IP contributor and ownership notes",
        },
      ],
      nextAction: "List product assets and identify who created software, designs, content, marks, patents, or confidential know-how.",
      counselReviewSuggested: ipLikelyInvolved && ipContributorsUnclear,
    }),
    scoreRules({
      category: "Contractors and employees",
      rules: [
        { complete: filled(profile.contractorsUsed), missingItem: "Contractor or employee status" },
        { complete: !contractorsUsed || filled(profile.contractorsSummary), missingItem: "Contractor or employee notes" },
        {
          complete: !contractorsUsed || contractorAgreementsPresent,
          missingItem: "Contractor agreements",
        },
      ],
      nextAction: "Confirm who contributed work and whether signed agreements are available.",
      counselReviewSuggested: contractorsUsed && !contractorAgreementsPresent,
    }),
    scoreRules({
      category: "Customer activity",
      rules: [
        { complete: filled(profile.customersExist), missingItem: "Customer status" },
        { complete: filled(profile.revenueStatus), missingItem: "Revenue status" },
        { complete: !saysYes(profile.customersExist) || filled(profile.customerActivity), missingItem: "Customer activity notes" },
      ],
      nextAction: "Summarize customers, pilots, revenue, and promises made to customers or prospects.",
      counselReviewSuggested: saysYes(profile.customersExist) && !filled(profile.customerActivity),
    }),
    scoreRules({
      category: "Privacy and data practices",
      rules: [
        { complete: filled(profile.personalInformationCollected), missingItem: "Personal information collection status" },
        { complete: filled(profile.regulatedIndustry), missingItem: "Regulated industry status" },
        { complete: filled(profile.operatesOutsideUs), missingItem: "International operations status" },
        { complete: !personalInfoCollected || filled(profile.dataPractices), missingItem: "Data practice notes" },
        {
          complete: !personalInfoCollected || privacyPolicyPresent,
          missingItem: "Privacy policy",
        },
      ],
      nextAction: "Document what personal information is collected and whether a privacy policy exists.",
      counselReviewSuggested: personalInfoCollected && !privacyPolicyPresent,
    }),
    scoreRules({
      category: "Fundraising preparation",
      rules: [
        { complete: filled(profile.expectsToRaise), missingItem: "Fundraising expectation" },
        { complete: filled(profile.moneyAlreadyAccepted), missingItem: "Money already accepted status" },
        { complete: filled(profile.investorMeetingScheduled), missingItem: "Investor meeting status" },
        { complete: !fundraisingExpected || filled(profile.fundraisingMaterials), missingItem: "Fundraising materials" },
        { complete: !fundraisingExpected || filled(profile.fundraisingTimeline), missingItem: "Fundraising timeline" },
      ],
      nextAction: "Organize fundraising materials, timeline, and any investor conversation notes.",
      counselReviewSuggested: fundraisingExpected && noOutsideCounsel,
    }),
    scoreRules({
      category: "Corporate records",
      rules: [
        { complete: filled(profile.documentInventory), missingItem: "Document inventory" },
        { complete: !mentionsAny(profile.entityStatus, ["formed", "existing"]) || mentionsAny(profile.documentInventory, ["formation", "certificate", "approval", "stock"]), missingItem: "Formation and ownership records" },
      ],
      nextAction: "List available formation, ownership, approval, tax, and product records.",
    }),
    scoreRules({
      category: "Counsel readiness",
      rules: [
        { complete: filled(profile.outsideCounselExists), missingItem: "Outside counsel status" },
        { complete: filled(profile.priorityMatter), missingItem: "Primary reason for preparation" },
        { complete: filled(profile.counselQuestions), missingItem: "Questions for counsel" },
        { complete: filled(profile.deadline), missingItem: "Timing or deadline" },
        { complete: filled(profile.legalBudget), missingItem: "Budget range" },
        { complete: filled(profile.communicationFormat), missingItem: "Preferred communication format" },
      ],
      nextAction: "Prioritize the first counsel conversation around the submitted reason, questions, timing, and budget.",
      counselReviewSuggested: filled(profile.priorityMatter) && filled(profile.counselQuestions),
    }),
  ];
}

export const buildPreparationItemsFromOnboarding = scorePreparationCategories;
