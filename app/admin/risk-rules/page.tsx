import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { RiskRulesAdminClient, type RiskRuleRecord } from "../../components/RiskRulesAdminClient";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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
}): RiskRuleRecord {
  return {
    ...record,
    triggerKeywords: parseKeywords(record.triggerKeywords),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export default async function AdminRiskRulesPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Admin access"
          title="Access denied"
          description="This area is available only to VenturePack admin users."
        />
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 shadow-sm">
          Risk rule management is limited to admin users. These records are configuration shells and are not connected
          to AI behavior yet.
        </section>
      </AppShell>
    );
  }

  const rules = await prisma.riskRule.findMany({
    orderBy: [{ active: "desc" }, { level: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Risk rules shell"
        title="Risk rules"
        description="Create and maintain transparent risk rule metadata for future preparation routing."
      />
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 shadow-sm">
        These rules are not connected to AI answers, legal advice, legal conclusions, or automated determinations yet.
      </div>
      <RiskRulesAdminClient initialRules={rules.map(riskRuleFromRecord)} />
    </AppShell>
  );
}
