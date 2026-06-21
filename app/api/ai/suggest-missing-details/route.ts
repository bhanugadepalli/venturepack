import { NextResponse } from "next/server";

type IncompleteItemInput = {
  title?: string;
  description?: string;
  suggestedNextAction?: string;
};

type SuggestMissingDetailsRequest = {
  companyName?: string;
  completionPercentage?: number;
  incompleteItems?: IncompleteItemInput[];
  context?: {
    matterType?: string;
    page?: string;
  };
};

type SuggestMissingDetailsResponse = {
  suggestions?: unknown;
  questionsForCounsel?: unknown;
};

const systemPrompt =
  "You are VenturePack's Information Compiling Assistant. You help founders compile, organize, clarify, and summarize their own information before generating a counsel packet. You do not provide legal advice. You do not determine legal rights, obligations, compliance, risk, or liability. You do not review contracts or legal documents. You do not recommend entity choice, ownership splits, securities terms, or legal strategy. If legal conclusions are needed, suggest compiling the relevant facts and discussing them with qualified counsel. Keep suggestions practical, neutral, concise, and based only on founder-supplied information.";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

function normalizeBody(body: unknown): SuggestMissingDetailsRequest {
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
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];
}

function getOutputText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  const output = Array.isArray(payload.output) ? payload.output : [];

  for (const outputItem of output) {
    const outputRecord = outputItem && typeof outputItem === "object" ? (outputItem as Record<string, unknown>) : {};
    const content = Array.isArray(outputRecord.content) ? outputRecord.content : [];

    for (const contentItem of content) {
      const contentRecord = contentItem && typeof contentItem === "object" ? (contentItem as Record<string, unknown>) : {};

      if (typeof contentRecord.text === "string") {
        return contentRecord.text;
      }
    }
  }

  return "";
}

function parseAssistantJson(text: string): SuggestMissingDetailsResponse {
  try {
    return JSON.parse(text) as SuggestMissingDetailsResponse;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? (JSON.parse(match[0]) as SuggestMissingDetailsResponse) : {};
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "AI suggestions are not available right now.",
      },
      { status: 503 },
    );
  }

  try {
    const input = normalizeBody(await request.json());
    const userPrompt = [
      "Given the incomplete checklist items and workspace context, return JSON only with:",
      "suggestions: up to 5 suggested missing details to compile.",
      "questionsForCounsel: up to 5 neutral questions to prepare for counsel.",
      "Suggestions must be phrased as information to compile, not actions the founder legally must take.",
      "Questions must be phrased as questions to discuss with counsel.",
      "Do not mention legal risk, compliance, liability, or rights.",
      "Do not provide legal conclusions.",
      "",
      JSON.stringify(input),
    ].join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_output_tokens: 700,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "AI suggestions are not available right now.",
        },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const parsed = parseAssistantJson(getOutputText(payload));
    const suggestions = safeStringArray(parsed.suggestions);
    const questionsForCounsel = safeStringArray(parsed.questionsForCounsel);

    return NextResponse.json({
      ok: true,
      suggestions,
      questionsForCounsel,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "AI suggestions are not available right now.",
      },
      { status: 500 },
    );
  }
}
