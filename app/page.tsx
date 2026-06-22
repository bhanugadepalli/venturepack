import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "./components/ui";

const workflow = [
  ["01", "Build your checklist", "Answer a few setup questions about your venture type, stage, goal, team status, and timeline."],
  ["02", "Save founder-supplied facts", "Work through preparation questions and keep answers, supporting details, and review status in one workspace."],
  ["03", "Track Venture Progress", "See category Preparation Completion, missing facts, and practical next actions as your venture record develops."],
  ["04", "Generate preparation briefs", "Create Counsel Briefs and Pitch Briefs from saved facts, with missing information clearly separated."],
];

const features = [
  ["Personalized checklist by venture type", "Create preparation questions based on your business type, stage, goal, team status, and timeline."],
  ["Venture Progress tracking", "See overall progress and category Preparation Completion from saved answers and founder review."],
  ["Missing facts and next actions", "Keep open details visible so your team can gather the information that still needs a home."],
  ["Counsel Brief generation", "Organize company facts, contributor history, assets, open questions, and missing information before a counsel conversation."],
  ["Pitch Brief generation", "Turn startup facts into a clean preparation brief for pitches, mentors, class presentations, and accelerator conversations."],
  ["Organized venture record", "Keep founder-supplied information together instead of scattered across chats, notes, decks, and memory."],
];

const audiences = [
  ["Student founders", "Organize project origins, contributors, product notes, presentation timelines, and open questions."],
  ["Campus teams", "Capture who worked on what, which materials exist, and what still needs to be clarified."],
  ["First-time founders", "Turn scattered company facts into a persistent workspace for pitching, launching, and meeting counsel."],
  ["Accelerators and incubators", "Give founder cohorts a consistent preparation structure before office hours, presentations, or referrals."],
];

const pricing = [
  ["Free", "Start with a company workspace, Adaptive Venture Checklist, Venture Progress, and preparation brief previews."],
  ["Founder", "Expanded brief workflows, preparation history, and founder team features are planned."],
  ["Cohort", "Program seats and organized venture records for accelerators, clinics, and incubators."],
];

