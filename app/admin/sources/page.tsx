import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { SourcesAdminClient, type SourceRecord } from "../../components/SourcesAdminClient";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

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
}): SourceRecord {
  return {
    ...record,
    effectiveDate: record.effectiveDate?.toISOString().slice(0, 10) ?? "",
    lastVerifiedDate: record.lastVerifiedDate?.toISOString().slice(0, 10) ?? "",
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export default async function AdminSourcesPage() {
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
          Founder private information access should be limited, logged, and justified. Source management is limited to
          admin users.
        </section>
      </AppShell>
    );
  }

  const sources = await prisma.source.findMany({
    orderBy: [{ activeStatus: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Educational source repository"
        title="Sources"
        description="Manage educational source metadata and excerpts for future VenturePack preparation workflows."
      />
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 shadow-sm">
        This is a repository shell only. VenturePack does not build AI answers from these records yet. Founder private
        information access should be limited, logged, and justified.
      </div>
      <SourcesAdminClient initialSources={sources.map(sourceFromRecord)} />
    </AppShell>
  );
}
