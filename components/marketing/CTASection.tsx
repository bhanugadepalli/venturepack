import Link from "next/link";

type CTASectionProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export function CTASection({
  title = "Build your checklist. Organize your venture.",
  description = "Start with a few questions. Leave with structured progress, clearer next actions, and preparation briefs you can review before pitching, launching, or meeting counsel.",
  buttonLabel = "Build My Checklist",
  buttonHref = "/signup",
}: CTASectionProps) {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#009EA7] p-8 text-white shadow-xl shadow-[#00173C]/10 sm:p-10">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-[#DCE7F3]">{description}</p>
          <Link href={buttonHref} className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#00173C] shadow-lg shadow-[#00173C]/20 hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)]">
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
