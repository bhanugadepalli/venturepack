"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

export type SourceRecord = {
  id: string;
  title: string;
  publisher: string | null;
  authorityLevel: string | null;
  jurisdiction: string | null;
  subjectArea: string | null;
  effectiveDate: string;
  lastVerifiedDate: string;
  sourceLocation: string | null;
  storedExcerpt: string | null;
  activeStatus: boolean;
  supersededStatus: boolean;
  createdAt: string;
  updatedAt: string;
};

type SourceFormState = Omit<SourceRecord, "id" | "createdAt" | "updatedAt">;

const emptyForm: SourceFormState = {
  title: "",
  publisher: "",
  authorityLevel: "",
  jurisdiction: "",
  subjectArea: "",
  effectiveDate: "",
  lastVerifiedDate: "",
  sourceLocation: "",
  storedExcerpt: "",
  activeStatus: true,
  supersededStatus: false,
};

const textFields: Array<{ key: keyof SourceFormState; label: string; type?: "input" | "textarea" | "date" }> = [
  { key: "title", label: "Title" },
  { key: "publisher", label: "Publisher" },
  { key: "authorityLevel", label: "Authority level" },
  { key: "jurisdiction", label: "Jurisdiction" },
  { key: "subjectArea", label: "Subject area" },
  { key: "effectiveDate", label: "Effective date", type: "date" },
  { key: "lastVerifiedDate", label: "Last verified date", type: "date" },
  { key: "sourceLocation", label: "Source location" },
  { key: "storedExcerpt", label: "Stored excerpt", type: "textarea" },
];

export function SourcesAdminClient({ initialSources }: { initialSources: SourceRecord[] }) {
  const [sources, setSources] = useState(initialSources);
  const [form, setForm] = useState<SourceFormState>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const sortedSources = useMemo(
    () => [...sources].sort((a, b) => Number(b.activeStatus) - Number(a.activeStatus) || b.updatedAt.localeCompare(a.updatedAt)),
    [sources],
  );

  function updateField<K extends keyof SourceFormState>(key: K, value: SourceFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function editSource(source: SourceRecord) {
    setEditingId(source.id);
    setForm({
      title: source.title,
      publisher: source.publisher ?? "",
      authorityLevel: source.authorityLevel ?? "",
      jurisdiction: source.jurisdiction ?? "",
      subjectArea: source.subjectArea ?? "",
      effectiveDate: source.effectiveDate,
      lastVerifiedDate: source.lastVerifiedDate,
      sourceLocation: source.sourceLocation ?? "",
      storedExcerpt: source.storedExcerpt ?? "",
      activeStatus: source.activeStatus,
      supersededStatus: source.supersededStatus,
    });
    setError("");
  }

  function resetForm() {
    setEditingId("");
    setForm(emptyForm);
    setError("");
  }

  async function saveSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/sources", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const payload = (await response.json()) as { source?: SourceRecord; error?: string };

      if (!response.ok || !payload.source) {
        setError(payload.error ?? "Unable to save source.");
        return;
      }

      const savedSource = payload.source;
      setSources((current) =>
        editingId
          ? current.map((source) => (source.id === savedSource.id ? savedSource : source))
          : [savedSource, ...current],
      );
      resetForm();
    } catch {
      setError("Unable to save source.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
        <div className="border-b border-[#DCE7F3] pb-4">
          <p className="text-sm font-semibold text-[#008787]">{editingId ? "Edit source" : "Create source"}</p>
          <h2 className="mt-1 text-xl font-semibold">Educational source record</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Store source metadata and excerpts for future educational workflows. AI answers are not generated here.
          </p>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={saveSource}>
          {textFields.map((field) => (
            <label key={field.key} className="text-sm font-medium text-[#00173C]">
              {field.label}
              {field.type === "textarea" ? (
                <textarea
                  value={String(form[field.key] ?? "")}
                  onChange={(event) => updateField(field.key, event.target.value as SourceFormState[typeof field.key])}
                  className="mt-2 min-h-28 w-full rounded-md border border-[#DCE7F3] px-3 py-2 outline-none focus:border-[#009EA7]"
                />
              ) : (
                <input
                  required={field.key === "title"}
                  type={field.type === "date" ? "date" : "text"}
                  value={String(form[field.key] ?? "")}
                  onChange={(event) => updateField(field.key, event.target.value as SourceFormState[typeof field.key])}
                  className="mt-2 w-full rounded-md border border-[#DCE7F3] px-3 py-2 outline-none focus:border-[#009EA7]"
                />
              )}
            </label>
          ))}
          <div className="grid gap-3 rounded-md border border-[#DCE7F3] p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-[#00173C]">
              <input
                type="checkbox"
                checked={form.activeStatus}
                onChange={(event) => updateField("activeStatus", event.target.checked)}
                className="size-4 accent-teal-700"
              />
              Active source
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-[#00173C]">
              <input
                type="checkbox"
                checked={form.supersededStatus}
                onChange={(event) => updateField("supersededStatus", event.target.checked)}
                className="size-4 accent-teal-700"
              />
              Mark superseded
            </label>
          </div>
          {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? "Saving..." : editingId ? "Save changes" : "Create source"}
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
        {sortedSources.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DCE7F3] bg-white p-8 text-center">
            <h2 className="text-xl font-semibold">No sources yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#64748B]">
              Create the first educational source record to start building the repository shell.
            </p>
          </div>
        ) : (
          sortedSources.map((source) => (
            <article key={source.id} className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge active={source.activeStatus} superseded={source.supersededStatus} />
                  </div>
                  <h2 className="mt-3 text-xl font-semibold">{source.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{source.publisher || "Publisher not provided"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => editSource(source)}
                  className="w-fit rounded-md border border-[#DCE7F3] px-4 py-2 text-sm font-semibold text-[#00173C] hover:bg-[#F8FAFC]"
                >
                  Edit
                </button>
              </div>
              <div className="mt-5 grid gap-3 border-t border-[#DCE7F3] pt-5 sm:grid-cols-2">
                <Detail label="Authority" value={source.authorityLevel} />
                <Detail label="Jurisdiction" value={source.jurisdiction} />
                <Detail label="Subject area" value={source.subjectArea} />
                <Detail label="Effective date" value={source.effectiveDate} />
                <Detail label="Last verified" value={source.lastVerifiedDate} />
                <Detail label="Location" value={source.sourceLocation} />
              </div>
              <div className="mt-4 rounded-md bg-[#F8FAFC] p-4 text-sm leading-6 text-[#00173C]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Stored excerpt</p>
                <p className="mt-2 whitespace-pre-line">{source.storedExcerpt || "No excerpt stored."}</p>
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
      <p className="mt-1 break-words text-sm text-[#00173C]">{value || "Not provided"}</p>
    </div>
  );
}

function StatusBadge({ active, superseded }: { active: boolean; superseded: boolean }) {
  if (superseded) {
    return <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">Superseded</span>;
  }

  return active ? (
    <span className="rounded-md bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-semibold text-[#008787]">Active</span>
  ) : (
    <span className="rounded-md bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-semibold text-[#00173C]">Inactive</span>
  );
}
