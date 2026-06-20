import { PageHeader } from "../../components/PageHeader";
import { MattersClient } from "../../components/MattersClient";

export default function MattersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Matter preparation"
        title="Matters"
        description="Organize each topic as a preparation file with context, documents, and questions for counsel."
      />
      <MattersClient />
    </>
  );
}
