import Link from "next/link";

export function EmptyState({
  title = "Complete onboarding to continue",
  description = "VenturePack needs your saved onboarding answers before it can show preparation completion, company profile details, or a counsel packet preview.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-3xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center shadow-sm">
      <p className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[rgba(0,158,167,0.10)] text-lg font-bold text-[#008787]">
        VP
      </p>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#00173C]">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">{description}</p>
      <Link
        href="/app/onboarding"
        className="mt-6 inline-flex rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C]"
      >
        Start preparation
      </Link>
    </section>
  );
}
