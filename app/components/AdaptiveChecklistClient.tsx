"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  sessionId: string;
  categoryKey: string;
  categoryName: string;
  questionText: string;
  answerType: string;
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

type ProgressCategory = {
  categoryKey: string;
  categoryName: string;
  preparationCompletion: number;
  requiredQuestionCount: number;
  answeredRequiredCount: number;
  missingFacts: string[];
};

type ProgressResponse = {
  ok: boolean;
  ventureProgress: number;
  categories: ProgressCategory[];
  topMissingFacts: string[];
  note: string;
};

type AnswerDraft = {
  value: string;
  evidenceText: string;
  founderConfirmed: boolean;
};

type AnswerResponse = {
  ok: boolean;
  answer?: {
    id: string;
    questionId: string;
    value: unknown;
    evidenceText: string | null;
    founderConfirmed: boolean;
  };
  error?: string;
};

type BriefSection = {
  title: string;
  founderSuppliedFacts: string[];
  platformOrganizedSummary: string;
  missingInformation: string[];
};

type BriefPreview = {
  id: string;
  briefType: "COUNSEL_BRIEF" | "PITCH_BRIEF";
  title: string;
  generatedAt: string;
  founderApprovalStatus?: string;
  content: {
    sections: BriefSection[];
    warnings: string[];
    disclaimer: string;
  };
};

type ChecklistBriefType = "COUNSEL_BRIEF" | "PITCH_BRIEF";

type BriefResponse = {
  ok: boolean;
  brief?: BriefPreview;
  error?: string;
};

