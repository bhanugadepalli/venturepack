"use client";

import { useEffect, useMemo, useState } from "react";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { SuggestMissingDetailsCard } from "@/components/app/SuggestMissingDetailsCard";
import { fetchCompanyProfile } from "@/src/lib/companyApi";
import { fetchMatters } from "@/src/lib/matterApi";
import { calculatePreparationCompletion, getIncompletePreparationItems, getPreparationChecklist } from "@/src/lib/preparation";
import { calculatePreparationScore, scorePreparationCategories } from "@/src/lib/preparationScoring";
import type { CompanyProfile } from "@/src/types/company";
import type { Matter } from "@/src/types/matter";
import { EmptyState } from "./EmptyState";
import { ProgressCard } from "./ProgressCard";
import { Badge, Button, Card, ProgressBar } from "./ui";

type ChecklistSession = {
  id: string;
  businessType: string;
  ventureStage: string;
  immediateGoal: string;
  teamStatus: string | null;
  timeline: string | null;
};

export type AdaptiveChecklistDashboardViewData = {
  hasSession: boolean;
  session: ChecklistSession | null;
  ventureProgress: number;
  topMissingFacts: string[];
};

const emptyChecklistDashboardData: AdaptiveChecklistDashboardViewData = {
  hasSession: false,
  session: null,
  ventureProgress: 0,
  topMissingFacts: [],
};

export function DashboardClient({
  initialChecklistData = emptyChecklistDashboardData,
}: {
  initialChecklistData?: AdaptiveChecklistDashboardViewData;
}) {
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
  const incompleteChecklistItems = useMemo(() => getIncompletePreparationItems(checklistItems), [checklistItems]);
  const checklistSession = initialChecklistData.session;
  const topChecklistMissingFacts = useMemo(() => initialChecklistData.topMissingFacts.slice(0, 3), [initialChecklistData.topMissingFacts]);
  const ventureProgress = initialChecklistData.ventureProgress;

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

      <Card className="mb-6 border-[#009EA7]/30 shadow-lg shadow-[#00173C]/[0.06]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Badge tone="blue">Adaptive Venture Checklist</Badge>
            {checklistSession ? (
              <>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#00173C]">Adaptive Venture Checklist</h2>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["Business type", checklistSession.businessType],
                    ["Venture stage", checklistSession.ventureStage],
                    ["Immediate goal", checklistSession.immediateGoal],
                    checklistSession.teamStatus ? ["Team status", checklistSession.teamStatus] : null,
                    checklistSession.timeline ? ["Timeline", checklistSession.timeline] : null,
                  ]
                    .filter(Boolean)
                    .map((item) => {
                      const [label, value] = item as string[];

                      return (
                        <div key={label} className="rounded-xl border border-[#DCE7F3] bg-[#F8FAFC] p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
                          <p className="mt-1 font-bold text-[#00173C]">{value}</p>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-5 rounded-2xl border border-[#DCE7F3] bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-[#00173C]">Venture Progress</p>
                    <p className="text-2xl font-bold text-[#0B3E9F]">{ventureProgress}%</p>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={ventureProgress} />
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-sm font-bold text-[#00173C]">Top missing facts</p>
                  {topChecklistMissingFacts.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm leading-6 text-[#64748B]">
                      {topChecklistMissingFacts.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">No major missing facts are showing right now.</p>
                  )}
                </div>
                {ventureProgress < 50 ? (
                  <p className="mt-5 rounded-xl border border-[#DCE7F3] bg-[#F8FAFC] p-3 text-sm leading-6 text-[#64748B]">
                    You can generate a brief with missing information, but you should review incomplete sections before sharing.
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#00173C]">Build your personalized startup checklist.</h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  Answer a few questions about your venture so VenturePack can organize your preparation.
                </p>
              </>
            )}
            <p className="mt-5 text-xs leading-5 text-[#64748B]">
              Venture Progress reflects completion of requested preparation information. It is not a legal opinion, compliance rating,
              investment judgment, or guarantee.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-64">
            {checklistSession ? (
              <>
                <Button href="/app/checklist">Continue Checklist</Button>
                <Button href="/app/checklist?brief=COUNSEL_BRIEF" variant="secondary">
                  Generate Counsel Brief
                </Button>
                <Button href="/app/checklist?brief=PITCH_BRIEF" variant="secondary">
                  Generate Pitch Brief
                </Button>
              </>
            ) : (
              <Button href="/app/checklist">Build My Checklist</Button>
            )}
          </div>
        </div>
      </Card>

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
        <SuggestMissingDetailsCard
          companyName={data.companyName}
          completionPercentage={checklistCompletion}
          incompleteItems={incompleteChecklistItems}
          context={{ page: "dashboard" }}
        />
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ProgressCard key={item.category} item={item} />
        ))}
      </section>
    </>
  );
}
