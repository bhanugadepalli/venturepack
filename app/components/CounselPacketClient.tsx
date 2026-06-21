"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { SuggestMissingDetailsCard } from "@/components/app/SuggestMissingDetailsCard";
import { fetchCompanyProfile } from "@/src/lib/companyApi";
import { fetchMatters } from "@/src/lib/matterApi";
import {
  calculatePreparationCompletion,
  getPreparationChecklist,
  getIncompletePreparationItems,
  getPreparationStatusLabel,
} from "@/src/lib/preparation";
import { calculatePreparationScore, scorePreparationCategories } from "@/src/lib/preparationScoring";
import type { CompanyProfile } from "@/src/types/company";
import type { Matter } from "@/src/types/matter";
import { CounselPacketActions } from "./CounselPacketActions";
import { EmptyState } from "./EmptyState";

type PacketSection = {
  title: string;
  sourceType: "Founder-supplied facts" | "Platform-organized summary" | "Information requiring verification";
  body: string[];
};

export function CounselPacketClient() {
  const [data, setData] = useState<CompanyProfile | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [selectedMatterId, setSelectedMatterId] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchCompanyProfile(), fetchMatters()])
      .then(([profile, savedMatters]) => {
        setData(profile);
        setMatters(savedMatters);
        setSelectedMatterId(savedMatters[0]?.id ?? "");
      })
      .finally(() => setLoaded(true));
  }, []);

  const score = useMemo(() => {
    if (!data) {
      return null;
    }
    return calculatePreparationScore(scorePreparationCategories(data));
  }, [data]);
  const selectedMatter = useMemo(
    () => matters.find((matter) => matter.id === selectedMatterId) ?? null,
    [matters, selectedMatterId],
  );
  const checklistItems = useMemo(() => getPreparationChecklist({ profile: data, matters }), [data, matters]);
  const checklistCompletion = useMemo(() => calculatePreparationCompletion(checklistItems), [checklistItems]);
  const remainingPreparationGaps = useMemo(() => getIncompletePreparationItems(checklistItems), [checklistItems]);

  if (!loaded) {
    return <div className="h-48 rounded-2xl border border-[#DCE7F3] bg-white" />;
  }

  if (!data || !score) {
    return <EmptyState title="Complete onboarding to create your company preparation workspace." />;
  }

  const matterSummary = selectedMatter
    ? [
        `Title: ${selectedMatter.title}`,
        `Type: ${selectedMatter.type}`,
        `Status: ${selectedMatter.status}`,
        `Founder objective: ${selectedMatter.founderObjective || "Not provided"}`,
        `Description: ${selectedMatter.description || "Not provided"}`,
        `Known deadline: ${selectedMatter.knownDeadline || "Not provided"}`,
      ]
    : ["No matter selected. Create a matter on the Matters page to include focused preparation context."];
  const peopleInvolved = [
    `Founder(s): ${data.founderNames || "Not provided"}`,
    `Founder roles: ${data.founderRoles || "Not provided"}`,
    `Other founders: ${data.otherFounders || "Not provided"}`,
    `Matter people: ${selectedMatter?.relevantPeople || "Not provided"}`,
  ];
  const verificationItems = [
    `Ownership written down: ${data.ownershipWrittenDown || "Not provided"}`,
    `Entity status: ${data.entityStatus || "Not provided"}`,
    `Entity type: ${data.entityType || "Not provided"}`,
    `Contractor agreements or contributor records: ${selectedMatter?.missingInformation || data.contractorsSummary || "Not provided"}`,
    `Document inventory: ${selectedMatter?.relatedDocuments || data.documentInventory || "Not provided"}`,
  ];
  const packetSections: PacketSection[] = [
    {
      title: "Cover page",
      sourceType: "Platform-organized summary",
      body: [
        `${data.companyName || "Company"} counsel packet`,
        `Prepared: ${new Date().toLocaleDateString()}`,
        `Submitted onboarding: ${data.submittedAt ? new Date(data.submittedAt).toLocaleDateString() : "Not provided"}`,
        selectedMatter ? `Selected matter: ${selectedMatter.title}` : "Selected matter: None",
      ],
    },
    {
      title: "Company overview",
      sourceType: "Founder-supplied facts",
      body: [
        data.businessDescription || "No company overview submitted.",
        `Product or service: ${data.productOrService || "Not provided"}`,
        `Stage: ${data.developmentStage || "Not provided"}`,
        `Revenue: ${data.revenueStatus || "Not provided"}`,
        `Entity status: ${data.entityStatus || "Not provided"}; entity type: ${data.entityType || "Not provided"}`,
        `Operating location: ${data.formationLocation || "Not provided"}; expected customers: ${data.expectedCustomerLocations || "Not provided"}`,
      ],
    },
    {
      title: "Matter summary",
      sourceType: selectedMatter ? "Founder-supplied facts" : "Information requiring verification",
      body: matterSummary,
    },
    {
      title: "People involved",
      sourceType: "Founder-supplied facts",
      body: peopleInvolved,
    },
    {
      title: "Document inventory",
      sourceType: "Founder-supplied facts",
      body: [
        selectedMatter?.relatedDocuments || data.documentInventory || "No document inventory submitted.",
      ],
    },
    {
      title: "Open questions",
      sourceType: "Founder-supplied facts",
      body: [
        selectedMatter?.openQuestions || data.counselQuestions || "No open questions submitted.",
      ],
    },
    {
      title: "Missing information",
      sourceType: "Information requiring verification",
      body: [
        selectedMatter?.missingInformation || "No matter-specific missing information submitted.",
        ...verificationItems,
      ],
    },
    {
      title: "Preparation notes",
      sourceType: "Platform-organized summary",
      body: [
        selectedMatter?.recommendedNextPreparationStep || "No matter-specific next step submitted.",
        `Primary preparation reason: ${data.priorityMatter || "Not provided"}`,
        `Preparation completion: ${score.percent}%`,
        `Preparation Checklist completion: ${checklistCompletion}%`,
        `Deadline: ${selectedMatter?.knownDeadline || data.deadline || "Not provided"}`,
        `Preferred format: ${data.communicationFormat || "Not provided"}`,
      ],
    },
    {
      title: "Preparation Checklist summary",
      sourceType: "Platform-organized summary",
      body: checklistItems.map(
        (item) => `${item.title}: ${getPreparationStatusLabel(item.status)}`,
      ),
    },
    {
      title: "Remaining preparation gaps",
      sourceType: remainingPreparationGaps.length > 0 ? "Information requiring verification" : "Platform-organized summary",
      body:
        remainingPreparationGaps.length > 0
          ? remainingPreparationGaps.map((item) => `${item.title}: ${item.suggestedNextAction}`)
          : ["No remaining Preparation Gaps are shown in the current checklist."],
    },
    {
      title: "Questions for counsel",
      sourceType: "Founder-supplied facts",
      body: [
        selectedMatter?.openQuestions || data.counselQuestions || data.meetingGoals || "No questions for counsel submitted.",
      ],
    },
    {
      title: "Operations summary",
      sourceType: "Platform-organized summary",
      body: [
        `Customers exist: ${data.customersExist || "Not provided"}`,
        `Contractors used: ${data.contractorsUsed || "Not provided"}`,
        `Personal information collected: ${data.personalInformationCollected || "Not provided"}`,
        `Regulated industry: ${data.regulatedIndustry || "Not provided"}`,
        `Operates outside US: ${data.operatesOutsideUs || "Not provided"}`,
        data.customerActivity || "No customer activity submitted.",
        data.contractorsSummary || "No contractor or employee notes submitted.",
        data.dataPractices || "No data practice notes submitted.",
      ],
    },
    {
      title: "Fundraising summary",
      sourceType: "Platform-organized summary",
      body: [
        `Expects to raise: ${data.expectsToRaise || "Not provided"}`,
        `Money already accepted: ${data.moneyAlreadyAccepted || "Not provided"}`,
        `Investor meeting scheduled: ${data.investorMeetingScheduled || "Not provided"}`,
        `Target: ${data.fundraisingTarget || "Not provided"}`,
        `Investor conversations: ${data.investorConversations || "Not provided"}`,
        `Materials: ${data.fundraisingMaterials || "Not provided"}`,
        `Timeline: ${data.fundraisingTimeline || "Not provided"}`,
      ],
    },
    {
      title: "Source and generation information",
      sourceType: "Platform-organized summary",
      body: [
        "Source: founder-submitted company profile and saved matter details from the VenturePack workspace.",
        "Generation method: deterministic VenturePack template; no AI generation.",
        `Preparation completion: ${score.percent}%.`,
      ],
    },
    {
      title: "Disclaimer",
      sourceType: "Information requiring verification",
      body: [
        "This packet was prepared by the founder using VenturePack. It does not provide legal advice and should be reviewed by qualified counsel.",
      ],
    },
  ];
  const packet = {
    packetTitle: `${data.companyName || "Company"} counsel packet`,
    companyName: data.companyName || "Company",
    matterTitle: selectedMatter?.title || "No matter selected",
    founderContact: [
      `Founder(s): ${data.founderNames || "Not provided"}`,
      `Founder email(s): ${data.founderEmails || "Not provided"}`,
      `Preferred communication format: ${data.communicationFormat || "Not provided"}`,
    ],
    dateGenerated: new Date().toLocaleDateString(),
    sections: packetSections,
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008787]">Packet preparation summary</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#00173C]">Packet preparation summary</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Review your preparation checklist before generating or downloading a counsel packet.
          </p>
          <div className="mt-5">
            <PreparationChecklist items={checklistItems} completionPercentage={checklistCompletion} compact />
          </div>
          <p className="mt-5 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
            Preparation completion reflects the information compiled in VenturePack. It is not legal compliance and does not replace professional counsel.
          </p>
        </div>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
            <h2 className="text-xl font-bold text-[#00173C]">Remaining preparation gaps</h2>
            {remainingPreparationGaps.length > 0 ? (
              <div className="mt-4 space-y-3">
                {remainingPreparationGaps.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 hover:border-[#009EA7] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.16)]"
                  >
                    <p className="text-sm font-bold text-[#00173C]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">{item.suggestedNextAction}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
                Your checklist is complete. Review the packet content before sharing it.
              </p>
            )}
          </section>
          <SuggestMissingDetailsCard
            companyName={data.companyName}
            completionPercentage={checklistCompletion}
            incompleteItems={remainingPreparationGaps}
            context={{ matterType: selectedMatter?.type, page: "counsel-packet" }}
          />
        </aside>
      </section>

      <section className="grid gap-5 print:block xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-md shadow-[#00173C]/[0.04] print:border-0 print:p-0 print:shadow-none">
        <div className="rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-5 print:break-after-avoid">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Counsel packet preview</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">{data.companyName || "Company packet"}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
            {data.priorityMatter || data.meetingGoals || "Meeting goals were not submitted."}
          </p>
          <label className="mt-5 block max-w-xl text-sm font-medium text-[#00173C]">
            Matter to include
            <select
              value={selectedMatterId}
              onChange={(event) => setSelectedMatterId(event.target.value)}
              className="vp-input mt-2 w-full rounded-lg px-3 py-2 outline-none"
            >
              <option value="">No matter selected</option>
              {matters.map((matter) => (
                <option key={matter.id} value={matter.id}>
                  {matter.title}
                </option>
              ))}
            </select>
          </label>
        </div>
          <div className="mt-5 grid gap-4 print:block">
          {packetSections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm print:mb-4 print:break-inside-avoid print:border-[#DCE7F3]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-lg font-bold">{section.title}</h3>
                <span className="w-fit rounded-full bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-bold text-[#008787] print:border print:bg-white">
                  {section.sourceType}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#64748B]">
                {section.body.map((line) => (
                  <li key={line} className="whitespace-pre-line">
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          </div>
        </div>
        <aside className="space-y-5 print:hidden">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 shadow-sm">
          This packet was prepared by the founder using VenturePack. It does not provide legal advice and should be
          reviewed by qualified counsel.
        </div>
        <CounselPacketActions packet={packet} />
        </aside>
      </section>
    </div>
  );
}
