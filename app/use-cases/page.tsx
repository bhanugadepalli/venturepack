import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "../components/ui";

const useCases = [
  {
    title: "Startup preparation",
    body: "Organize company information before deployment or counsel conversations.",
  },
  {
    title: "Pitch competition",
    body: "Prepare a Pitch Brief with problem, solution, customer, product status, traction, team, milestones, and next steps.",
  },
  {
    title: "Class presentation",
    body: "Turn a student venture or class project into a structured preparation brief.",
  },
  {
    title: "Accelerator application",
    body: "Organize venture facts, progress, market context, team details, and open questions before applying.",
  },
  {
    title: "Launch planning",
    body: "Track product status, assets, support channels, user data questions, launch preparation, and missing details.",
  },
  {
    title: "Mentor conversation",
    body: "Bring a structured venture record instead of scattered notes.",
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
              Use VenturePack before the moments that require organized startup facts.
            </h1>
          </div>
          <div className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-xl shadow-[#00173C]/8">
            <p className="text-lg leading-8 text-[#64748B]">
              VenturePack is for the moment when a startup has enough facts, questions, contributors, deadlines, and assets that founders need an organized venture record.
            </p>
            <div className="mt-6">
              <Button href="/signup">Build My Checklist</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {useCases.map((useCase) => (
            <Card key={useCase.title} className="shadow-sm">
              <Badge>{useCase.title}</Badge>
              <p className="mt-5 text-sm leading-6 text-[#64748B]">{useCase.body}</p>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-7xl rounded-3xl border border-[#DCE7F3] bg-[#F8FAFC] p-6">
          <Badge>Boundary</Badge>
          <p className="mt-4 text-sm leading-6 text-[#64748B]">
            Based on your completed checklist items. Not legal, financial, or investment advice.
          </p>
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
