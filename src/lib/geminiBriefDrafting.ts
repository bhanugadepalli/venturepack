import { GoogleGenerativeAI } from "@google/generative-ai";

type BriefType = "COUNSEL_BRIEF" | "PITCH_BRIEF";

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

type GeminiBriefDraftingInput = {
  briefType: BriefType;
  company?: any;
  session?: any;
  questions?: any[];
  answers?: any[];
  progress?: any;
  rulesBasedContent: BriefContent;
};

type GeminiBriefDraftingOutput =
  | {
      ok: true;
      provider: "gemini";
      content: BriefContent;
    }
  | {
      ok: false;
      provider: "rules";
      error: "GEMINI_API_KEY_MISSING" | "GEMINI_BRIEF_DRAFT_FAILED" | "GEMINI_BRIEF_DRAFT_INVALID";
    };

type ErrorLike = {
  name?: unknown;
  message?: unknown;
  status?: unknown;
};

const counselDisclaimer = "VenturePack organizes preparation information. It is not a law firm and does not provide legal advice.";
const pitchDisclaimer = "This brief is for preparation only. It does not indicate investment readiness or likelihood of funding.";
const systemInstruction =
  "You are VenturePack's preparation brief drafting engine. VenturePack helps young entrepreneurs organize founder-supplied startup facts into preparation briefs. You may improve clarity, structure, and plain-English summaries using only the provided facts. You must not create new facts, infer legal conclusions, provide legal advice, assess compliance, review contracts, score risk, claim investor readiness, or recommend legal strategy. If information is missing, mark it as missing. Return valid JSON only.";
const prohibitedPhrases = [
  "legally ready",
  "compliant",
  "compliance score",
  "risk score",
  "legal readiness",
  "investor ready",
  "safe from risk",
  "red flag",
  "contract review",
  "legal conclusion",
];

function disclaimerForBrief(briefType: BriefType) {
  return briefType === "COUNSEL_BRIEF" ? counselDisclaimer : pitchDisclaimer;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength = 1200) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeProhibitedLanguage(value: unknown, maxLength = 1200) {
  let nextValue = cleanString(value, maxLength);

  for (const phrase of prohibitedPhrases) {
    nextValue = nextValue.replace(new RegExp(escapeRegExp(phrase), "gi"), "").replace(/\s+/g, " ").trim();
  }

  return nextValue;
}

function stringArray(value: unknown, maxItems = 12) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const results: string[] = [];

  for (const item of value) {
    const text = removeProhibitedLanguage(item);
    const key = text.toLowerCase();

    if (!text || seen.has(key)) {
      continue;
    }

    seen.add(key);
    results.push(text);

    if (results.length >= maxItems) {
      break;
    }
  }

  return results;
}

function valueText(value: unknown): string {
  if (typeof value === "string") return cleanString(value, 800);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(valueText).filter(Boolean).join("; ").slice(0, 1000);
  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, nextValue]) => {
        const text = valueText(nextValue);
        return text ? `${key}: ${text}` : "";
      })
      .filter(Boolean)
      .join("; ")
      .slice(0, 1000);
  }
  return "";
}

function safeCompanyFacts(company: any) {
  if (!isRecord(company)) {
    return {};
  }

  return {
    companyName: cleanString(company.companyName),
    proposedCompanyName: cleanString(company.proposedCompanyName),
    businessDescription: cleanString(company.businessDescription),
    productDescription: cleanString(company.productDescription),
    developmentStage: cleanString(company.developmentStage),
    revenueStatus: cleanString(company.revenueStatus),
    existingEntityStatus: cleanString(company.existingEntityStatus),
    entityType: cleanString(company.entityType),
    formationState: cleanString(company.formationState),
    primaryOperatingLocation: cleanString(company.primaryOperatingLocation),
    primaryPreparationReason: cleanString(company.primaryPreparationReason),
    knownDeadlines: cleanString(company.knownDeadlines),
  };
}

function safeSessionFacts(session: any) {
  if (!isRecord(session)) {
    return {};
  }

  return {
    businessType: cleanString(session.businessType),
    ventureStage: cleanString(session.ventureStage),
    immediateGoal: cleanString(session.immediateGoal),
    teamStatus: cleanString(session.teamStatus),
    timeline: cleanString(session.timeline),
  };
}

function safeQuestionAnswerFacts(questions: any[] | undefined, answers: any[] | undefined) {
  const answerList = Array.isArray(answers) ? answers : [];

  return (Array.isArray(questions) ? questions : [])
    .slice(0, 40)
    .map((question) => {
      const questionId = cleanString(question?.id || question?.questionId || question?.questionKey);
      const answer = answerList.find((item) => cleanString(item?.questionId || item?.questionKey) === questionId);

      return {
        categoryKey: cleanString(question?.categoryKey),
        questionText: cleanString(question?.questionText),
        answer: valueText(answer?.value),
        supportingDetail: cleanString(answer?.evidenceText),
        founderConfirmed: answer?.founderConfirmed === true,
      };
    })
    .filter((item) => item.questionText);
}

