import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import type { AttorneyMatchRequest } from "@/src/types/attorneyMatch";

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

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function counselStringToBoolean(value: string): boolean | null {
  if (value.toLowerCase() === "yes") {
    return true;
  }

  if (value.toLowerCase() === "no") {
    return false;
  }

  return null;
}

function counselBooleanToString(value: boolean | null): string {
  if (value === true) {
    return "Yes";
  }

  if (value === false) {
    return "No";
  }

  return "Not sure";
}

function normalizeRequest(input: unknown): AttorneyMatchRequest {
  const body = input && typeof input === "object" ? (input as Partial<AttorneyMatchRequest>) : {};

  return {
    legalSubjectArea: stringValue(body.legalSubjectArea),
    stateOrJurisdiction: stringValue(body.stateOrJurisdiction),
    companyStage: stringValue(body.companyStage),
    matterUrgency: stringValue(body.matterUrgency),
    preferredPricingStructure: stringValue(body.preferredPricingStructure),
    estimatedBudget: stringValue(body.estimatedBudget),
    preferredCommunicationMethod: stringValue(body.preferredCommunicationMethod),
    languagePreferences: stringValue(body.languagePreferences),
    virtualOrLocalCounsel: stringValue(body.virtualOrLocalCounsel),
    alreadyHasCounsel: stringValue(body.alreadyHasCounsel),
    consentToShareSummary: Boolean(body.consentToShareSummary),
    submittedAt: stringValue(body.submittedAt) || new Date().toISOString(),
  };
}

function requestFromRecord(record: {
  legalSubjectArea: string | null;
  jurisdiction: string | null;
  companyStage: string | null;
  matterUrgency: string | null;
  preferredPricingStructure: string | null;
  estimatedBudget: string | null;
  preferredCommunicationMethod: string | null;
  languagePreferences: string | null;
  virtualOrLocal: string | null;
  alreadyHasCounsel: boolean | null;
  consentToShareSummary: boolean;
  updatedAt: Date;
}): AttorneyMatchRequest {
  return {
    legalSubjectArea: record.legalSubjectArea ?? "",
    stateOrJurisdiction: record.jurisdiction ?? "",
    companyStage: record.companyStage ?? "",
    matterUrgency: record.matterUrgency ?? "",
    preferredPricingStructure: record.preferredPricingStructure ?? "",
    estimatedBudget: record.estimatedBudget ?? "",
    preferredCommunicationMethod: record.preferredCommunicationMethod ?? "",
    languagePreferences: record.languagePreferences ?? "",
    virtualOrLocalCounsel: record.virtualOrLocal ?? "",
    alreadyHasCounsel: counselBooleanToString(record.alreadyHasCounsel),
    consentToShareSummary: record.consentToShareSummary,
    submittedAt: record.updatedAt.toISOString(),
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
      return NextResponse.json({ request: null });
    }

    const request = await prisma.attorneyMatchRequest.findFirst({
      where: { companyId: company.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      request: request ? requestFromRecord(request) : null,
    });
  } catch {
    return NextResponse.json(
      {
        request: null,
        error: "Unable to load attorney match request.",
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
    const payload = normalizeRequest(await request.json());
    const existingRequest = await prisma.attorneyMatchRequest.findFirst({
      where: { companyId: company.id },
      orderBy: { updatedAt: "desc" },
    });
    const data = {
      companyId: company.id,
      legalSubjectArea: payload.legalSubjectArea || "Not provided",
      jurisdiction: payload.stateOrJurisdiction || null,
      companyStage: payload.companyStage || null,
      matterUrgency: payload.matterUrgency || null,
      preferredPricingStructure: payload.preferredPricingStructure || null,
      estimatedBudget: payload.estimatedBudget || null,
      preferredCommunicationMethod: payload.preferredCommunicationMethod || null,
      languagePreferences: payload.languagePreferences || null,
      virtualOrLocal: payload.virtualOrLocalCounsel || null,
      alreadyHasCounsel: counselStringToBoolean(payload.alreadyHasCounsel) ?? undefined,
      consentToShareSummary: payload.consentToShareSummary,
      status: "submitted",
    };

    const savedRequest = existingRequest
      ? await prisma.attorneyMatchRequest.update({
          where: { id: existingRequest.id },
          data,
        })
      : await prisma.attorneyMatchRequest.create({
          data,
        });

    return NextResponse.json({ request: requestFromRecord(savedRequest) });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to save attorney match request.",
      },
      { status: 500 },
    );
  }
}
