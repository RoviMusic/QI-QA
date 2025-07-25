import Container from "@/components/layout/Container";
import Processor from "@/modules/tools/process/components/processor";
import Sync from "@/modules/tools/sync/components/sync";

export default function SyncProcessPage() {
  return (
    <>
      <Container>
        <Sync />
        <Processor />
      </Container>
    </>
  );
}
