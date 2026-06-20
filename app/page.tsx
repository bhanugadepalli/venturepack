import Link from "next/link";
import { VenturePackLogo } from "@/components/VenturePackLogo";
import { Badge, Button, Card } from "./components/ui";

const productMockup = [
  ["Preparation dashboard", "72%", "Track company structure, founder alignment, IP, privacy, records, and counsel readiness."],
  ["Matter preparation", "Investor meeting prep", "Organize objectives, people, documents, open questions, and missing information."],
  ["Counsel packet preview", "Review required", "Separate founder-supplied facts from platform-organized summaries before download."],
];

const audiences = [
  ["Student founders", "Turn early ideas into a cleaner company preparation workspace before the first serious outside conversation."],
  ["Hackathon teams", "Capture who built what, what is still undecided, and which documents or notes already exist."],
  ["First-time founders", "Understand the categories counsel may ask about without pretending preparation is legal advice."],
  ["Accelerators and incubators", "Give cohorts a consistent way to organize facts, gaps, and questions before office hours."],
];

const howItWorks = [
  ["1", "Add company facts", "Founder, company, operations, fundraising, and counsel preparation details go into one structured workspace."],
  ["2", "Track preparation gaps", "Deterministic completion rules show missing items and suggested next preparation steps."],
  ["3", "Generate a counsel packet", "Create a professional packet preview the founder can review before speaking with qualified counsel."],
];

