import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import StockMarketsList from "@/modules/marketplaces/components/stockMarketsList";
import { GetStocks } from "@/modules/marketplaces/services/stockMarketsService";
import { Flex } from "antd";

export default async function StockMarteksPage() {
  const stocks = await GetStocks();
  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Visualizador de Stock</MainTitle>

          <StockMarketsList data={stocks.data} />
        </Flex>
      </Container>
    </>
  );
}
