import Container from "@/components/layout/Container";
import Processor from "@/modules/tools/process/components/processor";
import Sync from "@/modules/tools/sync/components/sync";
import { Flex } from "antd";

export default function SyncProcessPage() {
  return (
    <>
      <Container>
        <Flex vertical gap={50}>
          <Processor />
        </Flex>
      </Container>
    </>
  );
}
