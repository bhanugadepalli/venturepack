import type { CompanyProfile } from "@/src/types/company";

export const emptyCompanyProfile: CompanyProfile = {
  founderNames: "",
  founderRoles: "",
  founderEmails: "",
  founderQuestions: "",
  otherFounders: "",
  ownershipDiscussed: "",
  ownershipWrittenDown: "",
  companyName: "",
  entityStatus: "",
  entityType: "",
  formationLocation: "",
  expectedCustomerLocations: "",
  businessDescription: "",
  productOrService: "",
  developmentStage: "",
  revenueStatus: "",
  ownershipSummary: "",
  ipSummary: "",
  contractorsSummary: "",
  customersExist: "",
  contractorsUsed: "",
  customerActivity: "",
  personalInformationCollected: "",
  regulatedIndustry: "",
  operatesOutsideUs: "",
  dataPractices: "",
  expectsToRaise: "",
  moneyAlreadyAccepted: "",
  investorMeetingScheduled: "",
  fundraisingTarget: "",
  investorConversations: "",
  fundraisingMaterials: "",
  fundraisingTimeline: "",
  outsideCounselExists: "",
  priorityMatter: "",
  counselQuestions: "",
  documentInventory: "",
  deadline: "",
  legalBudget: "",
  communicationFormat: "",
  meetingGoals: "",
  submittedAt: "",
};

export function normalizeCompanyProfile(input: Partial<CompanyProfile>): CompanyProfile {
  return {
    ...emptyCompanyProfile,
    ...Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, typeof value === "string" ? value : ""]),
    ),
  };
}

export function stringToBoolean(value: string): boolean | null {
  const normalized = value.trim().toLowerCase();

  if (["yes", "true", "y"].includes(normalized)) {
    return true;
  }

  if (["no", "false", "n"].includes(normalized)) {
    return false;
  }

  return null;
}
