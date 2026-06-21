import { AdaptiveChecklistClient } from "../../components/AdaptiveChecklistClient";
import { PageHeader } from "../../components/PageHeader";

type ChecklistBriefType = "COUNSEL_BRIEF" | "PITCH_BRIEF";

function briefTypeFromSearchParam(value: string | string[] | undefined): ChecklistBriefType | undefined {
  const brief = Array.isArray(value) ? value[0] : value;
  return brief === "COUNSEL_BRIEF" || brief === "PITCH_BRIEF" ? brief : undefined;
}

export default async function AdaptiveChecklistPage({
  searchParams,
}: {
  searchParams: Promise<{ brief?: string | string[] }>;
}) {
  const requestedBriefType = briefTypeFromSearchParam((await searchParams).brief);

  return (
    <>
      <PageHeader
        eyebrow="Venture Progress"
        title="Adaptive Venture Checklist"
        description="Build a personalized preparation checklist based on what you are building, where you are, and what you are preparing for."
      />
      <AdaptiveChecklistClient requestedBriefType={requestedBriefType} />
    </>
  );
}
