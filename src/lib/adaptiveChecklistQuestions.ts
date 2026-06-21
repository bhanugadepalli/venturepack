import { fixedCategories } from "@/src/lib/adaptiveChecklist";

export type AdaptiveChecklistQuestionTemplate = {
  categoryKey: string;
  categoryName: string;
  questionKey: string;
  questionText: string;
  answerType: "text" | "textarea" | "boolean" | "date" | "select" | "multiselect" | "url";
  required: boolean;
  whyItMatters: string;
  outputUse: "COUNSEL_BRIEF" | "PITCH_BRIEF" | "BOTH";
  sortOrder: number;
};

type AdaptiveChecklistQuestionInput = {
  businessType: string;
  ventureStage: string;
  immediateGoal: string;
  teamStatus?: string | null;
  timeline?: string | null;
};

type QuestionSeed = Omit<AdaptiveChecklistQuestionTemplate, "categoryKey" | "categoryName" | "sortOrder">;

const categoryOrder = [
  "VENTURE_BASICS",
  "TEAM_AND_FOUNDERS",
  "PRODUCT_OR_SERVICE",
  "CUSTOMER_AND_MARKET_FACTS",
  "ASSETS_AND_OWNERSHIP",
  "PITCH_PREPARATION",
  "COUNSEL_PREPARATION",
  "LAUNCH_PREPARATION",
] as const;

function includesAny(value: string, terms: string[]) {
  const normalized = value.toLowerCase();

  return terms.some((term) => normalized.includes(term));
}

