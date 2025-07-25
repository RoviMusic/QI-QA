import { MainTitle, MutedSubtitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import ProductCard from "@/modules/ecommerce/catalog/components/ProductCard";
import ProductSearch from "@/modules/ecommerce/catalog/components/ProductSearch";
import { dummyDataProduct } from "@/modules/ecommerce/catalog/types/catalogTypes";
import { Col, Flex, Row, Space } from "antd";
import { useTranslations } from "next-intl";

export default function CatalogoPage() {
  const t = useTranslations("Ecommerce.catalog.product");
  return (
    <>
      <Container>
        <Flex vertical gap={30}>
          <Space direction="vertical">
            <MainTitle>{t("title")}</MainTitle>
            <MutedSubtitle>{t("catalogSubtitle")}</MutedSubtitle>
          </Space>

          <Flex>
            <ProductSearch />
          </Flex>

          <Row gutter={[10, 24]}>
            {dummyDataProduct.map((pr) => (
              <Col key={pr.sku} xxl={8} xl={10} lg={12} md={24} sm={24}>
                <ProductCard productData={pr} />
              </Col>
            ))}
          </Row>
        </Flex>
      </Container>
    </>
  );
}
