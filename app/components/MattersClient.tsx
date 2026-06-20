"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { fetchCompanyProfile } from "@/src/lib/companyApi";
import { createMatter, fetchMatters } from "@/src/lib/matterApi";
import type { CompanyProfile } from "@/src/types/company";
import type { Matter, MatterStatus, MatterType } from "@/src/types/matter";
import { EmptyState } from "./EmptyState";

const matterTypes: MatterType[] = [
  "Adding a cofounder",
  "Hiring a contractor",
  "Preparing for fundraising",
  "Organizing ownership information",
  "Documenting IP contributors",
  "Responding to an investor request",
  "Preparing for a customer contract",
  "Preparing for a lawyer meeting",
];

const emptyMatter = {
  title: "",
  type: "Preparing for a lawyer meeting" as MatterType,
  status: "Draft" as MatterStatus,
  founderObjective: "",
  description: "",
  knownDeadline: "",
  relevantPeople: "",
  relatedDocuments: "",
  openQuestions: "",
  missingInformation: "",
  recommendedNextPreparationStep: "",
};

const textFields: Array<{
  key: Exclude<keyof typeof emptyMatter, "type" | "status">;
  label: string;
}> = [
  { key: "founderObjective", label: "Founder objective" },
  { key: "description", label: "Description" },
  { key: "knownDeadline", label: "Known deadline" },
  { key: "relevantPeople", label: "Relevant people" },
  { key: "relatedDocuments", label: "Related documents" },
  { key: "openQuestions", label: "Open questions" },
  { key: "missingInformation", label: "Missing information" },
  { key: "recommendedNextPreparationStep", label: "Recommended next preparation step" },
];

const matterTemplates = [
  ["Founder alignment", "Organize cofounder, ownership, and contribution context."],
  ["Fundraising preparation", "Collect investor questions, documents, deadlines, and missing facts."],
  ["Attorney meeting", "Prepare the people, documents, questions, and next steps for counsel review."],
];

export function MattersClient() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [form, setForm] = useState(emptyMatter);
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchCompanyProfile(), fetchMatters()])
      .then(([savedProfile, savedMatters]) => {
        setProfile(savedProfile);
        setMatters(savedMatters);
      })
      .finally(() => setLoaded(true));
  }, []);

  const sortedMatters = useMemo(
    () => [...matters].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [matters],
  );

  function updateField<K extends keyof typeof emptyMatter>(key: K, value: (typeof emptyMatter)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCreateMatter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const nextMatter = await createMatter(form);
      setMatters((current) => [nextMatter, ...current]);
      setForm(emptyMatter);
    } finally {
      setIsSaving(false);
    }
  }

  if (!loaded) {
    return <div className="h-48 rounded-2xl border border-[#DCE7F3] bg-white" />;
  }

  if (!profile) {
    return (
      <EmptyState
        title="Complete onboarding to create your company preparation workspace."
        description="Matters are organized against a saved company profile. Complete onboarding first, then return to create preparation matters."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="rounded-2xl border border-[#DCE7F3] bg-white p-5 shadow-sm">
        <div className="border-b border-[#DCE7F3] pb-4">
          <p className="text-sm font-bold text-[#008787]">{profile.companyName || "Company workspace"}</p>
          <h2 className="mt-1 text-xl font-bold">Create matter</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Capture the practical context and open questions for one preparation topic.
          </p>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={handleCreateMatter}>
          <label className="text-sm font-medium text-[#00173C]">
            Matter title
            <input
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="vp-input mt-2 w-full rounded-lg px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm font-medium text-[#00173C]">
            Matter type
            <select
              value={form.type}
              onChange={(event) => updateField("type", event.target.value as MatterType)}
              className="vp-input mt-2 w-full rounded-lg px-3 py-2 outline-none"
            >
              {matterTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-[#00173C]">
            Status
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value as MatterStatus)}
              className="vp-input mt-2 w-full rounded-lg px-3 py-2 outline-none"
            >
              <option value="Draft">Draft</option>
              <option value="Information gathering">Information gathering</option>
              <option value="Ready for counsel review">Ready for counsel review</option>
            </select>
          </label>
          {textFields.map(({ key, label }) => (
            <label key={key} className="text-sm font-medium text-[#00173C]">
              {label}
              <textarea
                value={form[key]}
                onChange={(event) => updateField(key, event.target.value)}
                className="vp-input mt-2 min-h-24 w-full rounded-lg px-3 py-2 outline-none"
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSaving ? "Saving matter..." : "Save matter"}
          </button>
        </form>
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          VenturePack organizes preparation information only. It does not resolve legal matters or provide legal advice.
        </p>
      </section>

      <section className="grid content-start gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          {matterTemplates.map(([title, body]) => (
            <button
              key={title}
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  title: current.title || title,
                  founderObjective: current.founderObjective || body,
                }))
              }
              className="rounded-2xl border border-[#DCE7F3] bg-white p-4 text-left shadow-sm transition hover:border-[#009EA7]/60 hover:shadow-md hover:shadow-[#00173C]/[0.04]"
            >
              <span className="block h-1 w-10 rounded-full bg-[#009EA7]" />
              <h3 className="mt-3 text-sm font-bold text-[#00173C]">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#64748B]">{body}</p>
            </button>
          ))}
        </div>
        {sortedMatters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
            <h2 className="text-xl font-bold">No matters yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#64748B]">
              Create a matter to prepare a focused set of facts, documents, and questions for counsel review.
            </p>
          </div>
        ) : (
          sortedMatters.map((matter) => (
            <article key={matter.id} className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-sm transition hover:border-[#009EA7]/50 hover:shadow-md hover:shadow-[#00173C]/[0.04]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold text-[#008787]">{matter.type}</p>
                  <h2 className="mt-1 text-xl font-bold">{matter.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#64748B]">{matter.description || "No description added."}</p>
                </div>
                <span className="rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-sm font-bold text-[#008787]">{matter.status}</span>
              </div>
              <div className="mt-5 grid gap-4 border-t border-[#DCE7F3] pt-5 md:grid-cols-2">
                <MatterDetail label="Founder objective" value={matter.founderObjective} />
                <MatterDetail label="Known deadline" value={matter.knownDeadline} />
                <MatterDetail label="Relevant people" value={matter.relevantPeople} />
                <MatterDetail label="Related documents" value={matter.relatedDocuments} />
                <MatterDetail label="Open questions" value={matter.openQuestions} />
                <MatterDetail label="Missing information" value={matter.missingInformation} />
              </div>
              <div className="mt-4 rounded-xl border border-[#DCE7F3] bg-[#F8FAFC] p-3 text-sm leading-6 text-[#00173C]">
                <span className="font-semibold">Next preparation step: </span>
                {matter.recommendedNextPreparationStep || "Add the next practical preparation step."}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function MatterDetail({ label, value }: { label: string; value: string }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-[#00173C]">{label}</h3>
      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#64748B]">{value || "Not provided"}</p>
    </section>
  );
}