function clean(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function productQuestion(input: AdaptiveChecklistQuestionInput): QuestionSeed[] {
  const businessType = clean(input.businessType);

  if (businessType === "AI tool") {
    return [
      {
        questionKey: "ai_user_inputs",
        questionText: "What information do users enter into the AI tool?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This helps describe how the product works using founder-supplied facts.",
        outputUse: "BOTH",
      },
      {
        questionKey: "ai_model_provider",
        questionText: "Which model provider or AI service does the product currently use or expect to use?",
        answerType: "text",
        required: true,
        whyItMatters: "This gives counsel and mentors practical product context.",
        outputUse: "BOTH",
      },
      {
        questionKey: "ai_storage_and_outputs",
        questionText: "Are user inputs stored, and are AI outputs saved or relied on by users?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This summarizes product behavior in a neutral preparation format.",
        outputUse: "BOTH",
      },
    ];
  }

  if (businessType === "Software app") {
    return [
      {
        questionKey: "software_demo_status",
        questionText: "What prototype, demo, or working product exists today?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This helps show the current product stage clearly.",
        outputUse: "BOTH",
      },
      {
        questionKey: "software_code_control",
        questionText: "Who controls the GitHub repository, codebase, or build environment?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This records operational product ownership facts.",
        outputUse: "COUNSEL_BRIEF",
      },
      {
        questionKey: "software_accounts_and_data",
        questionText: "Does the app have user accounts, and what data is collected from users?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This prepares a factual product summary for discussion.",
        outputUse: "BOTH",
      },
    ];
  }

  if (businessType === "Marketplace") {
    return [
      {
        questionKey: "marketplace_supply_side",
        questionText: "Who is on the supply side of the marketplace, and how are they added?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This clarifies one side of the marketplace model.",
        outputUse: "BOTH",
      },
      {
        questionKey: "marketplace_demand_side",
        questionText: "Who is on the demand side, and what problem are they trying to solve?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This explains the customer context in founder terms.",
        outputUse: "BOTH",
      },
      {
        questionKey: "marketplace_transactions_evidence",
        questionText: "What transactions, signups, pilots, or other early evidence exist?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This gathers facts that may be useful in a pitch or counsel discussion.",
        outputUse: "BOTH",
      },
    ];
  }

  if (businessType === "Service business") {
    return [
      {
        questionKey: "service_offered",
        questionText: "What service is offered, and what is included in the service?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This describes the business in concrete terms.",
        outputUse: "BOTH",
      },
      {
        questionKey: "service_customer_type",
        questionText: "What type of customer is the service for?",
        answerType: "text",
        required: true,
        whyItMatters: "This helps focus the customer and market summary.",
        outputUse: "BOTH",
      },
      {
        questionKey: "service_pricing_delivery",
        questionText: "What pricing has been tested, and how is the service delivered?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This captures the current business process.",
        outputUse: "BOTH",
      },
    ];
  }

  if (businessType === "Campus or student venture") {
    return [
      {
        questionKey: "campus_origin",
        questionText: "Did the venture start from a class, lab, student project, club, or independent idea?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This records the origin story and project context.",
        outputUse: "BOTH",
      },
      {
        questionKey: "campus_founder_story",
        questionText: "What founder story or problem insight should be included?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This helps prepare a clear founder narrative.",
        outputUse: "PITCH_BRIEF",
      },
      {
        questionKey: "campus_users_and_timeline",
        questionText: "What campus users, competition dates, or presentation timeline should be noted?",
        answerType: "textarea",
        required: true,
        whyItMatters: "This captures the immediate preparation context.",
        outputUse: "BOTH",
      },
    ];
  }

  return [
    {
      questionKey: "product_description",
      questionText: "What product or service is being built, and what does it do?",
      answerType: "textarea",
      required: true,
      whyItMatters: "This creates a plain-language product summary.",
      outputUse: "BOTH",
    },
    {
      questionKey: "product_current_status",
      questionText: "What exists today: idea, mockup, prototype, users, launch, or revenue?",
      answerType: "textarea",
      required: true,
      whyItMatters: "This anchors the checklist in the current venture stage.",
      outputUse: "BOTH",
    },
    {
      questionKey: "product_next_milestone",
      questionText: "What is the next product or service milestone?",
      answerType: "textarea",
      required: false,
      whyItMatters: "This helps organize near-term preparation.",
      outputUse: "BOTH",
    },
  ];
}

function categoryQuestions(input: AdaptiveChecklistQuestionInput, categoryKey: keyof typeof fixedCategories): QuestionSeed[] {
  const goal = clean(input.immediateGoal);
  const stage = clean(input.ventureStage);
  const teamStatus = clean(input.teamStatus);
  const timeline = clean(input.timeline);
  const counselRequired = includesAny(goal, ["attorney", "counsel"]);
  const pitchRequired = includesAny(goal, ["pitch", "presentation", "accelerator", "mentor"]);
  const launchRequired = includesAny(goal, ["launching", "website", "app"]) || includesAny(stage, ["launched", "beta users"]);

  switch (categoryKey) {
    case "VENTURE_BASICS":
      return [
        {
          questionKey: "venture_one_sentence_summary",
          questionText: `What is the one-sentence summary of this ${clean(input.businessType) || "venture"}?`,
          answerType: "textarea",
          required: true,
          whyItMatters: "This gives the checklist a clear starting point.",
          outputUse: "BOTH",
        },
        {
          questionKey: "venture_current_stage",
          questionText: `What best describes the current stage, and why does "${stage || "this stage"}" fit?`,
          answerType: "textarea",
          required: true,
          whyItMatters: "This records the founder's current stage context.",
          outputUse: "BOTH",
        },
        {
          questionKey: "venture_timeline",
          questionText: timeline
            ? `What needs to be prepared within this timeline: ${timeline}?`
            : "What timeline or deadline is shaping this preparation?",
          answerType: "textarea",
          required: false,
          whyItMatters: "This helps order the preparation work.",
          outputUse: "BOTH",
        },
      ];
    case "TEAM_AND_FOUNDERS":
      return [
        {
          questionKey: "team_current_members",
          questionText: `Who is currently involved, and how does "${teamStatus || "the current team"}" describe the team?`,
          answerType: "textarea",
          required: true,
          whyItMatters: "This records who is part of the venture.",
          outputUse: "BOTH",
        },
        {
          questionKey: "team_roles",
          questionText: "What role or responsibility does each founder, contributor, or contractor have?",
          answerType: "textarea",
          required: true,
          whyItMatters: "This organizes the team contribution facts.",
          outputUse: "COUNSEL_BRIEF",
        },
        {
          questionKey: "team_open_decisions",
          questionText: "What team responsibilities or contribution details still need to be clarified?",
          answerType: "textarea",
          required: false,
          whyItMatters: "This helps identify preparation gaps without drawing conclusions.",
          outputUse: "COUNSEL_BRIEF",
        },
      ];
    case "PRODUCT_OR_SERVICE":
      return productQuestion(input);
    case "CUSTOMER_AND_MARKET_FACTS":
      return [
        {
          questionKey: "customer_target",
          questionText: "Who is the intended customer or user?",
          answerType: "textarea",
          required: true,
          whyItMatters: "This explains who the venture is built for.",
          outputUse: "BOTH",
        },
        {
          questionKey: "customer_problem",
          questionText: "What customer problem or need does the venture address?",
          answerType: "textarea",
          required: true,
          whyItMatters: "This keeps the market context specific.",
          outputUse: "PITCH_BRIEF",
        },
        {
          questionKey: "customer_evidence",
          questionText: "What conversations, signups, pilots, purchases, or feedback have been collected?",
          answerType: "textarea",
          required: includesAny(stage, ["beta users", "launched", "revenue"]),
          whyItMatters: "This captures founder-supplied customer evidence.",
          outputUse: "BOTH",
        },
      ];
    case "ASSETS_AND_OWNERSHIP":
      return [
        {
          questionKey: "assets_created",
          questionText: "What has been created so far, such as code, designs, content, data, names, or prototypes?",
          answerType: "textarea",
          required: true,
          whyItMatters: "This lists venture assets in practical terms.",
          outputUse: "COUNSEL_BRIEF",
        },
        {
          questionKey: "assets_creators",
          questionText: "Who created each key asset, and when did they work on it?",
          answerType: "textarea",
          required: true,
          whyItMatters: "This connects assets to contributor facts.",
          outputUse: "COUNSEL_BRIEF",
        },
        {
          questionKey: "asset_records",
          questionText: "What records, files, messages, repositories, or notes support the asset history?",
          answerType: "textarea",
          required: false,
          whyItMatters: "This helps founders gather supporting detail.",
          outputUse: "COUNSEL_BRIEF",
        },
      ];
    case "PITCH_PREPARATION":
      return [
        {
          questionKey: "pitch_audience",
          questionText: "Who is the pitch, presentation, mentor conversation, or accelerator application for?",
          answerType: "text",
          required: pitchRequired,
          whyItMatters: "This shapes the pitch brief around the immediate audience.",
          outputUse: "PITCH_BRIEF",
        },
        {
          questionKey: "pitch_core_points",
          questionText: "What are the main points the founder wants to communicate?",
          answerType: "textarea",
          required: pitchRequired,
          whyItMatters: "This organizes the founder's own pitch priorities.",
          outputUse: "PITCH_BRIEF",
        },
        {
          questionKey: "pitch_deadline",
          questionText: timeline ? `What pitch materials are needed by ${timeline}?` : "What pitch deadline or presentation date should be tracked?",
          answerType: "textarea",
          required: pitchRequired,
          whyItMatters: "This connects preparation work to timing.",
          outputUse: "PITCH_BRIEF",
        },
      ];
    case "COUNSEL_PREPARATION":
      return [
        {
          questionKey: "counsel_meeting_goal",
          questionText: "What does the founder want to discuss with counsel first?",
          answerType: "textarea",
          required: counselRequired,
          whyItMatters: "This helps prepare a focused counsel conversation.",
          outputUse: "COUNSEL_BRIEF",
        },
        {
          questionKey: "counsel_open_questions",
          questionText: "What neutral questions should be saved for counsel?",
          answerType: "textarea",
          required: counselRequired,
          whyItMatters: "This keeps founder questions organized for discussion.",
          outputUse: "COUNSEL_BRIEF",
        },
        {
          questionKey: "counsel_supporting_materials",
          questionText: "What documents, links, notes, or records should be gathered before the counsel conversation?",
          answerType: "textarea",
          required: counselRequired,
          whyItMatters: "This prepares supporting materials without evaluating them.",
          outputUse: "COUNSEL_BRIEF",
        },
      ];
    case "LAUNCH_PREPARATION":
      return [
        {
          questionKey: "launch_target",
          questionText: "What is planned for launch, and who will be able to access it?",
          answerType: "textarea",
          required: launchRequired,
          whyItMatters: "This describes launch scope in practical terms.",
          outputUse: "BOTH",
        },
        {
          questionKey: "launch_accounts_data_payments",
          questionText: "Will the launch include user accounts, data collection, payments, or public pages?",
          answerType: "textarea",
          required: launchRequired,
          whyItMatters: "This gathers launch facts for preparation.",
          outputUse: "COUNSEL_BRIEF",
        },
        {
          questionKey: "launch_readiness_materials",
          questionText: "What launch materials, owner notes, support process, or user-facing explanations are ready?",
          answerType: "textarea",
          required: false,
          whyItMatters: "This records what is already prepared and what remains.",
          outputUse: "BOTH",
        },
      ];
  }
}

export function getDefaultAdaptiveChecklistQuestions(input: AdaptiveChecklistQuestionInput): AdaptiveChecklistQuestionTemplate[] {
  let sortOrder = 0;

  return categoryOrder.flatMap((categoryKey) => {
    const categoryName = fixedCategories[categoryKey];

    return categoryQuestions(input, categoryKey).map((question) => {
      sortOrder += 1;

      return {
        categoryKey,
        categoryName,
        ...question,
        sortOrder,
      };
    });
  });
}
