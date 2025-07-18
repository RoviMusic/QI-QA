"use client";
import GlassCard from "@/components/core/GlassCard";
import { CatalogType } from "../types/catalogTypes";
import { Col, Flex, Row, Space, Typography } from "antd";
import CategoriesBreadCrumb from "@/components/core/CategoriesBreadcrumb";
import Image from "next/image";
import {
  DefaultTitle,
  LabelTitle,
  MainTitle,
  MutedSubtitle,
} from "@/components/core/Titulo";
import { useTranslations } from "next-intl";
import { formattedPrice } from "@/lib/formattedPrice";
import { CircleButton, MainButton } from "@/components/core/Buttons";
const { Text } = Typography;
type Props = {
  productData: CatalogType;
};

export default function ProductCard({ productData }: Props) {
  const t = useTranslations("Ecommerce.catalog.product");

  const discountPrice = (price: number, discount: number) => {
    if (discount > 0) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  const marketPrice = (price: number) => {
    const priceFormula = price * 1.05; // 5% mas
    return formattedPrice(priceFormula);
  };

  function decreaseQty() {}

  return (
    <>
      <GlassCard>
        <Flex vertical gap="small">
          {productData.categories.length > 0 && (
            <CategoriesBreadCrumb
              categories={productData.categories}
              key={productData.sku}
            />
          )}

          <Flex vertical justify="space-between">
            {/* image & basic data */}
            <Flex gap="large" align="center">
              <div>
                <Image
                  alt="Product image"
                  width={150}
                  src="/Logo.jpg"
                  height={100}
                />
              </div>

              <Space direction="vertical" size="small">
                <DefaultTitle level={5} style={{ marginBottom: 0 }}>
                  {productData.generalInfo.productName}
                </DefaultTitle>

                <Row gutter={10}>
                  <Col xxl={8}>
                    <Space wrap>
                      <LabelTitle>{t("generalInfo.brand")}:</LabelTitle>
                      <MutedSubtitle>
                        {productData.generalInfo.brand}
                      </MutedSubtitle>
                    </Space>
                  </Col>

                  <Col xxl={8}>
                    <Space wrap>
                      <LabelTitle>{t("generalInfo.model")}:</LabelTitle>
                      <MutedSubtitle>
                        {productData.generalInfo.model}
                      </MutedSubtitle>
                    </Space>
                  </Col>

                  <Col xxl={8}>
                    <Space wrap>
                      <LabelTitle>{t("generalInfo.sku")}:</LabelTitle>
                      <MutedSubtitle>{productData.sku}</MutedSubtitle>
                    </Space>
                  </Col>
                </Row>

                {productData.marketData.shortDesc && (
                  <Text>{productData.marketData.shortDesc}</Text>
                )}
              </Space>
            </Flex>

            {/* price & availability */}
            <Flex
              justify="space-between"
              align="center"
              style={{ margin: 10 }}
              gap={10}
            >
              <Flex vertical gap={10} style={{ flex: 1 }}>
                <Space
                  direction="vertical"
                  style={{ width: "100%", rowGap: 0 }}
                  align="center"
                >
                  <Text type="secondary">{t("storePrice")}</Text>
                  <Space style={{ width: "100%" }} align="center">
                    {productData.businessData.discount ? (
                      <>
                        <Space
                          wrap
                          size="large"
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            rowGap: 0,
                          }}
                          align="center"
                        >
                          <Text
                            type="secondary"
                            style={{
                              textDecoration: "line-through",
                              fontSize: 20,
                            }}
                          >
                            ${productData.businessData.price}
                          </Text>
                          <Text
                            type="success"
                            className="font-bold"
                            style={{ fontSize: 24 }}
                          >
                            -{productData.businessData.discount}%
                          </Text>
                          <MainTitle>
                            {formattedPrice(
                              discountPrice(
                                productData.businessData.price,
                                productData.businessData.discount
                              )
                            )}
                          </MainTitle>
                        </Space>
                      </>
                    ) : (
                      <MainTitle>
                        {formattedPrice(productData.businessData.price)}
                      </MainTitle>
                    )}
                  </Space>
                </Space>

                <Space
                  direction="vertical"
                  style={{ width: "100%", rowGap: 0 }}
                  align="center"
                  size="small"
                >
                  <Text type="secondary">{t("onlinePrice")}</Text>
                  <MainTitle>
                    {marketPrice(productData.businessData.price)}
                  </MainTitle>
                </Space>
              </Flex>

              <Flex
                wrap
                gap="small"
                justify="center"
                vertical
                align="center"
                className="border"
                style={{ padding: "0.5em", flex: 1 }}
              >
                <Text className="font-bold">{t("availability")}</Text>
                <Flex wrap gap="middle" justify="center">
                  {productData.warehouseData.length > 0 ? (
                    <>
                      {productData.warehouseData.map((item, index) => (
                        <Space key={index}>
                          <Text
                            type={item.stock == 0 ? "danger" : "success"}
                            className="font-bold"
                          >
                            {item.stock}
                          </Text>
                          <Text type="secondary">{item.warehouse}</Text>
                        </Space>
                      ))}
                    </>
                  ) : (
                    <>
                      <Text type="danger" className="font-bold">
                        {t("notAvailable")}
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
            </Flex>

            {/* add to cart */}
            {productData.warehouseData.length > 0 && (
              <Flex gap="large" align="center" justify="center">
                <Space size="middle">
                  <CircleButton onPress={() => decreaseQty()} icon="Minus" />
                  <MainTitle>1</MainTitle>
                  <CircleButton onPress={() => decreaseQty()} icon="Plus" />
                </Space>

                <MainButton onPress={() => decreaseQty()} icon="Cart">
                  {t("addToCart")}
                </MainButton>
              </Flex>
            )}
          </Flex>
        </Flex>
      </GlassCard>
    </>
  );
}
