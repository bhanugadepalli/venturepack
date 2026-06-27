import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Card } from "../components/ui";

const features = [
  {
    title: "Adaptive Venture Checklist",
    body: "Build your personalized startup checklist.",
    bullets: [
      "Software app, AI tool, marketplace, service business, e-commerce, and student venture options",
      "Questions grouped by stable preparation categories",
      "Missing facts and suggested next actions",
      "AI-assisted questions with rules-based fallback",
    ],
  },
  {
    title: "Venture Progress",
    body: "Track your progress across the key areas every young venture needs to organize before launch.",
    bullets: [
      "Overall Venture Progress",
      "Overall preparation",
      "Deterministic scoring",
      "Missing facts panel",
    ],
    note: "Based on your completed checklist items. Not legal, financial, or investment advice.",
  },
  {
    title: "Counsel Brief",
    body: "Organize company information before deployment or counsel conversations.",
  },
  {
    title: "Pitch Brief",
    body: "Prepare a clear startup summary for pitch competitions, class presentations, mentors, and accelerator conversations.",
  },
  {
    title: "Company Workspace",
    body: "Keep startup facts in one persistent record instead of scattered notes and one-time chats.",
  },
  {
    title: "Preparation Boundaries",
    body: "VenturePack helps organize information. It does not provide legal advice, review contracts, determine compliance, or replace qualified counsel.",
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
              Everything founders need to organize the venture before the next big step.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              VenturePack is your startup preparation dashboard.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={feature.title} className={index === 0 ? "bg-[#00173C] text-white shadow-xl shadow-[#00173C]/10" : "shadow-sm"}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${index === 0 ? "bg-white text-[#00173C]" : "bg-[rgba(0,158,167,0.10)] text-[#008787]"}`}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className={`mt-5 text-xl font-bold ${index === 0 ? "text-white" : "text-[#00173C]"}`}>{feature.title}</h2>
                <p className={`mt-3 text-sm leading-6 ${index === 0 ? "text-[#DCE7F3]" : "text-[#64748B]"}`}>{feature.body}</p>
                {feature.bullets ? (
                  <ul className={`mt-5 space-y-3 text-sm leading-6 ${index === 0 ? "text-[#DCE7F3]" : "text-[#64748B]"}`}>
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${index === 0 ? "bg-[#009EA7]" : "bg-[#009EA7]"}`} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {feature.note ? (
                  <p className="mt-5 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-xs leading-5 text-[#64748B]">
                    {feature.note}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DCE7F3] bg-white px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {["Preparation only", "Founder-supplied information", "Persistent venture record"].map((item) => (
            <Card key={item} className="shadow-sm">
              <Badge>{item}</Badge>
              <p className="mt-4 text-sm leading-6 text-[#64748B]">
                VenturePack organizes preparation information and keeps missing facts visible for founder review.
              </p>
            </Card>
          ))}
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
