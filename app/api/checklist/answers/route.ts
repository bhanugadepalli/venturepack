import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

type ChecklistAnswerInput = {
  sessionId?: unknown;
  questionId?: unknown;
  value?: unknown;
  evidenceText?: unknown;
  founderConfirmed?: unknown;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Authentication required.",
    },
    { status: 401 },
  );
}

function failedResponse(status = 500) {
  return NextResponse.json(
    {
      ok: false,
      error: "ANSWER_SAVE_FAILED",
    },
    { status },
  );
}

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeJsonValue(value: unknown): JsonValue {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeJsonValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nextValue]) => [key, normalizeJsonValue(nextValue)]),
    );
  }

  return null;
}

function answerResponse(answer: {
  id: string;
  sessionId: string;
  questionId: string;
  userId: string;
  value: unknown;
  evidenceText: string | null;
  founderConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: answer.id,
    sessionId: answer.sessionId,
    questionId: answer.questionId,
    userId: answer.userId,
    value: answer.value,
    evidenceText: answer.evidenceText,
    founderConfirmed: answer.founderConfirmed,
    createdAt: answer.createdAt.toISOString(),
    updatedAt: answer.updatedAt.toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    let body: ChecklistAnswerInput = {};

    try {
      const parsedBody = await request.json();
      body = parsedBody && typeof parsedBody === "object" ? (parsedBody as ChecklistAnswerInput) : {};
    } catch {
      return failedResponse(400);
    }

    const sessionId = stringValue(body.sessionId);
    const questionId = stringValue(body.questionId);

    if (!sessionId || !questionId) {
      return failedResponse(400);
    }

    const session = await prisma.checklistSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      select: { id: true },
    });

    if (!session) {
      return failedResponse(403);
    }

    const question = await prisma.checklistQuestion.findFirst({
      where: {
        id: questionId,
        sessionId: session.id,
      },
      select: { id: true },
    });

    if (!question) {
      return failedResponse(400);
    }

    const data = {
      sessionId: session.id,
      questionId: question.id,
      userId,
      value: normalizeJsonValue(body.value) ?? Prisma.JsonNull,
      evidenceText: stringValue(body.evidenceText) || null,
      founderConfirmed: body.founderConfirmed === true,
    };
    const existingAnswer = await prisma.checklistAnswer.findFirst({
      where: {
        sessionId: session.id,
        questionId: question.id,
        userId,
      },
      select: { id: true },
    });
    const answer = existingAnswer
      ? await prisma.checklistAnswer.update({
          where: { id: existingAnswer.id },
          data,
        })
      : await prisma.checklistAnswer.create({
          data,
        });

    return NextResponse.json({
      ok: true,
      answer: answerResponse(answer),
    });
  } catch (error) {
    console.error("CHECKLIST_ANSWER_SAVE_ERROR", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : undefined,
    });

    return failedResponse();
  }
}
