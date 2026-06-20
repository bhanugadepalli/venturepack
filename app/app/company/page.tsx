import { CompanyProfileClient } from "../../components/CompanyProfileClient";
import { PageHeader } from "../../components/PageHeader";

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Structured startup information"
        title="Company profile"
        description="A structured view of the founder-provided company context saved during onboarding."
      />
      <CompanyProfileClient />
    </>
  );
}
