import { getCategoryPercent } from "@/src/lib/preparationScoring";
import type { PreparationCategoryScore, PreparationItem } from "@/src/types/readiness";
import { Badge, ProgressBar } from "./ui";

export function ProgressCard({ item }: { item: PreparationCategoryScore | PreparationItem }) {
  const percent = getCategoryPercent(item);
  const missingItems = "missingItems" in item ? item.missingItems : [];
  const nextAction = "nextAction" in item ? item.nextAction : item.nextStep;
  const counselReviewSuggested = "counselReviewSuggested" in item && item.counselReviewSuggested;

  return (
    <article className="flex min-h-full flex-col rounded-2xl border border-[#DCE7F3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#009EA7]/60 hover:shadow-lg hover:shadow-[#00173C]/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#00173C]">{item.category}</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Based on the information you have organized so far.
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-sm font-bold text-[#008787]">
          {percent}%
        </span>
      </div>
      <div className="mt-5"><ProgressBar value={percent} /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {counselReviewSuggested ? (
          <Badge tone="amber">Counsel review suggested</Badge>
        ) : (
          <Badge tone="green">No review prompt</Badge>
        )}
      </div>
      <div className="mt-4 flex-1">
        <h3 className="text-sm font-bold text-[#00173C]">Missing items</h3>
        {missingItems.length > 0 ? (
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-[#64748B]">
            {missingItems.map((missingItem) => (
              <li key={missingItem}>{missingItem}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[#64748B]">No missing items for this category.</p>
        )}
      </div>
      <div className="mt-4 rounded-xl border border-[#DCE7F3] bg-[#F8FAFC] p-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">Next action</p>
        <p className="mt-1 text-sm leading-6 text-[#00173C]">{nextAction}</p>
      </div>
    </article>
  );
}
