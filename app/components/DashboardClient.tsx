"use client";

import { useEffect, useMemo, useState } from "react";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { fetchCompanyProfile } from "@/src/lib/companyApi";
import { fetchMatters } from "@/src/lib/matterApi";
import { calculatePreparationCompletion, getPreparationChecklist } from "@/src/lib/preparation";
import { calculatePreparationScore, scorePreparationCategories } from "@/src/lib/preparationScoring";
import type { CompanyProfile } from "@/src/types/company";
import type { Matter } from "@/src/types/matter";
import { EmptyState } from "./EmptyState";
import { ProgressCard } from "./ProgressCard";
import { Badge, Button, Card, ProgressBar } from "./ui";

export function DashboardClient() {
  const [data, setData] = useState<CompanyProfile | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      Promise.all([fetchCompanyProfile(), fetchMatters()])
        .then(([profile, savedMatters]) => {
          setData(profile);
          setMatters(savedMatters);
        })
        .finally(() => setLoaded(true));
    });
  }, []);

  const items = useMemo(() => (data ? scorePreparationCategories(data) : []), [data]);
  const score = useMemo(() => calculatePreparationScore(items), [items]);
  const checklistItems = useMemo(() => getPreparationChecklist({ profile: data, matters }), [data, matters]);
  const checklistCompletion = useMemo(() => calculatePreparationCompletion(checklistItems), [checklistItems]);

  if (!loaded) {
    return <div className="h-48 rounded-lg border border-[#DCE7F3] bg-white" />;
  }

  if (!data) {
    return (
      <EmptyState
        title="Complete onboarding to create your company preparation workspace."
        description="Your dashboard will show preparation completion once your founder and company information is saved."
      />
    );
  }

  return (
    <>
      <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#009EA7] p-6 text-white shadow-xl shadow-[#00173C]/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
              Welcome back
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Prepare for the first attorney meeting.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#DCE7F3]">
              Your workspace is tracking deterministic preparation completion across {items.length} categories.
            </p>
            <p className="mt-3 text-xs text-[#BFECEF]">Last submitted {new Date(data.submittedAt).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur lg:w-80">
            <p className="text-sm font-semibold text-[#DCE7F3]">Overall preparation</p>
            <p className="mt-2 text-6xl font-bold tracking-tight">{score.percent}%</p>
            <div className="mt-4"><ProgressBar value={score.percent} /></div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="shadow-md shadow-[#00173C]/[0.04]">
          <h2 className="text-xl font-bold">Quick actions</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">Keep moving by updating facts, adding a matter, or previewing a packet.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href="/app/onboarding">Update onboarding</Button>
            <Button href="/app/matters" variant="secondary">Create matter</Button>
            <Button href="/app/counsel-packet" variant="secondary">Preview packet</Button>
          </div>
        </Card>
        <Card className="border-[#009EA7]/30 bg-[rgba(0,158,167,0.10)] shadow-md shadow-[#00173C]/[0.04]">
          <Badge tone="indigo">Important</Badge>
          <h2 className="mt-3 text-xl font-bold">Prepare for first attorney meeting</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Review missing items, gather documents, and write focused questions before the conversation.
          </p>
        </Card>
      </section>
      <section className="mb-6 grid gap-4 xl:grid-cols-[1fr_360px]">
        <PreparationChecklist items={checklistItems} completionPercentage={checklistCompletion} />
        <Card className="border-[#009EA7]/30 shadow-md shadow-[#00173C]/[0.04]">
          <Badge tone="indigo">Suggested missing details</Badge>
          <h2 className="mt-3 text-xl font-bold text-[#00173C]">Suggested missing details</h2>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">
            VenturePack can help identify information that may be useful to compile before generating your counsel packet.
          </p>
          <Button href="/app/counsel-packet" className="mt-5 w-full">
            Review preparation gaps
          </Button>
          <p className="mt-4 text-xs leading-5 text-[#64748B]">
            Suggestions are based on founder-supplied information and are for preparation only. VenturePack does not provide legal advice.
          </p>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ProgressCard key={item.category} item={item} />
        ))}
      </section>
    </>
  );
}
