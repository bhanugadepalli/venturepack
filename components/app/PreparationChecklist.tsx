"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  calculatePreparationCompletion,
  getPreparationStatusLabel,
  getPreparationStatusTone,
  type PreparationChecklistItem,
} from "@/src/lib/preparation";

type PreparationChecklistProps = {
  items: PreparationChecklistItem[];
  compact?: boolean;
};

const badgeStyles = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-[rgba(11,62,159,0.10)] text-[#0B3E9F]",
  amber: "bg-amber-50 text-amber-800",
  green: "bg-[rgba(0,158,167,0.10)] text-[#008787]",
};

export function PreparationChecklist({ items, compact = false }: PreparationChecklistProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const completion = useMemo(() => calculatePreparationCompletion(items), [items]);
  const gaps = items.filter((item) => item.status !== "complete");
  const visibleItems = compact ? items.slice(0, 5) : items;

  return (
    <section className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008787]">Preparation Checklist</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#00173C]">
            Preparation Completion: {completion}%
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#64748B]">
            Track Preparation Gaps, Suggested Missing Details, Questions for Counsel, and counsel packet review steps in one structured checklist.
          </p>
        </div>
        <div className="min-w-52 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
          <p className="text-sm font-semibold text-[#64748B]">Completed items</p>
          <p className="mt-1 text-3xl font-bold text-[#00173C]">
            {items.filter((item) => item.status === "complete").length}/{items.length}
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 rounded-full bg-[#DCE7F3]">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#0B3E9F] to-[#009EA7]"
          style={{ width: `${completion}%` }}
        />
      </div>

      <div className={`mt-6 grid gap-4 ${compact ? "md:grid-cols-1" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        {visibleItems.map((item) => {
          const tone = getPreparationStatusTone(item.status);

          return (
            <article key={item.id} className="rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#00173C]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">{item.description}</p>
                </div>
                <span className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${badgeStyles[tone]}`}>
                  {getPreparationStatusLabel(item.status)}
                </span>
              </div>
              <div className="mt-4 rounded-xl border border-[#DCE7F3] bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">Completion state</p>
                <p className="mt-1 text-sm font-semibold text-[#00173C]">{getPreparationStatusLabel(item.status)}</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#64748B]">{item.suggestedNextAction}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex rounded-xl border border-[#DCE7F3] bg-white px-3 py-2 text-sm font-semibold text-[#00173C] hover:border-[#009EA7] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.16)]"
              >
                Go to section
              </Link>
            </article>
          );
        })}
      </div>

      {compact && items.length > visibleItems.length ? (
        <p className="mt-4 text-sm leading-6 text-[#64748B]">
          Showing {visibleItems.length} of {items.length} checklist categories in this packet summary.
        </p>
      ) : null}

      <div className="mt-6 rounded-3xl border border-[#DCE7F3] bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#008787] p-5 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#BFECEF]">Information Compiling Assistant</p>
            <h3 className="mt-2 text-xl font-bold">Suggested missing details</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#DCE7F3]">
              VenturePack can help identify information that may be useful to compile before generating your counsel packet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuggestions(true)}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#00173C] hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)]"
          >
            Suggest missing details
          </button>
        </div>
        {showSuggestions ? (
          <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
            {gaps.length > 0 ? (
              <ul className="space-y-2 text-sm leading-6 text-[#EAF4FF]">
                {gaps.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <span className="font-semibold text-white">{item.title}:</span> {item.suggestedNextAction}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-6 text-[#EAF4FF]">
                Your checklist is complete. Keep information current as company facts change.
              </p>
            )}
            <p className="mt-4 text-xs leading-5 text-[#DCE7F3]">
              Suggestions are based on founder-supplied information and are for preparation only. VenturePack does not provide legal advice.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
