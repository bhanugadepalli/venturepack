import { DashboardClient } from "../components/DashboardClient";
import { PageHeader } from "../components/PageHeader";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Preparation workspace"
        title="Preparation completion"
        description="Track how much founder, company, and matter preparation context has been organized before a counsel conversation."
      />
      <DashboardClient />
    </>
  );
}
