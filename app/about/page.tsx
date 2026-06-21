import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "../components/ui";

const principles = [
  {
    title: "Start with the company",
    body: "The workspace begins with founder facts, company context, operations, records, and preparation questions.",
  },
  {
    title: "Respect the boundary",
    body: "VenturePack helps founders organize information. It is not a law firm and does not provide legal advice.",
  },
  {
    title: "Make counsel conversations better",
    body: "The goal is a clearer first conversation with qualified counsel, not a replacement for that conversation.",
  },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <Badge>About</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-6xl">
              Built by a future startup lawyer.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              VenturePack was created by Akhil, an economics student preparing for a career in startup law. He saw that early founders often arrive at their first legal meeting unprepared, not because they lack ambition, but because no one gave them a structure.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup">Start preparing</Button>
              <Button href="/contact" variant="secondary">Contact VenturePack</Button>
            </div>
          </div>
          <Card className="shadow-xl shadow-[#00173C]/8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#008787]">Founder note</p>
            <blockquote className="mt-5 text-2xl font-bold leading-tight text-[#00173C]">
              Early founders should not need to know every legal term before they can organize the facts counsel will ask for.
            </blockquote>
            <p className="mt-5 text-sm leading-6 text-[#64748B]">
              VenturePack is intentionally early-stage and practical: gather facts, surface preparation gaps, prepare matters, and create a better first packet for counsel review.
            </p>
          </Card>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <Card key={principle.title} className="shadow-sm">
              <Badge>{principle.title}</Badge>
              <p className="mt-4 text-sm leading-6 text-[#64748B]">{principle.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
