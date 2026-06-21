import { Badge, Button, Card } from "../../components/ui";
import { PageHeader } from "../../components/PageHeader";

const founderFeatures = [
  "Counsel packet generation",
  "PDF packet downloads",
  "Advanced preparation workflows",
  "Matter preparation history",
  "Attorney matching request",
];

export default function BillingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Billing"
        title="Plan and billing"
        description="Review your current VenturePack access and planned Founder plan controls."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5">
          <Card className="shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge>Current plan</Badge>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#00173C]">Free</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                  Your workspace includes founder preparation basics, guided onboarding, preparation completion, basic matter setup, and counsel packet preview.
                </p>
              </div>
              <Button href="/pricing" variant="secondary">
                View Pricing
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden border-[#009EA7] p-0 shadow-xl shadow-[#00173C]/[0.06]">
            <div className="h-2 bg-gradient-to-r from-[#0B3E9F] via-[#009EA7] to-[#008787]" />
            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>Founder</Badge>
                    <span className="rounded-full bg-[rgba(0,158,167,0.10)] px-3 py-1 text-xs font-bold text-[#008787]">
                      Coming soon
                    </span>
                  </div>
                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#00173C]">$19/month</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                    Founder access is planned for teams that want counsel packet generation, downloads, and deeper preparation workflows.
                  </p>
                </div>
                <Button href="/pricing">View Pricing</Button>
              </div>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {founderFeatures.map((feature) => (
                  <li key={feature} className="flex gap-3 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-3 text-sm font-semibold text-[#00173C]">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#009EA7]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="bg-[#00173C] text-white shadow-xl shadow-[#00173C]/10">
            <Badge tone="slate">Access note</Badge>
            <p className="mt-4 text-sm leading-6 text-[#DCE7F3]">
              Billing controls app access only. VenturePack does not provide legal advice.
            </p>
          </Card>
          <Card className="shadow-sm">
            <h2 className="text-lg font-bold text-[#00173C]">No payment method required</h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              Stripe is not connected yet. You can continue using the Free workspace while Founder plan access is being prepared.
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
