"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

export type RiskRuleRecord = {
  id: string;
  name: string;
  level: string;
  triggerKeywords: string[];
  subjectArea: string | null;
  recommendedBehavior: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type RiskRuleFormState = {
  name: string;
  level: string;
  triggerKeywords: string;
  subjectArea: string;
  recommendedBehavior: string;
  active: boolean;
};

const riskLevels = [
  "Level 1: General education",
  "Level 2: Contextual preparation",
  "Level 3: Elevated judgment",
  "Level 4: Urgent",
  "Level 5: Excluded or prohibited",
];

const emptyForm: RiskRuleFormState = {
  name: "",
  level: riskLevels[0],
  triggerKeywords: "",
  subjectArea: "",
  recommendedBehavior: "",
  active: true,
};

export function RiskRulesAdminClient({ initialRules }: { initialRules: RiskRuleRecord[] }) {
  const [rules, setRules] = useState(initialRules);
  const [form, setForm] = useState<RiskRuleFormState>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const sortedRules = useMemo(
    () => [...rules].sort((a, b) => Number(b.active) - Number(a.active) || a.level.localeCompare(b.level)),
    [rules],
  );

  function updateField<K extends keyof RiskRuleFormState>(key: K, value: RiskRuleFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function editRule(rule: RiskRuleRecord) {
    setEditingId(rule.id);
    setForm({
      name: rule.name,
      level: riskLevels.includes(rule.level) ? rule.level : riskLevels[0],
      triggerKeywords: rule.triggerKeywords.join(", "),
      subjectArea: rule.subjectArea ?? "",
      recommendedBehavior: rule.recommendedBehavior ?? "",
      active: rule.active,
    });
    setError("");
  }

  function resetForm() {
    setEditingId("");
    setForm(emptyForm);
    setError("");
  }

  async function saveRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/risk-rules", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const payload = (await response.json()) as { rule?: RiskRuleRecord; error?: string };

      if (!response.ok || !payload.rule) {
        setError(payload.error ?? "Unable to save risk rule.");
        return;
      }

      const savedRule = payload.rule;
      setRules((current) =>
        editingId
          ? current.map((rule) => (rule.id === savedRule.id ? savedRule : rule))
          : [savedRule, ...current],
      );
      resetForm();
    } catch {
      setError("Unable to save risk rule.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
        <div className="border-b border-[#DCE7F3] pb-4">
          <p className="text-sm font-semibold text-[#008787]">{editingId ? "Edit rule" : "Create rule"}</p>
          <h2 className="mt-1 text-xl font-semibold">Risk rule shell</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Store transparent rule metadata for later routing and escalation behavior. This is not connected to AI.
          </p>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={saveRule}>
          <label className="text-sm font-medium text-[#00173C]">
            Rule name
            <input
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-2 w-full rounded-md border border-[#DCE7F3] px-3 py-2 outline-none focus:border-[#009EA7]"
            />
          </label>
          <label className="text-sm font-medium text-[#00173C]">
            Risk level
            <select
              value={form.level}
              onChange={(event) => updateField("level", event.target.value)}
              className="mt-2 w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 outline-none focus:border-[#009EA7]"
            >
              {riskLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-[#00173C]">
            Trigger keywords
            <textarea
              value={form.triggerKeywords}
              onChange={(event) => updateField("triggerKeywords", event.target.value)}
              placeholder="Comma-separated keywords"
              className="mt-2 min-h-24 w-full rounded-md border border-[#DCE7F3] px-3 py-2 outline-none focus:border-[#009EA7]"
            />
          </label>
          <label className="text-sm font-medium text-[#00173C]">
            Subject area
            <input
              value={form.subjectArea}
              onChange={(event) => updateField("subjectArea", event.target.value)}
              className="mt-2 w-full rounded-md border border-[#DCE7F3] px-3 py-2 outline-none focus:border-[#009EA7]"
            />
          </label>
          <label className="text-sm font-medium text-[#00173C]">
            Recommended behavior
            <textarea
              value={form.recommendedBehavior}
              onChange={(event) => updateField("recommendedBehavior", event.target.value)}
              className="mt-2 min-h-28 w-full rounded-md border border-[#DCE7F3] px-3 py-2 outline-none focus:border-[#009EA7]"
            />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-[#DCE7F3] p-4 text-sm font-medium text-[#00173C]">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => updateField("active", event.target.checked)}
              className="size-4 accent-teal-700"
            />
            Active rule
          </label>
          {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? "Saving..." : editingId ? "Save changes" : "Create rule"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-[#DCE7F3] px-5 py-3 text-sm font-semibold text-[#00173C] hover:bg-[#F8FAFC]"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="grid content-start gap-4">
        <div className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Initial risk levels</h2>
          <div className="mt-4 grid gap-2">
            {riskLevels.map((level) => (
              <p key={level} className="rounded-md bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#00173C]">
                {level}
              </p>
            ))}
          </div>
        </div>

        {sortedRules.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DCE7F3] bg-white p-8 text-center">
            <h2 className="text-xl font-semibold">No risk rules yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#64748B]">
              Create a rule to define future preparation routing metadata. It will not affect user workflows yet.
            </p>
          </div>
        ) : (
          sortedRules.map((rule) => (
            <article key={rule.id} className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-semibold text-[#00173C]">
                      {rule.level}
                    </span>
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                        rule.active ? "bg-[rgba(0,158,167,0.10)] text-[#008787]" : "bg-[rgba(0,158,167,0.10)] text-[#00173C]"
                      }`}
                    >
                      {rule.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold">{rule.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{rule.subjectArea || "Subject area not provided"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => editRule(rule)}
                  className="w-fit rounded-md border border-[#DCE7F3] px-4 py-2 text-sm font-semibold text-[#00173C] hover:bg-[#F8FAFC]"
                >
                  Edit
                </button>
              </div>
              <div className="mt-5 grid gap-4 border-t border-[#DCE7F3] pt-5 md:grid-cols-2">
                <Detail label="Trigger keywords" value={rule.triggerKeywords.join(", ")} />
                <Detail label="Recommended behavior" value={rule.recommendedBehavior} />
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#00173C]">{value || "Not provided"}</p>
    </div>
  );
}
