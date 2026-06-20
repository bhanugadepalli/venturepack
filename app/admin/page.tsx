import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { auth } from "@/auth";
import { adminQueue, preparationItems } from "@/src/lib/mockData";
import { calculatePreparationScore } from "@/src/lib/preparationScoring";

export default async function AdminPage() {
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
          Founder private information access should be limited, logged, and justified. If you need admin access, ask a
          VenturePack workspace administrator to review your role.
        </section>
      </AppShell>
    );
  }

  const score = calculatePreparationScore(preparationItems);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Mock admin console"
        title="Admin"
        description="A simple operations view for mock requests, workspace health, and founder preparation activity."
      />
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 shadow-sm">
        Founder private information access should be limited, logged, and justified.
      </div>
      <section className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#64748B]">Open requests</p>
          <p className="mt-2 text-3xl font-semibold">{adminQueue.length}</p>
        </div>
        <div className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#64748B]">Avg. preparation completion</p>
          <p className="mt-2 text-3xl font-semibold">{score.percent}%</p>
        </div>
        <div className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#64748B]">Counsel packets</p>
          <p className="mt-2 text-3xl font-semibold">7</p>
        </div>
      </section>
      <section className="overflow-hidden rounded-lg border border-[#DCE7F3] bg-white shadow-sm">
        <div className="grid grid-cols-4 gap-4 border-b border-[#DCE7F3] bg-[#F8FAFC] px-5 py-3 text-sm font-semibold text-[#64748B]">
          <p>Company</p>
          <p>Request</p>
          <p>Status</p>
          <p>Owner</p>
        </div>
        {adminQueue.map((row) => (
          <div key={row.company} className="grid grid-cols-4 gap-4 border-b border-[#DCE7F3] px-5 py-4 text-sm last:border-b-0">
            <p className="font-medium">{row.company}</p>
            <p className="text-[#64748B]">{row.request}</p>
            <p className="text-[#64748B]">{row.status}</p>
            <p className="text-[#64748B]">{row.owner}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
