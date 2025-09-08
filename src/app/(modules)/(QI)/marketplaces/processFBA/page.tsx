import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import FBAProcessor from "@/modules/marketplaces/components/fbaProcessor";
import { Flex } from "antd";

export default function ProcessFBAPage() {
  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Procesador de FBA</MainTitle>
          <FBAProcessor />
        </Flex>
      </Container>
    </>
  );
}
