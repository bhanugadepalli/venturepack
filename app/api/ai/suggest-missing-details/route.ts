import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getSuggestedMissingDetails,
  getQuestionsForCounsel,
  type InformationSuggestionInput,
} from "@/src/lib/informationSuggestions";

type SuggestMissingDetailsResponse = {
  suggestions?: unknown;
  questionsForCounsel?: unknown;
};

type ErrorLike = {
  name?: unknown;
  message?: unknown;
  status?: unknown;
};

const systemInstruction =
  "You are VenturePack's Information Compiling Assistant. You help founders compile, organize, clarify, and summarize their own information before generating a counsel packet. You do not provide legal advice. You do not determine legal rights, obligations, compliance, risk, or liability. You do not review contracts or legal documents. You do not recommend entity choice, ownership splits, securities terms, or legal strategy. If legal conclusions are needed, suggest compiling the relevant facts and discussing them with qualified counsel. Keep suggestions practical, neutral, concise, and based only on founder-supplied information.";

const blockedTerms = /\b(legal risk|compliance|liability|red flags?|legal conclusion|contract review)\b/i;

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

function normalizeBody(body: unknown): InformationSuggestionInput {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const context = record.context && typeof record.context === "object" ? (record.context as Record<string, unknown>) : {};
  const incompleteItems = Array.isArray(record.incompleteItems) ? record.incompleteItems : [];

  return {
    companyName: cleanString(record.companyName),
    completionPercentage: typeof record.completionPercentage === "number" ? record.completionPercentage : undefined,
    incompleteItems: incompleteItems.slice(0, 9).map((item) => {
      const itemRecord = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

      return {
        title: cleanString(itemRecord.title),
        description: cleanString(itemRecord.description),
        suggestedNextAction: cleanString(itemRecord.suggestedNextAction),
      };
    }),
    context: {
      matterType: cleanString(context.matterType),
      page: cleanString(context.page),
    },
  };
}

function safeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.replace(/\s+/g, " ").trim())
        .filter((item) => item && !blockedTerms.test(item))
        .slice(0, 5)
    : [];
}

function errorDetails(error: unknown) {
  const record = error && typeof error === "object" ? (error as ErrorLike) : {};

  return {
    name: typeof record.name === "string" ? record.name : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    status: typeof record.status === "number" || typeof record.status === "string" ? record.status : undefined,
  };
}

function parseAssistantJson(text: string): SuggestMissingDetailsResponse | null {
  try {
    return JSON.parse(text) as SuggestMissingDetailsResponse;
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("GEMINI_JSON_PARSE_ERROR", {
        ...errorDetails(error),
        hasJsonObject: false,
      });
      return null;
    }

    try {
      return JSON.parse(match[0]) as SuggestMissingDetailsResponse;
    } catch (fallbackError) {
      console.error("GEMINI_JSON_PARSE_ERROR", {
        ...errorDetails(fallbackError),
        hasJsonObject: true,
      });
      return null;
    }
  }
}

function buildUserPrompt(input: InformationSuggestionInput) {
  const incompleteItems = (input.incompleteItems ?? []).map((item, index) => ({
    number: index + 1,
    title: item.title,
    description: item.description,
    suggestedNextAction: item.suggestedNextAction,
  }));

  return [
    "Return valid JSON only in this exact shape:",
    '{ "suggestions": ["..."], "questionsForCounsel": ["..."] }',
    "",
    "Rules:",
    "- Up to 5 suggestions.",
    "- Up to 5 questions for counsel.",
    "- Suggestions must be phrased as information to compile, not legal instructions.",
    "- Questions must be neutral questions to discuss with counsel.",
    "- Do not mention legal risk, compliance, liability, red flags, or legal conclusions.",
    "",
    "Founder-supplied context:",
    JSON.stringify({
      companyName: input.companyName || undefined,
      completionPercentage: input.completionPercentage,
      incompleteItems,
      context: {
        matterType: input.context?.matterType || undefined,
        page: input.context?.page || undefined,
      },
    }),
  ].join("\n");
}

function rulesResponse(input: InformationSuggestionInput) {
  return NextResponse.json({
    ok: true,
    provider: "rules",
    suggestions: getSuggestedMissingDetails(input),
    questionsForCounsel: getQuestionsForCounsel(input),
  });
}

export async function POST(request: Request) {
  try {
    let body: unknown = {};

    try {
      body = await request.json();
    } catch {
      return rulesResponse({});
    }

    const input = normalizeBody(body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return rulesResponse(input);
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
          maxOutputTokens: 700,
          responseMimeType: "application/json",
        },
      });
      const parsed = parseAssistantJson(result.response.text());

      if (!parsed) {
        return rulesResponse(input);
      }

      const suggestions = safeStringArray(parsed.suggestions);
      const questionsForCounsel = safeStringArray(parsed.questionsForCounsel);

      if (suggestions.length === 0) {
        return rulesResponse(input);
      }

      return NextResponse.json({
        ok: true,
        provider: "gemini",
        suggestions,
        questionsForCounsel: questionsForCounsel.length > 0 ? questionsForCounsel : getQuestionsForCounsel(input),
      });
    } catch (error) {
      console.error("GEMINI_SUGGEST_MISSING_DETAILS_ERROR", errorDetails(error));
      return rulesResponse(input);
    }
  } catch {
    return rulesResponse({});
  }
}
