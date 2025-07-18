import { MainTitle } from "@/components/core/Titulo";
import ProductForm from "@/modules/ecommerce/catalog/components/ProductForm";
import { Flex, Space } from "antd";
import { useTranslations } from "next-intl";

export default function CreateProductPage() {
  const t = useTranslations("Ecommerce.catalog.product");
  return (
    <Flex vertical gap={30}>
      <Space direction="vertical">
        <MainTitle >
          {t("createTitle")}
        </MainTitle>
      </Space>

      <ProductForm />
    </Flex>
  );
}
