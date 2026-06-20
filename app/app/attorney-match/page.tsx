import { AttorneyMatchForm } from "../../components/MockForms";
import { PageHeader } from "../../components/PageHeader";

export default function AttorneyMatchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Matching request"
        title="Attorney matching"
        description="Save matching preferences and consent settings for a future attorney introduction workflow."
      />
      <AttorneyMatchForm />
    </>
  );
}