export default function Home() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#009EA7]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(0,158,167,0.28),transparent_32%),linear-gradient(180deg,rgba(0,23,60,0.08),rgba(0,23,60,0.34))]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
                Startup launchpad command center
              </span>
              <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                The startup launchpad for organized founders.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#DCE7F3]">
                Turn scattered startup facts into adaptive checklists, Venture Progress, Counsel Briefs, and Pitch Briefs.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/signup" className="bg-[#0B3E9F] px-5 py-3 text-white shadow-lg shadow-[#00173C]/20 hover:bg-[#00173C]">
                  Build My Checklist
                </Button>
                <Button href="/how-it-works" variant="secondary" className="border-white/25 bg-white/10 px-5 py-3 text-white backdrop-blur hover:border-white/50 hover:bg-white/15">
                  See How It Works
                </Button>
              </div>
              <div className="mt-10 grid max-w-2xl gap-3 text-sm text-white/85 sm:grid-cols-3">
                {["Adaptive checklist", "Venture Progress", "Preparation briefs"].map((item) => (
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
                      <h2 className="mt-1 text-2xl font-bold text-[#00173C]">Launchpad snapshot</h2>
                    </div>
                    <span className="rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold text-[#008787]">
                      In progress
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#00173C]">Venture Progress</p>
                        <p className="mt-1 text-xs leading-5 text-[#64748B]">Saved facts, reviewed answers, supporting details, and missing information.</p>
                      </div>
                      <span className="text-3xl font-bold text-[#0B3E9F]">72%</span>
                    </div>
                    <div className="mt-4 h-2.5 rounded-full bg-[#DCE7F3]">
                      <div className="h-2.5 w-[72%] rounded-full bg-gradient-to-r from-[#0B3E9F] to-[#009EA7]" />
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm">
                      <p className="text-sm font-bold text-[#00173C]">Adaptive Checklist</p>
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">Questions shaped by venture type, stage, goal, team status, and timeline.</p>
                      <span className="mt-4 inline-flex rounded-full bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-bold text-[#008787]">
                        Personalized
                      </span>
                    </div>
                    <div className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm">
                      <p className="text-sm font-bold text-[#00173C]">Preparation briefs</p>
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">Counsel Briefs and Pitch Briefs generated from saved founder-supplied information.</p>
                      <span className="mt-4 inline-flex rounded-full bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-bold text-[#008787]">
                        Review required
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 rounded-3xl border border-[#DCE7F3] bg-white p-4 sm:grid-cols-3">
                  {["Founder facts", "Missing details", "Brief outputs"].map((label) => (
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

      <section className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge>Problem</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Young founders do not just need advice. They need structure.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#64748B]">
              Most early teams have ideas, notes, contributors, pitch deadlines, product details, and open questions scattered across texts, docs, decks, and memory. VenturePack turns that scattered information into a structured venture record.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Scattered startup facts", "Ideas, notes, docs, decks, and saved messages are hard to use when they live in separate places."],
              ["Unclear founder roles", "Teams need one place to capture who is involved, what each person contributed, and what still needs clarity."],
              ["Missing product and asset details", "Product notes, code ownership, brand assets, data practices, and records need a structured home."],
              ["Pitch and launch deadlines", "Upcoming presentations, launches, mentor meetings, and counsel conversations need visible preparation steps."],
              ["Counsel questions saved too late", "Open questions are easier to review when they are captured while the facts are still fresh."],
            ].map(([title, body]) => (
              <Card key={title} className="shadow-sm">
                <h3 className="text-lg font-bold text-[#00173C]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-3xl border border-[#DCE7F3] bg-[#F8FAFC] p-5 shadow-xl shadow-slate-200/60">
            <div className="rounded-2xl border border-[#DCE7F3] bg-white p-6">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Adaptive Venture Checklist</p>
              <h3 className="mt-4 text-2xl font-bold text-[#00173C]">Personalized preparation questions</h3>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">Answer a few questions about what you are building, where you are, and what you are preparing for.</p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#DCE7F3] bg-white p-5">
                <h3 className="text-sm font-bold text-[#00173C]">Venture Progress</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">Track completion of requested preparation information by category.</p>
              </div>
              <div className="rounded-2xl border border-[#DCE7F3] bg-white p-5">
                <h3 className="text-sm font-bold text-[#00173C]">Missing facts</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">See the next details to gather before sharing a brief.</p>
              </div>
            </div>
          </div>
          <div>
            <Badge>Main feature</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Adaptive Venture Checklist
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#64748B]">
              VenturePack creates a personalized preparation checklist based on your business type, stage, goal, team status, and timeline.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#00173C] px-6 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              How VenturePack works
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">A structured path from facts to briefs.</h2>
            <p className="mt-4 text-lg leading-8 text-[#DCE7F3]">
              The workflow keeps preparation practical: build a checklist, save facts, track Venture Progress, and generate preparation briefs.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map(([step, title, body]) => (
              <div key={title} className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#00173C]">{step}</span>
                <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#DCE7F3]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Features</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Everything organized founders need to prepare.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#64748B]">
              VenturePack helps young entrepreneurs turn scattered startup facts into checklists, progress, and preparation briefs for pitching, launching, and meeting counsel.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, body]) => (
              <Card key={title} className="shadow-sm">
                <span className="block h-1.5 w-12 rounded-full bg-[#0B3E9F]" />
                <h3 className="mt-5 text-xl font-bold text-[#00173C]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Who it is for</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Built for founders and programs that need structure.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(([title, body]) => (
              <Card key={title} className="shadow-sm">
                <h3 className="text-lg font-bold text-[#00173C]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#008787] px-6 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Boundaries and trust
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Built for preparation. Designed with boundaries.
            </h2>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-8">
            <p className="text-lg leading-8 text-[#EAF4FF]">
              VenturePack organizes preparation information. It is not a law firm and does not provide legal advice. It does not review contracts, determine compliance, score legal risk, or replace qualified counsel.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Brief outputs</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Generate preparation briefs from saved facts.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Card className="shadow-sm">
              <Badge>Counsel Brief</Badge>
              <p className="mt-5 text-lg leading-8 text-[#334155]">
                Organize company facts, founder details, contributor history, assets, open questions, and missing information before a counsel conversation.
              </p>
            </Card>
            <Card className="shadow-sm">
              <Badge>Pitch Brief</Badge>
              <p className="mt-5 text-lg leading-8 text-[#334155]">
                Turn startup facts into a clean preparation brief for pitches, mentors, class presentations, and accelerator conversations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Why VenturePack</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              ChatGPT gives advice. VenturePack organizes the venture.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Card className="shadow-sm">
              <h3 className="text-xl font-bold text-[#00173C]">ChatGPT</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#64748B]">
                {["One-time prompt", "Founder must know what to ask", "Text disappears into chat history", "No persistent venture record", "No structured progress"].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#94A3B8]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="bg-[#00173C] text-white shadow-xl shadow-[#00173C]/10">
              <h3 className="text-xl font-bold text-white">VenturePack</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#DCE7F3]">
                {["Persistent company workspace", "Adaptive checklist", "Venture Progress", "Counsel Brief and Pitch Brief", "Saved answers and missing facts"].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#009EA7]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <Badge>Pricing preview</Badge>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">Simple paths for founders and cohorts.</h2>
              <p className="mt-4 text-lg leading-8 text-[#64748B]">
                Start with a company workspace and choose the path that fits your stage.
              </p>
            </div>
            <Button href="/pricing" variant="secondary">View pricing</Button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pricing.map(([name, body]) => (
              <Card key={name} className="shadow-sm">
                <Badge>{name}</Badge>
                <p className="mt-5 text-sm leading-6 text-[#64748B]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <Badge>Ready to prepare</Badge>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
            Build your checklist. Organize your venture.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#64748B]">
            Start with a few questions. Leave with structured progress, clearer next actions, and preparation briefs you can review before pitching, launching, or meeting counsel.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/signup">Build My Checklist</Button>
            <Button href="/how-it-works" variant="secondary">See How It Works</Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
