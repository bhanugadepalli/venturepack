import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import type { Matter, MatterStatus, MatterType } from "@/src/types/matter";

const matterTypes: MatterType[] = [
  "Adding a cofounder",
  "Hiring a contractor",
  "Preparing for fundraising",
  "Organizing ownership information",
  "Documenting IP contributors",
  "Responding to an investor request",
  "Preparing for a customer contract",
  "Preparing for a lawyer meeting",
];

const matterStatuses: MatterStatus[] = ["Draft", "Information gathering", "Ready for counsel review"];

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Authentication required.",
    },
    { status: 401 },
  );
}

async function getOrCreateCompany(ownerId: string) {
  const existingCompany = await prisma.company.findFirst({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });

  if (existingCompany) {
    return existingCompany;
  }

  return prisma.company.create({
    data: {
      ownerId,
    },
  });
}

function normalizeMatterType(value: unknown): MatterType {
  return matterTypes.includes(value as MatterType) ? (value as MatterType) : "Preparing for a lawyer meeting";
}

function normalizeMatterStatus(value: unknown): MatterStatus {
  return matterStatuses.includes(value as MatterStatus) ? (value as MatterStatus) : "Draft";
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseDeadline(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeMatter(input: unknown): Omit<Matter, "id" | "createdAt"> {
  const body = input && typeof input === "object" ? (input as Partial<Matter>) : {};

  return {
    title: stringValue(body.title).trim() || "Untitled matter",
    type: normalizeMatterType(body.type),
    status: normalizeMatterStatus(body.status),
    founderObjective: stringValue(body.founderObjective),
    description: stringValue(body.description),
    knownDeadline: stringValue(body.knownDeadline),
    relevantPeople: stringValue(body.relevantPeople),
    relatedDocuments: stringValue(body.relatedDocuments),
    openQuestions: stringValue(body.openQuestions),
    missingInformation: stringValue(body.missingInformation),
    recommendedNextPreparationStep: stringValue(body.recommendedNextPreparationStep),
  };
}

function matterFromRecord(record: {
  id: string;
  title: string;
  matterType: string | null;
  description: string | null;
  deadline: Date | null;
  status: string;
  founderObjective: string | null;
  relevantPeople: unknown;
  relatedDocuments: unknown;
  openQuestions: unknown;
  missingInformation: unknown;
  recommendedNextStep: string | null;
  createdAt: Date;
}): Matter {
  return {
    id: record.id,
    title: record.title || "Untitled matter",
    type: normalizeMatterType(record.matterType),
    status: normalizeMatterStatus(record.status),
    founderObjective: record.founderObjective ?? "",
    description: record.description ?? "",
    knownDeadline: record.deadline ? record.deadline.toISOString().slice(0, 10) : "",
    relevantPeople: stringValue(record.relevantPeople),
    relatedDocuments: stringValue(record.relatedDocuments),
    openQuestions: stringValue(record.openQuestions),
    missingInformation: stringValue(record.missingInformation),
    recommendedNextPreparationStep: record.recommendedNextStep ?? "",
    createdAt: record.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const ownerId = await getAuthenticatedUserId();

    if (!ownerId) {
      return unauthorizedResponse();
    }

    const company = await prisma.company.findFirst({
      where: { ownerId },
      orderBy: { updatedAt: "desc" },
    });

    if (!company) {
      return NextResponse.json({ matters: [] });
    }

    const matters = await prisma.matter.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ matters: matters.map(matterFromRecord) });
  } catch {
    return NextResponse.json(
      {
        matters: [],
        error: "Unable to load matters.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const ownerId = await getAuthenticatedUserId();

    if (!ownerId) {
      return unauthorizedResponse();
    }

    const company = await getOrCreateCompany(ownerId);
    const matter = normalizeMatter(await request.json());
    const deadline = parseDeadline(matter.knownDeadline);

    const savedMatter = await prisma.matter.create({
      data: {
        companyId: company.id,
        title: matter.title,
        matterType: matter.type,
        description: matter.description || null,
        deadline,
        status: matter.status,
        founderObjective: matter.founderObjective || null,
        relevantPeople: matter.relevantPeople || undefined,
        relatedDocuments: matter.relatedDocuments || undefined,
        openQuestions: matter.openQuestions || undefined,
        missingInformation: matter.missingInformation || undefined,
        recommendedNextStep: matter.recommendedNextPreparationStep || null,
      },
    });

    return NextResponse.json({ matter: matterFromRecord(savedMatter) }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to save matter.",
      },
      { status: 500 },
    );
  }
}
