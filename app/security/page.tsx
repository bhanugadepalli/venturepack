import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Card } from "../components/ui";

const sections = [
  {
    title: "Founder-controlled workspaces",
    body: "Founders create and manage their own preparation workspace, including company profile information, matters, and packet review steps.",
  },
  {
    title: "Structured company records",
    body: "VenturePack keeps startup preparation information organized by company, category, matter, and counsel packet preview.",
  },
  {
    title: "Protected account access",
    body: "Private app pages require account login, while marketing and authentication pages remain public.",
  },
  {
    title: "Separate company records",
    body: "Company records are tied to the signed-in owner so users should only access their own workspace data.",
  },
  {
    title: "Preparation history",
    body: "The product is designed around preparation artifacts such as matters, packets, source records, and administrative audit events.",
  },
  {
    title: "Clear product boundaries",
    body: "VenturePack organizes preparation information only. It is not a law firm and does not provide legal advice.",
  },
];

export default function SecurityPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <Badge>Security</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-6xl">
              Founder-controlled preparation, with clear product boundaries.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              VenturePack keeps its security language practical and precise. The product is built to organize founder preparation information, protect private app access, and avoid unsupported claims.
            </p>
          </div>
          <Card className="bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#009EA7] text-white shadow-xl shadow-[#00173C]/10">
            <Badge tone="slate">Boundary note</Badge>
            <h2 className="mt-5 text-2xl font-bold text-white">Preparation, not legal advice.</h2>
            <p className="mt-3 text-sm leading-6 text-[#DCE7F3]">
              VenturePack does not claim attorney-client privilege, legal representation, regulated-industry certification, or third-party security attestations.
            </p>
          </Card>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.title} className="shadow-sm">
              <span className="block h-1.5 w-12 rounded-full bg-[#009EA7]" />
              <h2 className="mt-5 text-xl font-bold text-[#00173C]">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">{section.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
