import type { CompanyProfile } from "@/src/types/company";

export const venturePackStorageKey = "venturepack:onboarding";

export const emptyOnboardingData: CompanyProfile = {
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

export const akhilDemoData: CompanyProfile = {
  ...emptyOnboardingData,
  founderNames: "Akhil",
  founderRoles: "Founder",
  otherFounders: "Yes",
  ownershipDiscussed: "Yes",
  ownershipWrittenDown: "No",
  companyName: "VenturePack",
  businessDescription: "A pre-counsel preparation platform for startup founders.",
  productOrService: "Helps founders organize company information and prepare counsel packets.",
  developmentStage: "Prototype",
  revenueStatus: "No revenue yet",
  formationLocation: "Texas",
  expectedCustomerLocations: "United States",
  entityStatus: "Not formed",
  entityType: "Not sure",
  customersExist: "No",
  contractorsUsed: "No",
  personalInformationCollected: "Yes",
  regulatedIndustry: "No",
  operatesOutsideUs: "No",
  expectsToRaise: "Maybe",
  moneyAlreadyAccepted: "No",
  investorMeetingScheduled: "No",
  outsideCounselExists: "No",
  priorityMatter: "Prepare before speaking with a startup attorney.",
  counselQuestions:
    "What entity should we consider? What founder documents should we prepare? What IP records should we organize?",
  deadline: "No immediate deadline",
  documentInventory: "Pitch deck draft, product notes",
  legalBudget: "Under $1,000",
  communicationFormat: "Virtual",
};

export function readOnboardingData(): CompanyProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(venturePackStorageKey);
  if (!raw) {
    return null;
  }

  try {
    return { ...emptyOnboardingData, ...JSON.parse(raw) } as CompanyProfile;
  } catch {
    return null;
  }
}

export function saveOnboardingData(data: CompanyProfile) {
  window.localStorage.setItem(venturePackStorageKey, JSON.stringify(data));
}

export function clearOnboardingData() {
  window.localStorage.removeItem(venturePackStorageKey);
}
