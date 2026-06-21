"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  akhilDemoData,
  emptyOnboardingData,
} from "@/src/lib/demoStorage";
import { fetchAttorneyMatchRequest } from "@/src/lib/attorneyMatchApi";
import { fetchCompanyProfile, saveCompanyProfileToApi } from "@/src/lib/companyApi";
import type { AttorneyMatchRequest } from "@/src/types/attorneyMatch";
import type { CompanyProfile } from "@/src/types/company";
import { UpgradeCard } from "@/components/app/UpgradeCard";

const onboardingSections = [
  {
    title: "Founder information",
    fields: [
      { key: "founderNames", label: "Founder names", type: "input" },
      { key: "founderRoles", label: "Roles and responsibilities", type: "textarea" },
      { key: "otherFounders", label: "Other founders?", type: "input" },
      { key: "ownershipDiscussed", label: "Ownership discussed?", type: "input" },
      { key: "ownershipWrittenDown", label: "Ownership written down?", type: "input" },
      { key: "ownershipSummary", label: "Ownership notes", type: "textarea" },
    ],
  },
  {
    title: "Company information",
    fields: [
      { key: "companyName", label: "Company name", type: "input" },
      { key: "businessDescription", label: "Business description", type: "textarea" },
      { key: "productOrService", label: "Product or service", type: "textarea" },
      { key: "developmentStage", label: "Development stage", type: "input" },
      { key: "revenueStatus", label: "Revenue status", type: "input" },
      { key: "formationLocation", label: "Primary operating location", type: "input" },
      { key: "expectedCustomerLocations", label: "Expected customer locations", type: "input" },
      { key: "entityStatus", label: "Existing entity status", type: "input" },
      { key: "entityType", label: "Entity type", type: "input" },
    ],
  },
  {
    title: "Operations information",
    fields: [
      { key: "customersExist", label: "Customers exist?", type: "input" },
      { key: "contractorsUsed", label: "Contractors used?", type: "input" },
      { key: "personalInformationCollected", label: "Personal information collected?", type: "input" },
      { key: "regulatedIndustry", label: "Regulated industry?", type: "input" },
      { key: "operatesOutsideUs", label: "Operates outside US?", type: "input" },
      { key: "customerActivity", label: "Customer activity", type: "textarea" },
      { key: "contractorsSummary", label: "Contractor or employee notes", type: "textarea" },
      { key: "ipSummary", label: "IP or product record notes", type: "textarea" },
      { key: "dataPractices", label: "Privacy and data practices", type: "textarea" },
    ],
  },
  {
    title: "Fundraising information",
    fields: [
      { key: "expectsToRaise", label: "Expects to raise money?", type: "input" },
      { key: "moneyAlreadyAccepted", label: "Money already accepted?", type: "input" },
      { key: "investorMeetingScheduled", label: "Investor meeting scheduled?", type: "input" },
      { key: "fundraisingTarget", label: "Fundraising target", type: "input" },
      { key: "investorConversations", label: "Investor conversations", type: "textarea" },
      { key: "fundraisingMaterials", label: "Current materials", type: "textarea" },
      { key: "fundraisingTimeline", label: "Timeline", type: "input" },
    ],
  },
  {
    title: "Counsel preparation information",
    fields: [
      { key: "outsideCounselExists", label: "Outside counsel exists?", type: "input" },
      { key: "priorityMatter", label: "Primary reason", type: "textarea" },
      { key: "counselQuestions", label: "Questions for counsel", type: "textarea" },
      { key: "deadline", label: "Deadline", type: "input" },
      { key: "documentInventory", label: "Document inventory", type: "textarea" },
      { key: "legalBudget", label: "Budget", type: "input" },
      { key: "communicationFormat", label: "Communication format", type: "input" },
      { key: "meetingGoals", label: "Meeting goals", type: "textarea" },
    ],
  },
] satisfies Array<{
  title: string;
  fields: Array<{ key: keyof CompanyProfile; label: string; type: "input" | "textarea" }>;
}>;

