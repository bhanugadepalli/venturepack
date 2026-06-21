"use client";

import { useEffect, useMemo, useState } from "react";
import {
  businessTypes,
  immediateGoals,
  teamStatuses,
  ventureStages,
} from "@/src/lib/adaptiveChecklist";

type ChecklistSession = {
  id: string;
  businessType: string;
  ventureStage: string;
  immediateGoal: string;
  teamStatus: string | null;
  timeline: string | null;
};

type ChecklistQuestion = {
  id: string;
  categoryKey: string;
  categoryName: string;
  questionText: string;
  required: boolean;
  whyItMatters: string | null;
  outputUse: string | null;
  sortOrder: number;
};

type SessionResponse = {
  ok: boolean;
  session: ChecklistSession | null;
  error?: string;
  fieldErrors?: Record<string, string>;
};

type QuestionsResponse = {
  ok: boolean;
  questions?: ChecklistQuestion[];
  error?: string;
};

type FormState = {
  businessType: string;
  ventureStage: string;
  immediateGoal: string;
  teamStatus: string;
  timeline: string;
};

const initialFormState: FormState = {
  businessType: "",
  ventureStage: "",
  immediateGoal: "",
  teamStatus: "",
  timeline: "",
};

const fieldStyles = "vp-input mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none";

