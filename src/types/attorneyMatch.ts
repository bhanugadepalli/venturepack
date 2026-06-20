export type AttorneyMatchRequest = {
  legalSubjectArea: string;
  stateOrJurisdiction: string;
  companyStage: string;
  matterUrgency: string;
  preferredPricingStructure: string;
  estimatedBudget: string;
  preferredCommunicationMethod: string;
  languagePreferences: string;
  virtualOrLocalCounsel: string;
  alreadyHasCounsel: string;
  consentToShareSummary: boolean;
  submittedAt: string;
};