export function OnboardingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CompanyProfile>(emptyOnboardingData);
  const [loaded, setLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const total = onboardingSections.reduce((count, section) => count + section.fields.length, 0);
  const completed = useMemo(
    () =>
      onboardingSections.reduce(
        (count, section) => count + section.fields.filter((field) => formData[field.key].trim().length > 0).length,
        0,
      ),
    [formData],
  );
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  useEffect(() => {
    queueMicrotask(() => {
      fetchCompanyProfile()
        .then((profile) => setFormData(profile ?? emptyOnboardingData))
        .finally(() => setLoaded(true));
    });
  }, []);

  function updateField(key: keyof CompanyProfile, value: string) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function loadDemoData() {
    setFormData({ ...akhilDemoData, submittedAt: "" });
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { ...formData, submittedAt: new Date().toISOString() };
    saveCompanyProfileToApi(payload)
      .then(() => {
        setSubmitted(true);
        router.push("/app");
      })
      .catch(() => {
        setSubmitted(false);
      });
  }

  if (!loaded) {
    return <div className="h-48 rounded-2xl border border-[#DCE7F3] bg-white" />;
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#00173C]">Guided onboarding</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Save founder, company, operations, fundraising, and counsel preparation context.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <span className="rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-sm font-bold text-[#008787]">
              {percent}% complete
            </span>
            <button
              type="button"
              onClick={loadDemoData}
              className="rounded-xl border border-[#DCE7F3] px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[rgba(0,158,167,0.10)] hover:text-[#00173C]"
            >
              Load Akhil demo data
            </button>
          </div>
        </div>
          <div className="mt-4 h-2 rounded-full bg-[#DCE7F3]">
          <div className="h-2 rounded-full bg-gradient-to-r from-[#0B3E9F] to-[#009EA7]" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {onboardingSections.map((section) => (
        <section key={section.title} className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-sm transition hover:border-[#009EA7]/50 hover:shadow-md hover:shadow-[#00173C]/[0.04]">
          <div className="flex flex-col gap-2 border-b border-[#DCE7F3] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008787]">Preparation section</p>
              <h3 className="mt-1 text-xl font-bold text-[#00173C]">{section.title}</h3>
            </div>
            <span className="w-fit rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold text-[#008787]">
              {section.fields.filter((field) => formData[field.key].trim()).length}/{section.fields.length} filled
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <span className="text-sm font-semibold text-[#00173C]">{field.label}</span>
                <span className="mt-1 block text-xs leading-5 text-[#64748B]">Add what you know now. You can refine it later.</span>
                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder="Add preparation notes"
                    className="vp-input mt-2 min-h-28 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  />
                ) : (
                  <input
                    value={formData[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder="Add detail"
                    className="vp-input mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}
      <div className="sticky bottom-0 rounded-3xl border border-[#DCE7F3] bg-white/95 p-4 shadow-xl shadow-[#00173C]/[0.08] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748B]">{completed} of {total} fields filled. You can submit and improve later.</p>
          <button type="submit" className="rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C]">
            Submit preparation
          </button>
        </div>
        {submitted ? <p className="mt-3 text-sm font-semibold text-[#16A34A]">Saved. Taking you to the dashboard.</p> : null}
      </div>
    </form>
  );
}

export function AttorneyMatchForm() {
  const [submittedRequest, setSubmittedRequest] = useState<AttorneyMatchRequest | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchAttorneyMatchRequest()
      .then(setSubmittedRequest)
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return <div className="h-48 rounded-2xl border border-[#DCE7F3] bg-white" />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <form
        className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]"
        onSubmit={(event) => {
          event.preventDefault();
          setShowUpgrade(true);
        }}
      >
        <div className="border-b border-[#DCE7F3] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008787]">Attorney match intake</p>
          <h2 className="mt-1 text-xl font-bold text-[#00173C]">Matching preferences</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Save the criteria VenturePack should use to prepare a matching request summary.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextInput label="Legal subject area" name="legalSubjectArea" defaultValue={submittedRequest?.legalSubjectArea} />
          <TextInput label="State or jurisdiction" name="stateOrJurisdiction" defaultValue={submittedRequest?.stateOrJurisdiction} />
          <TextInput label="Company stage" name="companyStage" defaultValue={submittedRequest?.companyStage} />
          <SelectInput
            label="Matter urgency"
            name="matterUrgency"
            options={["No immediate deadline", "This month", "This week", "Urgent"]}
            defaultValue={submittedRequest?.matterUrgency}
          />
          <SelectInput
            label="Preferred pricing structure"
            name="preferredPricingStructure"
            options={["Not sure", "Fixed fee", "Hourly", "Subscription", "Initial consultation"]}
            defaultValue={submittedRequest?.preferredPricingStructure}
          />
          <TextInput label="Estimated budget" name="estimatedBudget" defaultValue={submittedRequest?.estimatedBudget} />
          <SelectInput
            label="Preferred communication method"
            name="preferredCommunicationMethod"
            options={["Virtual meeting", "Email", "Phone", "In-person meeting"]}
            defaultValue={submittedRequest?.preferredCommunicationMethod}
          />
          <TextInput label="Language preferences" name="languagePreferences" defaultValue={submittedRequest?.languagePreferences} />
          <SelectInput
            label="Virtual or local counsel"
            name="virtualOrLocalCounsel"
            options={["Virtual", "Local", "Either"]}
            defaultValue={submittedRequest?.virtualOrLocalCounsel}
          />
          <SelectInput
            label="Already has counsel"
            name="alreadyHasCounsel"
            options={["No", "Yes", "Not sure"]}
            defaultValue={submittedRequest?.alreadyHasCounsel}
          />
        </div>
        <label className="mt-5 flex items-start gap-3 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#00173C]">
          <input
            name="consentToShareSummary"
            type="checkbox"
            defaultChecked={submittedRequest?.consentToShareSummary}
            className="mt-1 size-4 accent-teal-700"
          />
          <span>Consent to share selected preparation summary with attorneys considered for matching.</span>
        </label>
        <button
          className="mt-5 rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
        >
          Save matching request
        </button>
        <p className="mt-4 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
          Founder access will unlock counsel packet downloads and advanced preparation workflows.
        </p>
      </form>

      <aside className="space-y-5">
        {showUpgrade ? <UpgradeCard /> : null}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 shadow-sm">
          VenturePack does not guarantee attorney matching. Attorneys independently decide whether to accept a matter.
          Representation begins only through a separate attorney engagement process.
        </div>
        <section className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Submitted request summary</h2>
          {submittedRequest ? (
            <div className="mt-4 grid gap-3 text-sm leading-6 text-[#64748B]">
              <SummaryRow label="Subject area" value={submittedRequest.legalSubjectArea} />
              <SummaryRow label="Jurisdiction" value={submittedRequest.stateOrJurisdiction} />
              <SummaryRow label="Company stage" value={submittedRequest.companyStage} />
              <SummaryRow label="Urgency" value={submittedRequest.matterUrgency} />
              <SummaryRow label="Pricing" value={submittedRequest.preferredPricingStructure} />
              <SummaryRow label="Budget" value={submittedRequest.estimatedBudget} />
              <SummaryRow label="Communication" value={submittedRequest.preferredCommunicationMethod} />
              <SummaryRow label="Language" value={submittedRequest.languagePreferences} />
              <SummaryRow label="Counsel format" value={submittedRequest.virtualOrLocalCounsel} />
              <SummaryRow label="Already has counsel" value={submittedRequest.alreadyHasCounsel} />
              <SummaryRow
                label="Share summary"
                value={submittedRequest.consentToShareSummary ? "Consent provided" : "Consent not provided"}
              />
              <p className="rounded-md bg-[rgba(0,158,167,0.10)] p-3 text-xs font-semibold text-[#008787]">
                Saved {new Date(submittedRequest.submittedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              No matching request has been saved yet.
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}

function TextInput({ label, name, defaultValue = "" }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="text-sm font-medium text-[#00173C]">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className="vp-input mt-2 w-full rounded-lg px-3 py-2 outline-none"
      />
    </label>
  );
}

function SelectInput({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="text-sm font-medium text-[#00173C]">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="vp-input mt-2 w-full rounded-lg px-3 py-2 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#DCE7F3] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-[#00173C]">{value || "Not provided"}</p>
    </div>
  );
}
