export type MatterStatus = "Draft" | "Information gathering" | "Ready for counsel review";

export type MatterType =
  | "Adding a cofounder"
  | "Hiring a contractor"
  | "Preparing for fundraising"
  | "Organizing ownership information"
  | "Documenting IP contributors"
  | "Responding to an investor request"
  | "Preparing for a customer contract"
  | "Preparing for a lawyer meeting";

export type Matter = {
  id: string;
  title: string;
  type: MatterType;
  status: MatterStatus;
  founderObjective: string;
  description: string;
  knownDeadline: string;
  relevantPeople: string;
  relatedDocuments: string;
  openQuestions: string;
  missingInformation: string;
  recommendedNextPreparationStep: string;
  createdAt: string;
};
