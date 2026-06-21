import Link from "next/link";

const features = [
  "Counsel packet generation",
  "PDF packet download",
  "Matter preparation history",
  "Attorney matching request",
];

export function UpgradeCard() {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#DCE7F3] bg-white shadow-xl shadow-[#00173C]/[0.06]">
      <div className="h-2 bg-gradient-to-r from-[#0B3E9F] via-[#009EA7] to-[#008787]" />
      <div className="p-6 sm:p-8">
        <span className="inline-flex rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#008787]">
          Founder plan
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#00173C] sm:text-3xl">
          Upgrade to generate your counsel packet
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
          Founder access will unlock counsel packet generation, PDF downloads, and advanced preparation workflows.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-3 text-sm font-semibold text-[#00173C]">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#009EA7]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-[#0B3E9F] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#0B3E9F]/20 hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)]"
          >
            View Pricing
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-xl border border-[#DCE7F3] bg-white px-5 py-3 text-sm font-semibold text-[#00173C] hover:border-[#009EA7] hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.16)]"
          >
            Continue preparing for free
          </Link>
        </div>
      </div>
    </section>
  );
}
