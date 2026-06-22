import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "./ui";

type MarketingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

export function MarketingPage({ eyebrow, title, description, sections }: MarketingPageProps) {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge tone="blue">{eyebrow}</Badge>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-[#00173C] sm:text-6xl">{title}</h1>
            <p className="mt-5 text-lg leading-8 text-[#64748B]">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup">Build My Checklist</Button>
              <Button href="/how-it-works" variant="secondary">See How It Works</Button>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {sections.map((section) => (
              <Card key={section.title} className="shadow-sm">
                <span className="block h-1.5 w-12 rounded-full bg-[#009EA7]" />
                <h2 className="mt-5 text-xl font-bold text-[#00173C]">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{section.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#00173C] p-8 text-white">
          <Badge tone="amber">Preparation, with boundaries.</Badge>
          <h2 className="mt-4 text-3xl font-bold">VenturePack is not a law firm and does not provide legal advice.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#DCE7F3]">
            VenturePack helps founders organize founder-supplied information, track Venture Progress, and prepare briefs they can review before pitching, launching, or meeting counsel.
          </p>
        </div>
      </section>
      <CTASection />
    </MarketingShell>
  );
}
