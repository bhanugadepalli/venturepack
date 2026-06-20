export type PreparationCategory =
  | "Company structure"
  | "Founder alignment"
  | "Ownership information"
  | "Intellectual property"
  | "Contractors and employees"
  | "Customer activity"
  | "Privacy and data practices"
  | "Fundraising preparation"
  | "Corporate records"
  | "Counsel readiness";

export type PreparationItem = {
  category: PreparationCategory;
  completed: number;
  total: number;
  summary: string;
  nextStep: string;
};

export type PreparationCategoryScore = {
  category: PreparationCategory;
  percentComplete: number;
  missingItems: string[];
  nextAction: string;
  counselReviewSuggested: boolean;
};

export type PreparationScore = {
  completed: number;
  total: number;
  percent: number;
};
