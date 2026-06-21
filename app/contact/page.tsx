import { CTASection } from "@/components/marketing/CTASection";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge, Card } from "../components/ui";
import { ContactForm } from "./ContactForm";

const inquiryTypes = [
  {
    title: "Founder inquiries",
    body: "Questions about preparing company information, matters, and counsel packets before a first attorney conversation.",
  },
  {
    title: "Accelerator/cohort inquiries",
    body: "Explore how VenturePack could help teams gather consistent preparation information before office hours or referrals.",
  },
  {
    title: "Attorney partnership inquiries",
    body: "Share feedback on counsel packet structure, founder preparation workflows, or future referral boundaries.",
  },
  {
    title: "General questions",
    body: "Ask about the product, public pages, account setup, or upcoming founder preparation features.",
  },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Badge>Contact</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#00173C] sm:text-6xl">
              Talk to VenturePack.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              Reach out about founder preparation, cohort workflows, attorney partnerships, or general product questions.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {inquiryTypes.map((inquiry) => (
                <Card key={inquiry.title} className="shadow-sm">
                  <h2 className="text-lg font-bold text-[#00173C]">{inquiry.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{inquiry.body}</p>
                </Card>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="bg-white px-6 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#DCE7F3] bg-[#F8FAFC] p-6">
          <p className="text-sm leading-6 text-[#64748B]">
            VenturePack is not a law firm and does not provide legal advice. Contact messages do not create an attorney-client relationship or attorney representation.
          </p>
        </div>
      </section>

      <CTASection />
    </MarketingShell>
  );
}