const features = [
  ["Company profile", "Keep core startup facts organized by founder, formation, product, operations, and fundraising."],
  ["Preparation completion", "See transparent category progress without calling it legal readiness, risk scoring, or compliance."],
  ["Matter workspace", "Prepare for cofounder, contractor, fundraising, customer, investor, and attorney meeting topics."],
  ["Document inventory", "List available notes, drafts, decks, records, and missing materials without automated contract review."],
  ["Counsel packet", "Package founder-supplied facts, open questions, missing information, and verification notes."],
  ["Attorney match intake", "Capture preferences for subject area, jurisdiction, budget, urgency, and communication style."],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#00173C]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#009EA7]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(0,158,167,0.34),transparent_30%),linear-gradient(180deg,rgba(0,23,60,0),rgba(0,23,60,0.22))]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <Link href="/" className="rounded-xl bg-white/95 p-2 shadow-sm shadow-[#00173C]/20 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/70">
              <VenturePackLogo width={190} height={64} priority className="h-9 w-auto sm:h-10" />
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 sm:inline-flex">
                Log in
              </Link>
              <Link href="/app" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#00173C] shadow-sm shadow-[#00173C]/20 hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-white/70">
                Open workspace
              </Link>
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
                Startup preparation workspace
              </span>
              <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Prepare your startup before the first legal conversation.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#DCE7F3]">
                VenturePack helps first-time founders organize company facts, track preparation gaps, and generate
                counsel packets before speaking with an attorney.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/app" className="bg-white px-5 py-3 text-[#00173C] shadow-lg shadow-[#00173C]/20 hover:bg-[#F8FAFC]">
                  Start preparation
                </Button>
                <Button href="/use-cases" variant="secondary" className="border-white/25 bg-white/10 px-5 py-3 text-white backdrop-blur hover:border-white/50 hover:bg-white/15">
                  Explore use cases
                </Button>
              </div>
              <div className="mt-8 grid max-w-xl gap-3 text-sm text-white/80 sm:grid-cols-3">
                {["Company facts", "Preparation gaps", "Counsel packets"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                    <span className="block h-1 w-8 rounded-full bg-[#009EA7]" />
                    <p className="mt-3 font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="absolute -inset-4 rounded-[2rem] bg-white/10 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/20 bg-white/95 p-4 shadow-2xl shadow-[#00173C]/40 backdrop-blur">
                <div className="rounded-3xl border border-[#DCE7F3] bg-[#F8FAFC] p-5">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#008787]">VenturePack workspace</p>
                      <h2 className="mt-1 text-2xl font-bold text-[#00173C]">Preparation snapshot</h2>
                    </div>
                    <span className="rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold text-[#008787]">
                      In progress
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#00173C]">Preparation dashboard</p>
                        <p className="mt-1 text-xs leading-5 text-[#64748B]">Company structure, ownership, IP, privacy, fundraising, and records.</p>
                      </div>
                      <span className="text-3xl font-bold text-[#0B3E9F]">72%</span>
                    </div>
                    <div className="mt-4 h-2.5 rounded-full bg-[#DCE7F3]">
                      <div className="h-2.5 w-[72%] rounded-full bg-gradient-to-r from-[#0B3E9F] to-[#009EA7]" />
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm">
                      <p className="text-sm font-bold text-[#00173C]">Matter preparation</p>
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">Objectives, people, documents, questions, and missing information.</p>
                      <span className="mt-4 inline-flex rounded-full bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-bold text-[#008787]">
                        Investor meeting prep
                      </span>
                    </div>
                    <div className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm">
                      <p className="text-sm font-bold text-[#00173C]">Counsel packet preview</p>
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">Founder facts, platform summary, and verification notes separated.</p>
                      <span className="mt-4 inline-flex rounded-full bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-bold text-[#008787]">
                        Review required
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 rounded-3xl border border-[#DCE7F3] bg-white p-4 sm:grid-cols-3">
                  {["Founder facts", "Open questions", "Documents"].map((label) => (
                    <div key={label}>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-[#DCE7F3]">
                        <div className="h-1.5 w-2/3 rounded-full bg-[#009EA7]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <Badge tone="indigo">Product mockup</Badge>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">One workspace for facts, gaps, matters, and packets.</h2>
              <p className="mt-4 text-lg leading-8 text-[#64748B]">
                The first version of VenturePack focuses on the work founders can do before counsel: organizing what
                they know, naming what is missing, and preparing better questions.
              </p>
            </div>
            <div className="grid gap-4 rounded-3xl border border-[#DCE7F3] bg-white p-5 shadow-xl shadow-slate-200/70">
              {productMockup.map(([title, metric, detail]) => (
                <div key={title} className="rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold">{title}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#008787] shadow-sm">{metric}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <Badge tone="blue">Company first</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">Start with the company, not the contract.</h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-[#64748B]">
            <p>
              Early legal conversations are often slowed down by basic missing context: who the founders are, what has
              been built, where the company operates, whether money has been accepted, and which documents already exist.
            </p>
            <p>
              VenturePack keeps the first motion centered on company preparation and founder questions. It does not
              review clauses, flag contract issues, or make legal conclusions.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge tone="green">Who it helps</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">Built for founders and programs preparing for better first conversations.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(([title, body]) => (
              <Card key={title} className="shadow-sm">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-[rgba(0,158,167,0.10)] px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge tone="blue">How it works</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">A simple preparation flow from workspace to packet.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {howItWorks.map(([step, title, body]) => (
              <Card key={title}>
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#0B3E9F] text-sm font-bold text-white">
                  {step}
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge tone="indigo">Feature grid</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">Everything in the MVP supports preparation.</h2>
            <p className="mt-4 text-lg leading-8 text-[#64748B]">
              VenturePack stays deliberately narrow: company onboarding, preparation completion, matter organization,
              document inventory, counsel packets, and attorney match intake.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, body]) => (
              <Card key={title} className="shadow-sm">
                <span className="block h-1.5 w-12 rounded-full bg-[#0B3E9F]" />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#00173C] p-8 text-white shadow-2xl shadow-slate-300/50 sm:p-10">
          <Badge tone="amber">Preparation, not legal advice.</Badge>
          <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight">
            VenturePack is not a law firm and does not provide legal advice.
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#DCE7F3]">
            VenturePack helps founders organize information, understand general startup preparation concepts, and
            prepare better questions for qualified counsel. Preparation completion is not legal compliance.
          </p>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge tone="blue">Founder story</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">Built from Akhil&apos;s first-founder problem.</h2>
          </div>
          <Card className="shadow-sm">
            <p className="text-lg leading-8 text-[#334155]">
              Akhil is preparing VenturePack as a pre-counsel preparation workspace for startup founders. Before
              speaking with a startup attorney, he needs to organize company facts, founder questions, product notes,
              expected operating locations, budget, and open decisions.
            </p>
            <p className="mt-5 text-base leading-7 text-[#64748B]">
              VenturePack turns that scattered preparation into a workspace and counsel packet, so the first conversation
              can start with clearer context and better questions.
            </p>
          </Card>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <Badge tone="green">Ready to prepare</Badge>
          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Build your first preparation workspace.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#64748B]">
            Start with company facts, identify preparation gaps, and generate a packet to review before speaking with
            qualified counsel.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/app">Start preparation</Button>
            <Button href="/signup" variant="secondary">Create account</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#DCE7F3] bg-white px-6 py-8 text-sm text-[#64748B] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex w-fit rounded-xl p-1 hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[rgba(0,158,167,0.28)]">
            <VenturePackLogo width={160} height={54} className="h-8 w-auto" />
          </Link>
          <p>Prepare your startup before the first legal conversation.</p>
        </div>
      </footer>
    </main>
  );
}
