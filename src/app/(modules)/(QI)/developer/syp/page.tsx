import Container from "@/components/layout/Container";
import ProcessorDev from "@/modules/tools/process/components/processorDev";
import Sync from "@/modules/tools/sync/components/sync";
import { Flex } from "antd";

export default function DevSipPage() {
  return (
    <>
      <Container>
        <Flex vertical gap={50}>
          <Sync />
          <ProcessorDev />
        </Flex>
      </Container>
    </>
  );
}
