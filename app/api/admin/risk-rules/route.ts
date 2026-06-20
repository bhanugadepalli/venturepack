import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

const riskLevels = [
  "Level 1: General education",
  "Level 2: Contextual preparation",
  "Level 3: Elevated judgment",
  "Level 4: Urgent",
  "Level 5: Excluded or prohibited",
];

type RiskRuleInput = {
  id?: unknown;
  name?: unknown;
  level?: unknown;
  triggerKeywords?: unknown;
  subjectArea?: unknown;
  recommendedBehavior?: unknown;
  active?: unknown;
};

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown): string | null {
  const text = stringValue(value);
  return text || null;
}

function normalizeLevel(value: unknown): string {
  const level = stringValue(value);
  return riskLevels.includes(level) ? level : riskLevels[0];
}

function normalizeKeywords(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => stringValue(item)).filter(Boolean);
  }

  return stringValue(value)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function keywordsJson(value: unknown): string {
  return JSON.stringify(normalizeKeywords(value));
}

function parseKeywords(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((keyword) => stringValue(keyword)).filter(Boolean);
  }

  const text = stringValue(value);

  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? parsed.map((keyword) => stringValue(keyword)).filter(Boolean) : [];
  } catch {
    return text.split(",").map((keyword) => keyword.trim()).filter(Boolean);
  }
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

function riskRuleFromRecord(record: {
  id: string;
  name: string;
  level: string;
  triggerKeywords: unknown;
  subjectArea: string | null;
  recommendedBehavior: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...record,
    triggerKeywords: parseKeywords(record.triggerKeywords),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const rules = await prisma.riskRule.findMany({
    orderBy: [{ active: "desc" }, { level: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ rules: rules.map(riskRuleFromRecord) });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = (await request.json()) as RiskRuleInput;
  const name = stringValue(body.name);

  if (!name) {
    return NextResponse.json({ error: "Rule name is required." }, { status: 400 });
  }

  const rule = await prisma.riskRule.create({
    data: {
      name,
      level: normalizeLevel(body.level),
      triggerKeywords: keywordsJson(body.triggerKeywords),
      subjectArea: nullableString(body.subjectArea),
      recommendedBehavior: nullableString(body.recommendedBehavior),
      active: Boolean(body.active),
    },
  });

  return NextResponse.json({ rule: riskRuleFromRecord(rule) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const body = (await request.json()) as RiskRuleInput;
  const id = stringValue(body.id);
  const name = stringValue(body.name);

  if (!id || !name) {
    return NextResponse.json({ error: "Rule id and name are required." }, { status: 400 });
  }

  const rule = await prisma.riskRule.update({
    where: { id },
    data: {
      name,
      level: normalizeLevel(body.level),
      triggerKeywords: keywordsJson(body.triggerKeywords),
      subjectArea: nullableString(body.subjectArea),
      recommendedBehavior: nullableString(body.recommendedBehavior),
      active: Boolean(body.active),
    },
  });

  return NextResponse.json({ rule: riskRuleFromRecord(rule) });
}
