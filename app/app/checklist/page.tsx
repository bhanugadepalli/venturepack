import { AdaptiveChecklistClient } from "../../components/AdaptiveChecklistClient";
import { PageHeader } from "../../components/PageHeader";

export default function AdaptiveChecklistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Venture Progress"
        title="Adaptive Venture Checklist"
        description="Build a personalized preparation checklist based on what you are building, where you are, and what you are preparing for."
      />
      <AdaptiveChecklistClient />
    </>
  );
}
