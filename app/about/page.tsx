import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "../components/ui";

const principles = [
  {
    title: "Start with the venture",
    body: "The workspace begins with founder-supplied information, startup context, goals, timeline, and preparation questions.",
  },
  {
    title: "Respect the boundary",
    body: "VenturePack helps founders organize information. It is not a law firm and does not provide legal advice.",
  },
  {
    title: "Make preparation clearer",
    body: "The goal is a structured venture record founders can review before pitching, launching, or deployment.",
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
              Built for young entrepreneurs who need structure.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              VenturePack is your startup preparation dashboard. It helps early founders turn scattered facts into a structure they can use for pitching, launching, or deployment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup">Build My Checklist</Button>
              <Button href="/contact" variant="secondary">Contact VenturePack</Button>
            </div>
          </div>
          <Card className="shadow-xl shadow-[#00173C]/8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#008787]">Founder note</p>
            <blockquote className="mt-5 text-2xl font-bold leading-tight text-[#00173C]">
              Early founders should not need to know every term before they can organize the facts their venture needs.
            </blockquote>
            <p className="mt-5 text-sm leading-6 text-[#64748B]">
              VenturePack is intentionally practical: build an Adaptive Venture Checklist, track Venture Progress, save missing facts, and generate preparation briefs from founder-supplied information.
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
