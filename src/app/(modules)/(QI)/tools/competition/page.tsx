import { Flex } from "antd";
import Container from "@/components/layout/Container";
import ProductsList from "@/modules/tools/competition/components/ProductsList";
import { GetProductsList } from "@/modules/tools/competition/services/competitionService";
import { MainTitle } from "@/components/core/Titulo";

export default async function CompetenciaPage() {
  const list = await GetProductsList();

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle level={2}>Competencias</MainTitle>

          <ProductsList list={list} />
        </Flex>
      </Container>
    </>
  );
}