function safeProgress(progress: any) {
  if (!isRecord(progress)) {
    return {};
  }

  return {
    ventureProgress: typeof progress.ventureProgress === "number" ? progress.ventureProgress : undefined,
    topMissingFacts: stringArray(progress.topMissingFacts, 10),
  };
}

function rulesContentForPrompt(content: BriefContent) {
  return {
    sections: content.sections.map((section) => ({
      title: cleanString(section.title),
      founderSuppliedFacts: stringArray(section.founderSuppliedFacts, 20),
      platformOrganizedSummary: cleanString(section.platformOrganizedSummary, 1800),
      missingInformation: stringArray(section.missingInformation, 20),
    })),
    warnings: stringArray(content.warnings, 20),
    disclaimer: cleanString(content.disclaimer),
  };
}

function buildUserPrompt(input: GeminiBriefDraftingInput) {
  return [
    "Return valid JSON only in this exact shape:",
    JSON.stringify(
      {
        sections: [
          {
            title: "string",
            founderSuppliedFacts: ["string"],
            platformOrganizedSummary: "string",
            missingInformation: ["string"],
          },
        ],
        warnings: ["string"],
        disclaimer: "string",
      },
      null,
      2,
    ),
    "",
    "Rules:",
    "- Use only facts already provided in rulesBasedContent, company, session, questions, and answers.",
    "- Improve clarity, structure, and plain-English summaries only.",
    "- Do not invent traction, customers, revenue, documents, ownership agreements, legal status, entity status, funding, users, launch status, or team members.",
    '- If a fact is missing, keep "Not yet provided."',
    "- Keep founderSuppliedFacts separate from platformOrganizedSummary.",
    "- Do not use prohibited phrases: legally ready, compliant, compliance score, risk score, legal readiness, investor ready, safe from risk, red flag, contract review, legal conclusion.",
    "",
    "Brief context:",
    JSON.stringify(
      {
        briefType: input.briefType,
        requiredDisclaimer: disclaimerForBrief(input.briefType),
        company: safeCompanyFacts(input.company),
        session: safeSessionFacts(input.session),
        questionAnswers: safeQuestionAnswerFacts(input.questions, input.answers),
        progress: safeProgress(input.progress),
        rulesBasedContent: rulesContentForPrompt(input.rulesBasedContent),
      },
      null,
      2,
    ),
  ].join("\n");
}

function errorDetails(error: unknown) {
  const record = isRecord(error) ? (error as ErrorLike) : {};

  return {
    name: typeof record.name === "string" ? record.name : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    status: typeof record.status === "number" || typeof record.status === "string" ? record.status : undefined,
  };
}

function stripMarkdownFences(value: string) {
  const text = value.trim();
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : text;
}

function parseGeminiJson(value: string) {
  const stripped = stripMarkdownFences(value);

  try {
    return JSON.parse(stripped);
  } catch {
    const match = stripped.match(/\{[\s\S]*\}/);

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function validateBriefContent(raw: unknown, briefType: BriefType): BriefContent | null {
  if (!isRecord(raw) || !Array.isArray(raw.sections) || !Array.isArray(raw.warnings) || typeof raw.disclaimer !== "string") {
    return null;
  }

  const sections = raw.sections
    .map((sectionValue): BriefSection | null => {
      if (
        !isRecord(sectionValue) ||
        typeof sectionValue.title !== "string" ||
        !Array.isArray(sectionValue.founderSuppliedFacts) ||
        typeof sectionValue.platformOrganizedSummary !== "string" ||
        !Array.isArray(sectionValue.missingInformation)
      ) {
        return null;
      }

      const title = removeProhibitedLanguage(sectionValue.title, 160);
      const platformOrganizedSummary = removeProhibitedLanguage(sectionValue.platformOrganizedSummary, 1800);

      if (!title || !platformOrganizedSummary) {
        return null;
      }

      return {
        title,
        founderSuppliedFacts: stringArray(sectionValue.founderSuppliedFacts, 20),
        platformOrganizedSummary,
        missingInformation: stringArray(sectionValue.missingInformation, 20),
      };
    })
    .filter((section): section is BriefSection => Boolean(section));

  if (sections.length === 0) {
    return null;
  }

  return {
    sections,
    warnings: stringArray(raw.warnings, 20),
    disclaimer: disclaimerForBrief(briefType),
  };
}

export async function generateBriefDraftWithGemini(input: GeminiBriefDraftingInput): Promise<GeminiBriefDraftingOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      provider: "rules",
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
        temperature: 0.2,
        maxOutputTokens: 4000,
        responseMimeType: "application/json",
      },
    });
    const parsed = parseGeminiJson(result.response.text());
    const content = validateBriefContent(parsed, input.briefType);

    if (!content) {
      return {
        ok: false,
        provider: "rules",
        error: "GEMINI_BRIEF_DRAFT_INVALID",
      };
    }

    return {
      ok: true,
      provider: "gemini",
      content,
    };
  } catch (error) {
    console.error("GEMINI_BRIEF_DRAFT_ERROR", errorDetails(error));

    return {
      ok: false,
      provider: "rules",
      error: "GEMINI_BRIEF_DRAFT_FAILED",
    };
  }
}
