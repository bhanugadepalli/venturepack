import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

type SourceInput = {
  id?: unknown;
  title?: unknown;
  publisher?: unknown;
  authorityLevel?: unknown;
  jurisdiction?: unknown;
  subjectArea?: unknown;
  effectiveDate?: unknown;
  lastVerifiedDate?: unknown;
  sourceLocation?: unknown;
  storedExcerpt?: unknown;
  activeStatus?: unknown;
  supersededStatus?: unknown;
};

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown): string | null {
  const text = stringValue(value);
  return text || null;
}

function nullableDate(value: unknown): Date | null {
  const text = stringValue(value);

  if (!text) {
    return null;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false as const, response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  if (session.user.role !== "admin") {
    return { ok: false as const, response: NextResponse.json({ error: "Admin access required." }, { status: 403 }) };
  }

  return { ok: true as const };
}

function sourceFromRecord(record: {
  id: string;
  title: string;
  publisher: string | null;
  authorityLevel: string | null;
  jurisdiction: string | null;
  subjectArea: string | null;
  effectiveDate: Date | null;
  lastVerifiedDate: Date | null;
  sourceLocation: string | null;
  storedExcerpt: string | null;
  activeStatus: boolean;
  supersededStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...record,
    effectiveDate: record.effectiveDate?.toISOString().slice(0, 10) ?? "",
    lastVerifiedDate: record.lastVerifiedDate?.toISOString().slice(0, 10) ?? "",
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const sources = await prisma.source.findMany({
    orderBy: [{ activeStatus: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ sources: sources.map(sourceFromRecord) });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = (await request.json()) as SourceInput;
  const title = stringValue(body.title);

  if (!title) {
    return NextResponse.json(
      {
        error: "Source title is required.",
      },
      { status: 400 },
    );
  }

  const source = await prisma.source.create({
    data: {
      title,
      publisher: nullableString(body.publisher),
      authorityLevel: nullableString(body.authorityLevel),
      jurisdiction: nullableString(body.jurisdiction),
      subjectArea: nullableString(body.subjectArea),
      effectiveDate: nullableDate(body.effectiveDate),
      lastVerifiedDate: nullableDate(body.lastVerifiedDate),
      sourceLocation: nullableString(body.sourceLocation),
      storedExcerpt: nullableString(body.storedExcerpt),
      activeStatus: Boolean(body.activeStatus),
      supersededStatus: Boolean(body.supersededStatus),
    },
  });

  return NextResponse.json({ source: sourceFromRecord(source) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = (await request.json()) as SourceInput;
  const id = stringValue(body.id);
  const title = stringValue(body.title);

  if (!id || !title) {
    return NextResponse.json(
      {
        error: "Source id and title are required.",
      },
      { status: 400 },
    );
  }

  const source = await prisma.source.update({
    where: { id },
    data: {
      title,
      publisher: nullableString(body.publisher),
      authorityLevel: nullableString(body.authorityLevel),
      jurisdiction: nullableString(body.jurisdiction),
      subjectArea: nullableString(body.subjectArea),
      effectiveDate: nullableDate(body.effectiveDate),
      lastVerifiedDate: nullableDate(body.lastVerifiedDate),
      sourceLocation: nullableString(body.sourceLocation),
      storedExcerpt: nullableString(body.storedExcerpt),
      activeStatus: Boolean(body.activeStatus),
      supersededStatus: Boolean(body.supersededStatus),
    },
  });

  return NextResponse.json({ source: sourceFromRecord(source) });
}
