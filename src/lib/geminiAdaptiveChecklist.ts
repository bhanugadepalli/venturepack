import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  validateAdaptiveChecklistAiOutput,
  type ValidatedAdaptiveChecklistAiOutput,
} from "@/src/lib/adaptiveChecklistAiSchema";
import { safeParseJson } from "@/src/lib/safeJson";

type GeminiAdaptiveChecklistInput = {
  company?: any;
  session: {
    businessType: string;
    ventureStage: string;
    immediateGoal: string;
    teamStatus?: string | null;
    timeline?: string | null;
  };
};

type GeminiAdaptiveChecklistResult =
  | {
      ok: true;
      checklist: ValidatedAdaptiveChecklistAiOutput;
    }
  | {
      ok: false;
      error: "GEMINI_API_KEY_MISSING" | "GEMINI_ADAPTIVE_CHECKLIST_FAILED" | "GEMINI_ADAPTIVE_CHECKLIST_INVALID";
    };

type ErrorLike = {
  name?: unknown;
  message?: unknown;
  status?: unknown;
};

const systemInstruction =
  "You are VenturePack's Adaptive Venture Checklist engine. VenturePack is a startup launchpad command center for young entrepreneurs. Generate practical preparation questions based on the founder's business type, stage, goal, team status, timeline, and existing company facts. You may help organize facts, identify missing facts, and suggest preparation questions. You must not provide legal advice, legal conclusions, compliance analysis, contract review, risk scoring, investment readiness judgments, or attorney-like recommendations. Use fixed categories only. Return valid JSON only.";

function cleanString(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function safeCompanyFacts(company: any) {
  if (!company || typeof company !== "object") {
    return {};
  }

  return {
    companyName: cleanString(company.companyName),
    proposedCompanyName: cleanString(company.proposedCompanyName),
    businessDescription: cleanString(company.businessDescription, 1000),
    productDescription: cleanString(company.productDescription, 1000),
    developmentStage: cleanString(company.developmentStage),
    primaryPreparationReason: cleanString(company.primaryPreparationReason),
    revenueStatus: cleanString(company.revenueStatus),
    existingEntityStatus: cleanString(company.existingEntityStatus),
    primaryOperatingLocation: cleanString(company.primaryOperatingLocation),
    knownDeadlines: cleanString(company.knownDeadlines),
    founderQuestions: cleanString(company.founderQuestions, 1000),
  };
}

function goalFromImmediateGoal(immediateGoal: string) {
  const goal = immediateGoal.toLowerCase();
  return goal.includes("pitch") || goal.includes("presentation") || goal.includes("accelerator") || goal.includes("mentor")
    ? "PITCH_BRIEF"
    : "COUNSEL_BRIEF";
}

function buildUserPrompt(input: GeminiAdaptiveChecklistInput) {
  const session = input.session;

  return [
    "Return valid JSON only in this exact shape:",
    JSON.stringify(
      {
        checklistTitle: "string",
        goal: "COUNSEL_BRIEF | PITCH_BRIEF",
        categories: [
          {
            categoryKey: "VENTURE_BASICS",
            categoryName: "Venture Basics",
            questions: [
              {
                questionKey: "string",
                questionText: "string",
                answerType: "text | textarea | boolean | date | select | multiselect | url",
                required: true,
                whyItMatters: "string",
                outputUse: "COUNSEL_BRIEF | PITCH_BRIEF | BOTH",
                sensitiveDataWarning: false,
              },
            ],
          },
        ],
        missingFactsSummary: ["string"],
        suggestedNextActions: ["string"],
      },
      null,
      2,
    ),
    "",
    "Rules:",
    "- Use only fixed category keys: VENTURE_BASICS, TEAM_AND_FOUNDERS, PRODUCT_OR_SERVICE, CUSTOMER_AND_MARKET_FACTS, ASSETS_AND_OWNERSHIP, PITCH_PREPARATION, COUNSEL_PREPARATION, LAUNCH_PREPARATION.",
    "- Do not invent category names.",
    "- Generate 2 to 4 questions per relevant category.",
    "- Keep each question practical and answerable.",
    "- Do not ask for highly sensitive information unless needed for preparation.",
    "- Phrase questions as information-gathering prompts, not advice.",
    "- Do not calculate Venture Progress.",
    "- Do not assign any percentage.",
    "- Do not include legal advice, legal conclusions, compliance analysis, contract review, risk scoring, investment readiness judgments, red flags, or guarantees.",
    "",
    "Founder-supplied context:",
    JSON.stringify(
      {
        businessType: cleanString(session.businessType),
        ventureStage: cleanString(session.ventureStage),
        immediateGoal: cleanString(session.immediateGoal),
        teamStatus: cleanString(session.teamStatus),
        timeline: cleanString(session.timeline),
        preferredGoal: goalFromImmediateGoal(cleanString(session.immediateGoal)),
        company: safeCompanyFacts(input.company),
      },
      null,
      2,
    ),
  ].join("\n");
}

function errorDetails(error: unknown) {
  const record = error && typeof error === "object" ? (error as ErrorLike) : {};

  return {
    name: typeof record.name === "string" ? record.name : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    status: typeof record.status === "number" || typeof record.status === "string" ? record.status : undefined,
  };
}

export async function generateAdaptiveChecklistWithGemini(
  input: GeminiAdaptiveChecklistInput,
): Promise<GeminiAdaptiveChecklistResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: "GEMINI_API_KEY_MISSING",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 3500,
        responseMimeType: "application/json",
      },
    });
    const parsed = safeParseJson(result.response.text());
    const validated = validateAdaptiveChecklistAiOutput(parsed);

    if (!validated) {
      return {
        ok: false,
        error: "GEMINI_ADAPTIVE_CHECKLIST_INVALID",
      };
    }

    return {
      ok: true,
      checklist: validated,
    };
  } catch (error) {
    console.error("GEMINI_ADAPTIVE_CHECKLIST_ERROR", errorDetails(error));

    return {
      ok: false,
      error: "GEMINI_ADAPTIVE_CHECKLIST_FAILED",
    };
  }
}
