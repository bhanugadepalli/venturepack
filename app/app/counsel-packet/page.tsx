import { CounselPacketClient } from "../../components/CounselPacketClient";
import { PageHeader } from "../../components/PageHeader";

export default function CounselPacketPage() {
  return (
    <>
      <PageHeader
        eyebrow="Packet preview"
        title="Counsel packet"
        description="Preview organized company and matter context before sharing it with licensed counsel."
      />
      <CounselPacketClient />
    </>
  );
}
