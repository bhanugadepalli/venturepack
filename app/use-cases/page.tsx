import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "../components/ui";

const useCases = [
  {
    title: "Student founders",
    situation: "A team is turning a class project or research idea into a real startup.",
    organize: "Founder roles, project origin, ownership discussions, product notes, and documents already created.",
    counsel: "Counsel may be needed before forming an entity, assigning IP, or bringing in outside contributors.",
  },
  {
    title: "Hackathon teams",
    situation: "A weekend project becomes something the team wants to keep building.",
    organize: "Who built what, which assets exist, whether the team wants to continue, and what still needs to be decided.",
    counsel: "Counsel may be needed before fundraising, customer pilots, contractor work, or formal ownership decisions.",
  },
  {
    title: "First-time founders",
    situation: "A founder is preparing for a first serious attorney conversation.",
    organize: "Company facts, founder alignment, customer activity, data practices, fundraising plans, and open questions.",
    counsel: "Counsel may be needed when formation, founder documents, IP, privacy, or fundraising decisions become concrete.",
  },
  {
    title: "Accelerators and incubators",
    situation: "A program wants teams to arrive at office hours with clearer context.",
    organize: "Consistent founder intake, matter summaries, document inventories, and preparation completion categories.",
    counsel: "Counsel may be needed for referrals, program clinics, incorporation questions, financing preparation, or customer contracts.",
  },
  {
    title: "Startup clinics",
    situation: "A clinic needs founders to gather basic context before meeting with students or supervising attorneys.",
    organize: "Founder-supplied facts, missing information, questions for counsel, and a clean packet preview.",
    counsel: "Counsel may be needed to review the founder-provided information and decide what advice or representation is appropriate.",
  },
  {
    title: "Solo builders",
    situation: "A solo founder wants to move from prototype to company with more structure.",
    organize: "Product stage, revenue status, customer locations, contractors, personal information practices, and fundraising plans.",
    counsel: "Counsel may be needed before forming the company, signing customer agreements, raising money, or hiring help.",
  },
];

export default function UseCasesPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <Badge>Use cases</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-6xl">
              Built for early founders before the first serious legal conversation.
            </h1>
          </div>
          <div className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-xl shadow-[#00173C]/8">
            <p className="text-lg leading-8 text-[#64748B]">
              VenturePack is for the moment when a startup is real enough to need structure, but still early enough that founders are not sure what information counsel will ask for first.
            </p>
            <div className="mt-6">
              <Button href="/signup">Start preparing</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {useCases.map((useCase) => (
            <Card key={useCase.title} className="shadow-sm">
              <Badge>{useCase.title}</Badge>
              <div className="mt-5 space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-[#00173C]">Situation</h2>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">{useCase.situation}</p>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#00173C]">What VenturePack helps organize</h2>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">{useCase.organize}</p>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#00173C]">When counsel may be needed</h2>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">{useCase.counsel}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
