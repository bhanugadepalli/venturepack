"use client";

import Link from "next/link";
import {
  getPreparationStatusLabel,
  getPreparationStatusTone,
  type PreparationChecklistItem,
} from "@/src/lib/preparation";

type PreparationChecklistProps = {
  items: PreparationChecklistItem[];
  completionPercentage: number;
  compact?: boolean;
};

const badgeStyles = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-[rgba(11,62,159,0.10)] text-[#0B3E9F]",
  amber: "bg-amber-50 text-amber-800",
  green: "bg-[rgba(0,158,167,0.10)] text-[#008787]",
};

export function PreparationChecklist({ items, completionPercentage, compact = false }: PreparationChecklistProps) {
  const visibleItems = compact ? items.slice(0, 5) : items;
  const normalizedCompletion = Math.max(0, Math.min(100, completionPercentage));
  const completeCount = items.filter((item) => item.status === "complete").length;

  if (!items.length) {
    return (
      <section className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008787]">Adaptive Venture Checklist</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#00173C]">Overall preparation</h2>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">
          Your preparation checklist will appear as you build your workspace.
        </p>
      </section>
    );
  }

  return (
    <section className={`rounded-3xl border border-[#DCE7F3] bg-white shadow-md shadow-[#00173C]/[0.04] ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className={`${compact ? "text-lg" : "text-2xl"} font-bold tracking-tight text-[#00173C]`}>
            Adaptive Venture Checklist
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#64748B]">
            Track the information you are compiling before generating your counsel packet.
          </p>
        </div>
        <div className="min-w-52 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
          <p className="text-sm font-semibold text-[#64748B]">Overall preparation</p>
          <p className={`${compact ? "text-2xl" : "text-3xl"} mt-1 font-bold text-[#00173C]`}>
            {normalizedCompletion}%
          </p>
          {!compact ? <p className="mt-1 text-xs text-[#64748B]">{completeCount}/{items.length} complete</p> : null}
        </div>
      </div>

      <div className="mt-5 h-3 rounded-full bg-[#DCE7F3]">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#0B3E9F] to-[#009EA7]"
          style={{ width: `${normalizedCompletion}%` }}
        />
      </div>

      <div className={`mt-6 grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        {visibleItems.map((item) => {
          const tone = getPreparationStatusTone(item.status);

          return (
            <article key={item.id} className={`rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] ${compact ? "p-3" : "p-4"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#00173C]">{item.title}</h3>
                  {!compact ? <p className="mt-1 text-sm leading-6 text-[#64748B]">{item.description}</p> : null}
                </div>
                <span className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${badgeStyles[tone]}`}>
                  {getPreparationStatusLabel(item.status)}
                </span>
              </div>
              {!compact ? (
                <>
                  <p className="mt-4 text-sm leading-6 text-[#64748B]">{item.suggestedNextAction}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex rounded-xl border border-[#DCE7F3] bg-white px-3 py-2 text-sm font-semibold text-[#00173C] hover:border-[#009EA7] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.16)]"
                  >
                    Go to section
                  </Link>
                </>
              ) : null}
            </article>
          );
        })}
      </div>

      {compact && items.length > visibleItems.length ? (
        <p className="mt-4 text-sm leading-6 text-[#64748B]">
          Showing {visibleItems.length} of {items.length} checklist categories in this packet summary.
        </p>
      ) : null}
    </section>
  );
}
