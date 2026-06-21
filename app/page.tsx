import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "./components/ui";

const workflow = [
  ["01", "Create your workspace", "Capture founder, company, operations, fundraising, and counsel preparation information in one place."],
  ["02", "Track preparation gaps", "See preparation completion by category with missing information and suggested next preparation actions."],
  ["03", "Prepare a matter", "Organize objectives, people involved, documents, questions, and missing information for a specific topic."],
  ["04", "Generate a counsel packet", "Package founder-supplied facts, organized summaries, open questions, and verification notes for counsel review."],
];

const features = [
  ["Company workspace", "Keep core startup facts organized by founder, formation, product, operations, customer activity, and fundraising plans."],
  ["Guided intake", "Work through practical questions that help founders gather the context counsel commonly needs at the beginning."],
  ["Preparation completion", "Understand which preparation categories are complete, incomplete, or ready for deeper review."],
  ["Matter preparation", "Create structured matter notes for cofounder, contractor, fundraising, ownership, IP, customer, or attorney meeting topics."],
  ["Document inventory", "List available materials, drafts, notes, decks, records, and missing documents without analyzing legal terms."],
  ["Counsel packet", "Generate a founder-reviewed packet with facts, questions, documents, and information requiring verification."],
];

const audiences = [
  ["Student founders", "Organize project origins, contributors, product notes, and early ownership questions."],
  ["Hackathon teams", "Capture who built what, what still needs to be decided, and which materials already exist."],
  ["First-time founders", "Turn company facts, documents, and questions into a clearer first conversation with counsel."],
  ["Accelerators and incubators", "Give founder cohorts a consistent preparation structure before office hours or referrals."],
];

const pricing = [
  ["Free", "Start with guided onboarding, company workspace, preparation dashboard, and matter templates."],
  ["Founder", "Counsel packet workflows and preparation history are planned for founder teams."],
  ["Cohort", "Program seats and founder preparation workflows for accelerators, clinics, and incubators."],
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
                Founder preparation platform
              </span>
              <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Prepare your startup before the first legal conversation.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#DCE7F3]">
                VenturePack helps first-time founders turn scattered company facts into a structured counsel packet before speaking with an attorney.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/signup" className="bg-[#0B3E9F] px-5 py-3 text-white shadow-lg shadow-[#00173C]/20 hover:bg-[#00173C]">
                  Start Preparing
                </Button>
                <Button href="/how-it-works" variant="secondary" className="border-white/25 bg-white/10 px-5 py-3 text-white backdrop-blur hover:border-white/50 hover:bg-white/15">
                  See How It Works
                </Button>
              </div>
              <div className="mt-10 grid max-w-2xl gap-3 text-sm text-white/85 sm:grid-cols-3">
                {["Company facts", "Preparation gaps", "Counsel packet"].map((item) => (
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
                        <p className="text-sm font-bold text-[#00173C]">Preparation completion</p>
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
                      <p className="text-sm font-bold text-[#00173C]">Matter status</p>
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">Objectives, people, documents, questions, and missing information.</p>
                      <span className="mt-4 inline-flex rounded-full bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-bold text-[#008787]">
                        Ready for counsel review
                      </span>
                    </div>
                    <div className="rounded-2xl border border-[#DCE7F3] bg-white p-4 shadow-sm">
                      <p className="text-sm font-bold text-[#00173C]">Counsel packet</p>
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">Founder facts, organized summary, and verification notes separated.</p>
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

      <section className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge>Problem</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Founders rarely lack ambition. They lack organized facts.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Founder alignment", "Roles, ownership conversations, and contribution history are often scattered across chats and notes."],
              ["Company context", "Entity status, operating locations, product stage, customer activity, and data practices need one clean home."],
              ["Matter context", "Specific questions for counsel need objectives, documents, people involved, and missing information."],
              ["Preparation gaps", "Founders benefit from seeing what is complete and what still needs to be gathered."],
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
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#008787]">Counsel packet</p>
              <h3 className="mt-4 text-2xl font-bold text-[#00173C]">Founder-supplied facts</h3>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">Company overview, founder information, operations summary, fundraising summary, documents, and questions for counsel.</p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#DCE7F3] bg-white p-5">
                <h3 className="text-sm font-bold text-[#00173C]">Organized summary</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">A structured preview of the matter and preparation notes.</p>
              </div>
              <div className="rounded-2xl border border-[#DCE7F3] bg-white p-5">
                <h3 className="text-sm font-bold text-[#00173C]">Verification notes</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">Items that should be confirmed before counsel relies on them.</p>
              </div>
            </div>
          </div>
          <div>
            <Badge>Outcome</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Your first legal conversation should not start from scratch.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#64748B]">
              VenturePack helps founders prepare a clear packet before speaking with counsel, so the first conversation can begin with context instead of scattered explanations.
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
            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">A structured path from workspace to packet.</h2>
            <p className="mt-4 text-lg leading-8 text-[#DCE7F3]">
              The workflow keeps preparation practical: gather facts, identify gaps, prepare matters, and generate a packet for counsel review.
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
              Professional preparation tools for early founders.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#64748B]">
              VenturePack stays focused on company onboarding, preparation completion, matter organization, document inventory, counsel packets, and attorney match intake.
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
              Built for founders and programs preparing for better first conversations.
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
              VenturePack helps founders organize information, understand general preparation concepts, and prepare better questions for counsel. It does not provide legal advice, review contracts, determine compliance, or replace an attorney.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge>Founder story</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Built from Akhil&apos;s first-founder problem.
            </h2>
          </div>
          <Card className="shadow-sm">
            <p className="text-lg leading-8 text-[#334155]">
              Akhil is building VenturePack for the moment when a founder knows the company needs legal help, but does not yet have the facts, documents, and questions organized enough for a productive first conversation.
            </p>
            <p className="mt-5 text-base leading-7 text-[#64748B]">
              The product starts where founders start: company information, open decisions, document inventory, preparation gaps, and a counsel packet that can be reviewed before speaking with qualified counsel.
            </p>
          </Card>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <Badge>Pricing preview</Badge>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#00173C] sm:text-5xl">Simple paths for founders and cohorts.</h2>
              <p className="mt-4 text-lg leading-8 text-[#64748B]">
                Start with a company preparation workspace and choose the path that fits your stage.
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
            Walk into the first legal conversation with a clearer starting point.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#64748B]">
            Create a workspace, organize company facts, track preparation gaps, and generate a counsel packet before speaking with an attorney.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/signup">Start Preparing</Button>
            <Button href="/how-it-works" variant="secondary">See How It Works</Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
