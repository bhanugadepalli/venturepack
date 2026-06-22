import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "../components/ui";

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Start organizing your venture.",
    cta: "Build My Checklist",
    href: "/signup",
    features: [
      "Company workspace",
      "Adaptive Venture Checklist",
      "Venture Progress preview",
      "Basic missing facts view",
      "Counsel Brief preview",
      "Pitch Brief preview",
    ],
  },
  {
    name: "Founder",
    price: "$19/month",
    badge: "Coming soon",
    subtitle: "For founders preparing to pitch, launch, or meet counsel.",
    cta: "Join Waitlist",
    href: "/signup",
    highlighted: true,
    features: [
      "Full Adaptive Venture Checklist",
      "Saved checklist answers",
      "Counsel Brief generation",
      "Pitch Brief generation",
      "PDF exports",
      "Advanced preparation history",
      "Attorney matching request",
    ],
  },
  {
    name: "Cohort",
    price: "Custom",
    subtitle: "For startup programs, student founder groups, accelerators, and clinics.",
    cta: "Contact Us",
    href: "/contact",
    features: [
      "Multiple founder workspaces",
      "Cohort preparation tracking",
      "Founder progress visibility",
      "Custom onboarding",
      "Program support",
    ],
  },
];

const faqs = [
  {
    question: "Does VenturePack provide legal advice?",
    answer:
      "No. VenturePack organizes preparation information. It is not a law firm and does not provide legal advice.",
  },
  {
    question: "What is Venture Progress?",
    answer:
      "Venture Progress reflects completion of requested preparation information. It is not a legal opinion, compliance rating, investment judgment, or guarantee.",
  },
  {
    question: "What is the Adaptive Venture Checklist?",
    answer:
      "It is a personalized checklist based on your business type, stage, goal, team status, and timeline.",
  },
  {
    question: "What are Counsel Briefs and Pitch Briefs?",
    answer:
      "They are preparation outputs generated from founder-supplied information and saved checklist answers.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00173C] via-[#0B3E9F] to-[#009EA7] px-6 py-20 text-white sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,rgba(0,23,60,0.06),rgba(0,23,60,0.36))]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Pricing
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Simple pricing for organized founders.</h1>
            <p className="mt-6 text-lg leading-8 text-[#DCE7F3]">
              VenturePack helps founders organize startup preparation, build adaptive checklists, track Venture Progress, and generate preparation briefs.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex min-h-full flex-col p-6 shadow-sm ${
                plan.highlighted ? "relative border-[#009EA7] shadow-xl shadow-[#00173C]/10 ring-1 ring-[#009EA7]/20" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <Badge>{plan.name}</Badge>
                {plan.badge ? (
                  <span className="rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold text-[#008787]">
                    {plan.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-6 text-4xl font-bold tracking-tight text-[#00173C]">{plan.price}</p>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[#64748B]">{plan.subtitle}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-[#64748B]">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#009EA7]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button href={plan.href} variant={plan.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#DCE7F3] bg-[#F8FAFC] p-6 sm:p-8">
          <Badge>Pricing note</Badge>
          <p className="mt-4 text-sm leading-6 text-[#64748B]">
            VenturePack organizes preparation information. It is not a law firm and does not provide legal advice.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">Stripe payments are not connected yet.</p>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>FAQ</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#00173C] sm:text-5xl">
              Common pricing questions.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.question} className="shadow-sm">
                <h3 className="text-lg font-bold text-[#00173C]">{faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Build your checklist with VenturePack." buttonLabel="Build My Checklist" buttonHref="/signup" />
    </MarketingShell>
  );
}
