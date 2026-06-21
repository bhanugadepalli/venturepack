import { PageHeader } from "../../components/PageHeader";
import {
  businessTypes,
  immediateGoals,
  teamStatuses,
  ventureStages,
} from "@/src/lib/adaptiveChecklist";

const fieldStyles = "vp-input mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none";

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <label className="text-sm font-semibold text-[#00173C]">
      {label}
      <select name={name} required defaultValue="" className={fieldStyles}>
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

export default function AdaptiveChecklistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Venture Progress"
        title="Adaptive Venture Checklist"
        description="Build a personalized preparation checklist based on what you are building, where you are, and what you are preparing for."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04] sm:p-6">
          <div className="border-b border-[#DCE7F3] pb-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Checklist setup</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#00173C]">Tell VenturePack what to prepare around.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
              Phase 1 captures the setup details for your checklist. Question generation and briefs will come later.
            </p>
          </div>

          <form className="mt-6 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField label="Business type" name="businessType" options={businessTypes} />
              <SelectField label="Venture stage" name="ventureStage" options={ventureStages} />
              <SelectField label="Immediate goal" name="immediateGoal" options={immediateGoals} />
              <SelectField label="Team status" name="teamStatus" options={teamStatuses} />
            </div>

            <label className="text-sm font-semibold text-[#00173C]">
              Timeline
              <input
                name="timeline"
                type="text"
                placeholder="Example: preparing over the next two weeks"
                className={fieldStyles}
              />
            </label>

            <div className="flex flex-col gap-3 border-t border-[#DCE7F3] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[#64748B]">
                This setup will be used to shape preparation categories in a future phase.
              </p>
              <button
                type="button"
                className="rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)]"
              >
                Build My Checklist
              </button>
            </div>
          </form>
        </section>

        <aside className="rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-md shadow-[#00173C]/[0.04]">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Preparation only</p>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">
            VenturePack organizes preparation information. It is not a law firm and does not provide legal advice.
          </p>
          <div className="mt-5 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-[#00173C]">Coming next</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#64748B]">
              <li>Preparation questions matched to your setup</li>
              <li>Preparation Completion by category</li>
              <li>Venture Progress across active categories</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
