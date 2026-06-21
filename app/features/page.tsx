import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Card } from "../components/ui";

const features = [
  {
    title: "Company workspace",
    body: "Keep founder, company, operations, customer, fundraising, and counsel preparation information in one structured place.",
  },
  {
    title: "Guided founder intake",
    body: "Capture the facts first-time founders are often asked to explain during early counsel conversations.",
  },
  {
    title: "Preparation dashboard",
    body: "Track preparation completion across company structure, founder alignment, ownership, records, privacy, fundraising, and counsel readiness.",
  },
  {
    title: "Matter preparation templates",
    body: "Prepare specific topics with objectives, people involved, document inventory, open questions, and missing information.",
  },
  {
    title: "Counsel packet generation",
    body: "Generate a founder-reviewed PDF packet that organizes supplied facts and identifies information requiring verification.",
  },
  {
    title: "Attorney matching request",
    body: "Capture preferences for subject area, jurisdiction, budget, communication format, and consent to share a selected summary.",
  },
  {
    title: "Source-backed education",
    body: "Build a repository for general educational materials and product boundaries without generating legal advice.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Features</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-6xl">
              Everything founders need to prepare before counsel.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              VenturePack turns early startup preparation into a practical workspace for company facts, matters, questions, and counsel packets.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className={index === 0 ? "bg-[#00173C] text-white shadow-xl shadow-[#00173C]/10" : "shadow-sm"}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${index === 0 ? "bg-white text-[#00173C]" : "bg-[rgba(0,158,167,0.10)] text-[#008787]"}`}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className={`mt-5 text-xl font-bold ${index === 0 ? "text-white" : "text-[#00173C]"}`}>{feature.title}</h2>
                <p className={`mt-3 text-sm leading-6 ${index === 0 ? "text-[#DCE7F3]" : "text-[#64748B]"}`}>{feature.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {["No legal advice", "No automated contract review", "No compliance claims"].map((item) => (
            <Card key={item} className="shadow-sm">
              <Badge>{item}</Badge>
              <p className="mt-4 text-sm leading-6 text-[#64748B]">
                VenturePack helps founders organize preparation information and better questions for qualified counsel.
              </p>
            </Card>
          ))}
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
