import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "../components/ui";

const steps = [
  {
    title: "Create your workspace",
    body: "Start with a private founder workspace for company facts, founder context, operating details, and preparation notes.",
  },
  {
    title: "Complete guided intake",
    body: "Work through founder, company, operations, fundraising, and counsel preparation questions in a structured flow.",
  },
  {
    title: "Track preparation gaps",
    body: "See preparation completion by category, including missing information and next preparation actions.",
  },
  {
    title: "Prepare a matter",
    body: "Organize a specific topic with objectives, people involved, related documents, open questions, and missing information.",
  },
  {
    title: "Generate your counsel packet",
    body: "Create a founder-reviewed packet that separates supplied facts, organized summaries, and information requiring verification.",
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <Badge>How it works</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-6xl">
              From scattered founder facts to a structured counsel packet.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              VenturePack gives founders a guided path to organize company information, identify preparation gaps, prepare specific matters, and walk into counsel conversations with better structure.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" className="px-5 py-3">Start Preparing</Button>
              <Button href="/features" variant="secondary" className="px-5 py-3">Explore features</Button>
            </div>
          </div>
          <Card className="relative overflow-hidden p-6 shadow-xl shadow-[#00173C]/8">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[rgba(0,158,167,0.12)]" />
            <p className="text-sm font-semibold text-[#008787]">Preparation flow</p>
            <div className="mt-6 space-y-4">
              {steps.slice(0, 4).map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-2xl border border-[#DCE7F3] bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3E9F] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-[#00173C]">{step.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Guided path</Badge>
            <h2 className="mt-4 text-3xl font-bold text-[#00173C] sm:text-4xl">A clean path from intake to packet.</h2>
            <p className="mt-4 text-sm leading-6 text-[#64748B]">
              The workflow is designed for early founders who need structure before speaking with qualified counsel, without creating legal conclusions.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <Card key={step.title} className="shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(0,158,167,0.10)] text-sm font-bold text-[#008787]">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#00173C]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection buttonLabel="Start Preparing" buttonHref="/signup" />
    </MarketingShell>
  );
}