function outputUseLabel(outputUse: string | null) {
  switch (outputUse) {
    case "COUNSEL_BRIEF":
      return "Counsel Brief";
    case "PITCH_BRIEF":
      return "Pitch Brief";
    case "BOTH":
      return "Both";
    default:
      return "Both";
  }
}

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: keyof FormState;
  options: readonly string[];
  value: string;
  onChange: (name: keyof FormState, value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-[#00173C]">
      {label}
      <select name={name} required value={value} onChange={(event) => onChange(name, event.target.value)} className={fieldStyles}>
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdaptiveChecklistClient() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [session, setSession] = useState<ChecklistSession | null>(null);
  const [questions, setQuestions] = useState<ChecklistQuestion[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/checklist/session", { method: "GET" });
        const payload = (await response.json()) as SessionResponse;

        if (!isMounted) return;

        if (!response.ok || !payload.ok) {
          setError(payload.error || "Unable to load checklist session.");
          return;
        }

        setSession(payload.session);
      } catch {
        if (isMounted) {
          setError("Unable to load checklist session.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedQuestions = useMemo(() => {
    const groups: Array<{ categoryKey: string; categoryName: string; questions: ChecklistQuestion[] }> = [];

    for (const question of [...questions].sort((first, second) => first.sortOrder - second.sortOrder)) {
      let group = groups.find((item) => item.categoryKey === question.categoryKey);

      if (!group) {
        group = {
          categoryKey: question.categoryKey,
          categoryName: question.categoryName,
          questions: [],
        };
        groups.push(group);
      }

      group.questions.push(question);
    }

    return groups;
  }, [questions]);

  function updateField(name: keyof FormState, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  async function createSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSavingSession(true);

    try {
      const response = await fetch("/api/checklist/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const payload = (await response.json()) as SessionResponse;

      if (!response.ok || !payload.ok || !payload.session) {
        setFieldErrors(payload.fieldErrors ?? {});
        setError(payload.error || "Unable to create checklist session.");
        return;
      }

      setSession(payload.session);
      setQuestions([]);
      setFormData({
        businessType: payload.session.businessType,
        ventureStage: payload.session.ventureStage,
        immediateGoal: payload.session.immediateGoal,
        teamStatus: payload.session.teamStatus ?? "",
        timeline: payload.session.timeline ?? "",
      });
    } catch {
      setError("Unable to create checklist session.");
    } finally {
      setIsSavingSession(false);
    }
  }

  async function generateQuestions() {
    setError("");
    setIsGeneratingQuestions(true);

    try {
      const response = await fetch("/api/checklist/questions/generate", { method: "POST" });
      const payload = (await response.json()) as QuestionsResponse;

      if (!response.ok || !payload.ok) {
        setError(payload.error === "NO_ACTIVE_CHECKLIST_SESSION" ? "Create a checklist session first." : payload.error || "Unable to generate questions.");
        return;
      }

      setQuestions(payload.questions ?? []);
    } catch {
      setError("Unable to generate questions.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  if (isLoadingSession) {
    return (
      <section className="rounded-3xl border border-[#DCE7F3] bg-white p-5 text-sm leading-6 text-[#64748B] shadow-md shadow-[#00173C]/[0.04]">
        Loading checklist setup...
      </section>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <section className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04] sm:p-6">
        <div className="border-b border-[#DCE7F3] pb-5">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Checklist setup</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#00173C]">Tell VenturePack what to prepare around.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
            These questions help organize preparation information. VenturePack does not provide legal advice.
          </p>
        </div>

        {session ? (
          <div className="mt-6 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
            <p className="text-sm font-bold text-[#00173C]">Active checklist setup</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Business type", session.businessType],
                ["Venture stage", session.ventureStage],
                ["Immediate goal", session.immediateGoal],
                ["Team status", session.teamStatus ?? "Not provided"],
                ["Timeline", session.timeline ?? "Not provided"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-semibold text-[#64748B]">{label}</dt>
                  <dd className="mt-1 font-bold text-[#00173C]">{value}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={generateQuestions}
              disabled={isGeneratingQuestions}
              className="mt-5 rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isGeneratingQuestions ? "Generating questions..." : "Generate Questions"}
            </button>
          </div>
        ) : (
          <form className="mt-6 grid gap-5" onSubmit={createSession}>
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField label="Business type" name="businessType" options={businessTypes} value={formData.businessType} onChange={updateField} />
              <SelectField label="Venture stage" name="ventureStage" options={ventureStages} value={formData.ventureStage} onChange={updateField} />
              <SelectField label="Immediate goal" name="immediateGoal" options={immediateGoals} value={formData.immediateGoal} onChange={updateField} />
              <SelectField label="Team status" name="teamStatus" options={teamStatuses} value={formData.teamStatus} onChange={updateField} />
            </div>

            {Object.values(fieldErrors).some(Boolean) ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                {Object.values(fieldErrors).filter(Boolean).join(" ")}
              </div>
            ) : null}

            <label className="text-sm font-semibold text-[#00173C]">
              Timeline
              <input
                name="timeline"
                type="text"
                value={formData.timeline}
                onChange={(event) => updateField("timeline", event.target.value)}
                placeholder="Example: preparing over the next two weeks"
                className={fieldStyles}
              />
            </label>

            <div className="flex flex-col gap-3 border-t border-[#DCE7F3] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[#64748B]">Create a session before generating checklist questions.</p>
              <button
                type="submit"
                disabled={isSavingSession}
                className="rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSavingSession ? "Building..." : "Build My Checklist"}
              </button>
            </div>
          </form>
        )}

        {error ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">{error}</p>
        ) : null}
      </section>

      <aside className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Preparation only</p>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">
          VenturePack organizes preparation information. It is not a law firm and does not provide legal advice.
        </p>
        <div className="mt-5 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
          <p className="text-sm font-semibold text-[#00173C]">Current phase</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#64748B]">
            <li>Create a checklist session</li>
            <li>Generate fixed-category questions</li>
            <li>Review questions before answer inputs are added</li>
          </ul>
        </div>
      </aside>

      <section className="xl:col-span-2">
        {isGeneratingQuestions ? (
          <div className="rounded-3xl border border-[#DCE7F3] bg-white p-5 text-sm leading-6 text-[#64748B] shadow-md shadow-[#00173C]/[0.04]">
            Building grouped questions...
          </div>
        ) : null}

        {!isGeneratingQuestions && groupedQuestions.length === 0 && session ? (
          <div className="rounded-3xl border border-[#DCE7F3] bg-white p-5 text-sm leading-6 text-[#64748B] shadow-md shadow-[#00173C]/[0.04]">
            Generate questions to preview the Adaptive Venture Checklist.
          </div>
        ) : null}

        {groupedQuestions.length > 0 ? (
          <div className="grid gap-5">
            {groupedQuestions.map((group) => (
              <article key={group.categoryKey} className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
                <div className="flex flex-col gap-2 border-b border-[#DCE7F3] pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-bold text-[#00173C]">{group.categoryName}</h3>
                  <span className="w-fit rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#008787]">
                    {group.questions.length} questions
                  </span>
                </div>
                <div className="mt-4 grid gap-3">
                  {group.questions.map((question) => (
                    <div key={question.id} className="rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
                      <div className="flex flex-wrap gap-2">
                        {question.required ? (
                          <span className="rounded-full bg-[#0B3E9F] px-2.5 py-1 text-xs font-bold text-white">Required</span>
                        ) : null}
                        <span className="rounded-full border border-[rgba(0,158,167,0.22)] bg-white px-2.5 py-1 text-xs font-bold text-[#008787]">
                          {outputUseLabel(question.outputUse)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-bold leading-6 text-[#00173C]">{question.questionText}</p>
                      {question.whyItMatters ? (
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">{question.whyItMatters}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
