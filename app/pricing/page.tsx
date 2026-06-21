import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Button, Card } from "../components/ui";

const plans = [
  {
    name: "Free",
    price: "$0",
    label: "Start Free",
    href: "/signup",
    features: ["Company workspace", "Guided onboarding", "Preparation dashboard", "Matter templates"],
  },
  {
    name: "Founder",
    price: "Coming soon",
    label: "Join Waitlist",
    href: "/signup",
    features: ["Counsel packet generation", "PDF packet history", "Advanced preparation workflows"],
    highlighted: true,
  },
  {
    name: "Cohort",
    price: "Contact us",
    label: "Contact Us",
    href: "/contact",
    features: ["Accelerator seats", "Founder onboarding", "Program preparation"],
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge>Pricing</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-6xl">
              Simple pricing for every stage.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              Start with a practical preparation workspace today. Additional founder and cohort workflows are planned as VenturePack grows.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col shadow-sm ${plan.highlighted ? "border-[#009EA7] shadow-xl shadow-[#00173C]/8" : ""}`}>
                <div>
                  <Badge>{plan.name}</Badge>
                  <p className="mt-5 text-3xl font-bold text-[#00173C]">{plan.price}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm leading-6 text-[#64748B]">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#009EA7]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button href={plan.href} variant={plan.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
                  {plan.label}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#DCE7F3] bg-[#F8FAFC] p-6">
          <p className="text-sm leading-6 text-[#64748B]">
            VenturePack is not a law firm and does not provide legal advice. Preparation completion is not legal compliance.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">Stripe payments are not connected yet.</p>
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
