import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "UNAUTHORIZED",
    },
    { status: 401 },
  );
}

function notFoundResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "NOT_FOUND",
    },
    { status: 404 },
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
    select: { id: true },
  });
}

function reviewedFromBody(body: unknown) {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return typeof record.reviewed === "boolean" ? record.reviewed : null;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return unauthorizedResponse();
    }

    let body: unknown = {};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "INVALID_REVIEW_REQUEST" }, { status: 400 });
    }

    const reviewed = reviewedFromBody(body);

    if (reviewed === null) {
      return NextResponse.json({ ok: false, error: "INVALID_REVIEW_REQUEST" }, { status: 400 });
    }

    const { id } = await params;
    const company = await getCurrentCompany(userId);

    if (!company) {
      return notFoundResponse();
    }

    const brief = await prisma.generatedBrief.findFirst({
      where: {
        id,
        userId,
        companyId: company.id,
      },
      select: { id: true },
    });

    if (!brief) {
      return notFoundResponse();
    }

    const reviewedBrief = await prisma.generatedBrief.update({
      where: { id: brief.id },
      data: { founderApprovalStatus: reviewed ? "reviewed" : "draft" },
      select: {
        id: true,
        founderApprovalStatus: true,
      },
    });

    return NextResponse.json({
      ok: true,
      brief: reviewedBrief,
    });
  } catch (error) {
    console.error("BRIEF_REVIEW_ERROR", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : undefined,
    });

    return NextResponse.json({ ok: false, error: "BRIEF_REVIEW_ERROR" }, { status: 500 });
  }
}
