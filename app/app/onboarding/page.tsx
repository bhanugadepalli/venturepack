import { OnboardingForm } from "../../components/MockForms";
import { PageHeader } from "../../components/PageHeader";

export default function OnboardingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Guided intake"
        title="Founder onboarding"
        description="Capture the basic company, operations, fundraising, and counsel preparation context founders should organize before a first meeting."
      />
      <OnboardingForm />
    </>
  );
}
