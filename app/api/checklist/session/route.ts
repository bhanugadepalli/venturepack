import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import {
  businessTypes,
  immediateGoals,
  teamStatuses,
  ventureStages,
} from "@/src/lib/adaptiveChecklist";

type ChecklistSessionInput = {
  businessType?: unknown;
  ventureStage?: unknown;
  immediateGoal?: unknown;
  teamStatus?: unknown;
  timeline?: unknown;
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Authentication required.",
    },
    { status: 401 },
  );
}

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

async function getCurrentCompany(ownerId: string) {
  return prisma.company.findFirst({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });
}

async function getOrCreateCompany(ownerId: string) {
  const existingCompany = await getCurrentCompany(ownerId);

  if (existingCompany) {
    return existingCompany;
  }

  return prisma.company.create({
    data: {
      ownerId,
    },
  });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionValue<T extends readonly string[]>(value: unknown, options: T) {
  const nextValue = stringValue(value);

  return options.includes(nextValue) ? nextValue : "";
}

function validateSessionInput(input: unknown) {
  const body = input && typeof input === "object" ? (input as ChecklistSessionInput) : {};
  const businessType = optionValue(body.businessType, businessTypes);
  const ventureStage = optionValue(body.ventureStage, ventureStages);
  const immediateGoal = optionValue(body.immediateGoal, immediateGoals);
  const teamStatus = optionValue(body.teamStatus, teamStatuses);
  const timeline = stringValue(body.timeline).slice(0, 300);
  const fieldErrors: Record<string, string> = {};

  if (!businessType) {
    fieldErrors.businessType = "Select a business type.";
  }

  if (!ventureStage) {
    fieldErrors.ventureStage = "Select a venture stage.";
  }

  if (!immediateGoal) {
    fieldErrors.immediateGoal = "Select an immediate goal.";
  }

  if (!teamStatus) {
    fieldErrors.teamStatus = "Select a team status.";
  }

  return {
    fieldErrors,
    data: {
      businessType,
      ventureStage,
      immediateGoal,
      teamStatus,
      timeline,
    },
  };
}

function sessionResponse(session: {
  id: string;
  companyId: string;
  userId: string;
  businessType: string;
  ventureStage: string;
  immediateGoal: string;
  teamStatus: string | null;
  timeline: string | null;
  status: string;
  aiPromptVersion: string | null;
  aiModelName: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: session.id,
    companyId: session.companyId,
    userId: session.userId,
    businessType: session.businessType,
    ventureStage: session.ventureStage,
    immediateGoal: session.immediateGoal,
    teamStatus: session.teamStatus,
    timeline: session.timeline,
    status: session.status,
    aiPromptVersion: session.aiPromptVersion,
    aiModelName: session.aiModelName,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    const company = await getCurrentCompany(userId);

    if (!company) {
      return NextResponse.json({ ok: true, session: null });
    }

    const session = await prisma.checklistSession.findFirst({
      where: {
        userId,
        companyId: company.id,
        status: "active",
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      session: session ? sessionResponse(session) : null,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        session: null,
        error: "Unable to load checklist session.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    let body: unknown = {};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const payload = validateSessionInput(body);

    if (Object.keys(payload.fieldErrors).length > 0) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: payload.fieldErrors,
        },
        { status: 400 },
      );
    }

    const company = await getOrCreateCompany(userId);
    const session = await prisma.checklistSession.create({
      data: {
        userId,
        companyId: company.id,
        businessType: payload.data.businessType,
        ventureStage: payload.data.ventureStage,
        immediateGoal: payload.data.immediateGoal,
        teamStatus: payload.data.teamStatus || null,
        timeline: payload.data.timeline || null,
        status: "active",
      },
    });

    return NextResponse.json({
      ok: true,
      session: sessionResponse(session),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to create checklist session.",
      },
      { status: 500 },
    );
  }
}
