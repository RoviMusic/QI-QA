import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { Flex } from "antd";
import CartProcess from "@/modules/tools/veerkampCart/components/cartProcess";

export default function VeerkampCartPage() {
  const token = process.env.VEERKAMP_TOKEN;

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Carrito de compras Veerkamp</MainTitle>

          <CartProcess token={token} />
        </Flex>
      </Container>
    </>
  );
}