type BriefReviewResponse = {
  ok: boolean;
  brief?: {
    id: string;
    founderApprovalStatus: string;
  };
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

const progressNote =
  "This percentage reflects completion of requested preparation information. It is not a legal opinion, compliance rating, investment judgment, or guarantee.";
const fieldStyles = "vp-input mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none";
const briefHelperMessages: Record<ChecklistBriefType, string> = {
  COUNSEL_BRIEF: "Generate a Counsel Brief from your saved checklist answers.",
  PITCH_BRIEF: "Generate a Pitch Brief from your saved checklist answers.",
};

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

export function AdaptiveChecklistClient({ requestedBriefType }: { requestedBriefType?: ChecklistBriefType }) {
  const briefSectionRef = useRef<HTMLElement | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [session, setSession] = useState<ChecklistSession | null>(null);
  const [questions, setQuestions] = useState<ChecklistQuestion[]>([]);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, AnswerDraft>>({});
  const [savingQuestionId, setSavingQuestionId] = useState("");
  const [savedQuestionId, setSavedQuestionId] = useState("");
  const [briefPreview, setBriefPreview] = useState<BriefPreview | null>(null);
  const [briefReviewed, setBriefReviewed] = useState(false);
  const [selectedBriefType, setSelectedBriefType] = useState<ChecklistBriefType | undefined>(requestedBriefType);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [isSavingBriefReview, setIsSavingBriefReview] = useState(false);
  const [isDownloadingBrief, setIsDownloadingBrief] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function refreshProgress() {
    setIsLoadingProgress(true);

    try {
      const response = await fetch("/api/checklist/progress", { method: "GET" });
      const payload = (await response.json()) as ProgressResponse;

      if (response.ok && payload.ok) {
        setProgress(payload);
      }
    } finally {
      setIsLoadingProgress(false);
    }
  }

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
        if (payload.session) {
          refreshProgress();
        }
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

  useEffect(() => {
    if (!requestedBriefType || isLoadingSession) {
      return;
    }

    setSelectedBriefType(requestedBriefType);
    briefSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isLoadingSession, requestedBriefType]);

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

  const progressByCategory = useMemo(() => {
    const map = new Map<string, ProgressCategory>();

    for (const category of progress?.categories ?? []) {
      map.set(category.categoryKey, category);
    }

    return map;
  }, [progress]);
  const isBriefApproved = briefPreview?.founderApprovalStatus === "reviewed";

  function updateField(name: keyof FormState, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  function updateAnswerDraft(questionId: string, values: Partial<AnswerDraft>) {
    setAnswerDrafts((current) => ({
      ...current,
      [questionId]: {
        value: current[questionId]?.value ?? "",
        evidenceText: current[questionId]?.evidenceText ?? "",
        founderConfirmed: current[questionId]?.founderConfirmed ?? false,
        ...values,
      },
    }));
    setSavedQuestionId("");
  }

  function answerValueForRequest(question: ChecklistQuestion, draft: AnswerDraft) {
    if (question.answerType === "boolean") {
      if (draft.value === "true") return true;
      if (draft.value === "false") return false;
      return null;
    }

    if (question.answerType === "multiselect") {
      return draft.value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return draft.value;
  }

  async function saveAnswer(question: ChecklistQuestion) {
    if (!session) {
      return;
    }

    setError("");
    setSavingQuestionId(question.id);
    setSavedQuestionId("");

    const draft = answerDrafts[question.id] ?? { value: "", evidenceText: "", founderConfirmed: false };

    try {
      const response = await fetch("/api/checklist/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          questionId: question.id,
          value: answerValueForRequest(question, draft),
          evidenceText: draft.evidenceText,
          founderConfirmed: draft.founderConfirmed,
        }),
      });
      const payload = (await response.json()) as AnswerResponse;

      if (!response.ok || !payload.ok) {
        setError(payload.error || "Unable to save answer.");
        return;
      }

      setSavedQuestionId(question.id);
      await refreshProgress();
    } catch {
      setError("Unable to save answer.");
    } finally {
      setSavingQuestionId("");
    }
  }

  async function generateBrief(briefType: ChecklistBriefType) {
    setError("");
    setSelectedBriefType(briefType);
    setIsGeneratingBrief(true);
    setBriefReviewed(false);

    try {
      const response = await fetch("/api/briefs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefType }),
      });
      const payload = (await response.json()) as BriefResponse;

      if (!response.ok || !payload.ok || !payload.brief) {
        setError(payload.error === "NO_ACTIVE_CHECKLIST_SESSION" ? "Create a checklist session first." : payload.error || "Unable to generate brief preview.");
        return;
      }

      setBriefPreview(payload.brief);
      setBriefReviewed(payload.brief.founderApprovalStatus === "reviewed");
    } catch {
      setError("Unable to generate brief preview.");
    } finally {
      setIsGeneratingBrief(false);
    }
  }

  async function saveBriefReview(reviewed: boolean) {
    if (!briefPreview) {
      return;
    }

    setError("");
    setIsSavingBriefReview(true);

    try {
      const response = await fetch(`/api/briefs/${briefPreview.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewed }),
      });
      const payload = (await response.json()) as BriefReviewResponse;

      if (!response.ok || !payload.ok) {
        setError(payload.error || "Unable to save brief review.");
        return;
      }

      const isReviewed = payload.brief?.founderApprovalStatus === "reviewed";
      setBriefReviewed(isReviewed);
      setBriefPreview((current) =>
        current
          ? {
              ...current,
              founderApprovalStatus: payload.brief?.founderApprovalStatus ?? (reviewed ? "reviewed" : "draft"),
            }
          : current,
      );
    } catch {
      setError("Unable to save brief review.");
    } finally {
      setIsSavingBriefReview(false);
    }
  }

  async function downloadReviewedBrief() {
    if (!briefPreview || !isBriefApproved) {
      return;
    }

    setError("");
    setIsDownloadingBrief(true);

    try {
      const response = await fetch(`/api/briefs/${briefPreview.id}/download`, {
        method: "GET",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(
          payload?.error === "BRIEF_REVIEW_REQUIRED"
            ? "Please review the brief before downloading."
            : payload?.error || "Unable to download PDF.",
        );
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = briefPreview.briefType === "COUNSEL_BRIEF" ? "venturepack-counsel-brief.pdf" : "venturepack-pitch-brief.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Unable to download PDF.");
    } finally {
      setIsDownloadingBrief(false);
    }
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
      setAnswerDrafts({});
      setProgress(null);
      setFormData({
        businessType: payload.session.businessType,
        ventureStage: payload.session.ventureStage,
        immediateGoal: payload.session.immediateGoal,
        teamStatus: payload.session.teamStatus ?? "",
        timeline: payload.session.timeline ?? "",
      });
      await refreshProgress();
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
      setAnswerDrafts({});
      setSavedQuestionId("");
      await refreshProgress();
    } catch {
      setError("Unable to generate questions.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  function renderAnswerInput(question: ChecklistQuestion) {
    const draft = answerDrafts[question.id] ?? { value: "", evidenceText: "", founderConfirmed: false };

    if (question.answerType === "textarea" || question.answerType === "multiselect") {
      return (
        <textarea
          value={draft.value}
          onChange={(event) => updateAnswerDraft(question.id, { value: event.target.value })}
          rows={question.answerType === "multiselect" ? 4 : 3}
          placeholder={question.answerType === "multiselect" ? "Add one item per line" : "Add your answer"}
          className={`${fieldStyles} min-h-24`}
        />
      );
    }

    if (question.answerType === "boolean") {
      return (
        <select
          value={draft.value}
          onChange={(event) => updateAnswerDraft(question.id, { value: event.target.value })}
          className={fieldStyles}
        >
          <option value="">Select an answer</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    const inputType = question.answerType === "date" || question.answerType === "url" ? question.answerType : "text";

    return (
      <input
        type={inputType}
        value={draft.value}
        onChange={(event) => updateAnswerDraft(question.id, { value: event.target.value })}
        placeholder="Add your answer"
        className={fieldStyles}
      />
    );
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
      <section className="xl:col-span-2 rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Venture Progress</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-[#00173C]">
              {isLoadingProgress ? "..." : `${progress?.ventureProgress ?? 0}%`}
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-[#64748B]">{progress?.note ?? progressNote}</p>
        </div>
      </section>

      <section
        ref={briefSectionRef}
        className="scroll-mt-6 xl:col-span-2 rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04] sm:p-6"
      >
        <div className="flex flex-col gap-4 border-b border-[#DCE7F3] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Brief preview</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#00173C]">Generate a Preparation Brief</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
              {selectedBriefType ? briefHelperMessages[selectedBriefType] : "Create an on-screen preview from saved checklist answers and company facts."}
            </p>
            {!session && selectedBriefType ? (
              <p className="mt-3 rounded-xl border border-[#DCE7F3] bg-[#F8FAFC] p-3 text-sm font-semibold text-[#00173C]">
                Build your checklist first, then generate a brief.
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => generateBrief("COUNSEL_BRIEF")}
              disabled={isGeneratingBrief || !session}
              className={`rounded-xl px-5 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400 ${
                selectedBriefType === "COUNSEL_BRIEF"
                  ? "bg-[#0B3E9F] text-white shadow-md shadow-[#0B3E9F]/20 hover:bg-[#00173C]"
                  : "border border-[#DCE7F3] bg-white text-[#0B3E9F] hover:bg-[#F8FAFC] disabled:text-white"
              }`}
            >
              Generate Counsel Brief
            </button>
            <button
              type="button"
              onClick={() => generateBrief("PITCH_BRIEF")}
              disabled={isGeneratingBrief || !session}
              className={`rounded-xl px-5 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400 ${
                selectedBriefType === "PITCH_BRIEF"
                  ? "bg-[#0B3E9F] text-white shadow-md shadow-[#0B3E9F]/20 hover:bg-[#00173C]"
                  : "border border-[#DCE7F3] bg-white text-[#0B3E9F] hover:bg-[#F8FAFC] disabled:text-white"
              }`}
            >
              Generate Pitch Brief
            </button>
          </div>
        </div>

        {isGeneratingBrief ? (
          <p className="mt-5 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
            Generating preview...
          </p>
        ) : null}

        {briefPreview ? (
          <div className="mt-5 grid gap-5">
            <div className="rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008787]">
                {briefPreview.briefType === "COUNSEL_BRIEF" ? "Counsel Brief" : "Pitch Brief"}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#00173C]">{briefPreview.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Generated {new Date(briefPreview.generatedAt).toLocaleString()}
              </p>
              <p className="mt-4 rounded-xl border border-[#DCE7F3] bg-white p-4 text-sm leading-6 text-[#64748B]">
                This brief may include missing or unconfirmed information. Review it before sharing.
              </p>
              {(briefPreview.content.warnings ?? []).length > 0 ? (
                <div className="mt-4 rounded-xl border border-[#DCE7F3] bg-white p-4">
                  <p className="text-sm font-bold text-[#00173C]">Warnings</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-[#64748B]">
                    {briefPreview.content.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {briefPreview.content.sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-[#DCE7F3] bg-white p-4">
                <h4 className="text-lg font-bold text-[#00173C]">{section.title}</h4>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-bold text-[#00173C]">Founder-supplied facts</p>
                    <ul className="mt-2 space-y-1 text-sm leading-6 text-[#64748B]">
                      {section.founderSuppliedFacts.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#00173C]">Platform-organized summary</p>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">{section.platformOrganizedSummary}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#00173C]">Missing information</p>
                    <ul className="mt-2 space-y-1 text-sm leading-6 text-[#64748B]">
                      {section.missingInformation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}

            <div className="rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
              <p className="text-sm leading-6 text-[#64748B]">
                {briefPreview.briefType === "COUNSEL_BRIEF"
                  ? "VenturePack organizes preparation information. It is not a law firm and does not provide legal advice."
                  : "This brief is for preparation only. It does not indicate investment readiness or likelihood of funding."}
              </p>
              <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-[#00173C]">
                <input
                  type="checkbox"
                  checked={briefReviewed}
                  onChange={(event) => saveBriefReview(event.target.checked)}
                  disabled={isSavingBriefReview}
                  className="h-4 w-4 rounded border-[#A9B8C9] text-[#0B3E9F] focus:ring-[rgba(0,158,167,0.24)]"
                />
                I reviewed this brief and understand it is based on founder-supplied information.
              </label>
              <button
                type="button"
                onClick={downloadReviewedBrief}
                disabled={!isBriefApproved || isSavingBriefReview || isDownloadingBrief}
                className="mt-4 rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-white"
              >
                {isDownloadingBrief ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
          </div>
        ) : null}
      </section>

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
            <li>Save answers and supporting details</li>
          </ul>
        </div>
        <div className="mt-5 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
          <p className="text-sm font-semibold text-[#00173C]">Top Missing Facts</p>
          {(progress?.topMissingFacts ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#64748B]">
              {progress?.topMissingFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#64748B]">Missing facts will appear after questions are generated.</p>
          )}
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
                  <div>
                    <h3 className="text-xl font-bold text-[#00173C]">{group.categoryName}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#64748B]">
                      Preparation Completion: {progressByCategory.get(group.categoryKey)?.preparationCompletion ?? 0}%
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="w-fit rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#008787]">
                      {group.questions.length} questions
                    </span>
                    <span className="w-fit rounded-full border border-[#DCE7F3] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
                      {progressByCategory.get(group.categoryKey)?.answeredRequiredCount ?? 0}/
                      {progressByCategory.get(group.categoryKey)?.requiredQuestionCount ?? 0} required
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {group.questions.map((question) => {
                    const draft = answerDrafts[question.id] ?? { value: "", evidenceText: "", founderConfirmed: false };

                    return (
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

                        <div className="mt-4 grid gap-4 border-t border-[#DCE7F3] pt-4">
                          <label className="text-sm font-semibold text-[#00173C]">
                            Answer
                            {renderAnswerInput(question)}
                          </label>
                          <label className="text-sm font-semibold text-[#00173C]">
                            Supporting detail or link
                            <input
                              type="text"
                              value={draft.evidenceText}
                              onChange={(event) => updateAnswerDraft(question.id, { evidenceText: event.target.value })}
                              placeholder="Add a note, link, filename, or short detail"
                              className={fieldStyles}
                            />
                          </label>
                          <label className="flex items-center gap-3 text-sm font-semibold text-[#00173C]">
                            <input
                              type="checkbox"
                              checked={draft.founderConfirmed}
                              onChange={(event) => updateAnswerDraft(question.id, { founderConfirmed: event.target.checked })}
                              className="h-4 w-4 rounded border-[#A9B8C9] text-[#0B3E9F] focus:ring-[rgba(0,158,167,0.24)]"
                            />
                            I reviewed this answer
                          </label>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => saveAnswer(question)}
                              disabled={savingQuestionId === question.id}
                              className="rounded-xl bg-[#0B3E9F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                              {savingQuestionId === question.id ? "Saving..." : "Save Answer"}
                            </button>
                            {savedQuestionId === question.id ? <span className="text-sm font-bold text-[#008787]">Saved</span> : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
