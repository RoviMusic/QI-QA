"use client";
import { Anchor, Button, Col, Flex, Form, Row } from "antd";
import { useState } from "react";
import { GlassCard } from "@/components/core/GlassCard";
import { useOnWindowResize } from "@/shared/hooks/useOnWindowResize";
import BasicInfoCard from "./BasicInfoCard";
import DescriptionsCard from "./DescriptionsCard";
import ImagesInfoCard from "./ImagesInfoCard";
import ProductIdentifiersCard from "./ProductIdentifiersCard";
import MarketInfoCard from "./MarketsInfoCard";
import SeoInfoCard from "./SeoInfoCard";
import TaxInfoCard from "./TaxInfoCard";
import CustomsInfoCard from "./CustomsInfoCard";
import { useTranslations } from "next-intl";

export default function ProductForm() {
  const t = useTranslations("Ecommerce.catalog.product");
  const [stepDirection, setStepDirection] = useState<"vertical" | "horizontal">(
    "vertical"
  );

  useOnWindowResize(() => {
    if (window.innerWidth < 1200) {
      setStepDirection("horizontal");
    } else {
      setStepDirection("vertical");
    }
  });

  return (
    <>
      <Row gutter={[10, 15]}>
        <Col xxl={4} xl={4} lg={24} md={24} sm={24} xs={24}>
          <GlassCard
            style={{ overflowX: "auto", position: "sticky", top: "15px" }}
          >
            <Anchor
              direction={stepDirection}
              items={[
                {
                  title: t("generalInfo.title"),
                  key: "general",
                  href: "#generalInfo",
                },
                {
                  title: t("descriptions.title"),
                  key: "desc",
                  href: "#descriptions",
                },
                { title: t("images.title"), key: "images", href: "#images" },
                {
                  title: t("productIdentifiers.title"),
                  key: "productIdent",
                  href: "#identifiers",
                },
                {
                  title: t("marketInfo.title"),
                  key: "markets",
                  href: "#markets",
                },
                { title: t("seoInfo.title"), key: "seo", href: "#seo" },
                { title: t("taxInfo.title"), key: "tax", href: "#tax" },
                {
                  title: t("customsInfo.title"),
                  key: "customs",
                  href: "#customs",
                },
              ]}
            />
            <Flex justify="end" style={{marginTop: '16px'}}>
              <Button type="primary">Guardar</Button>
            </Flex>
          </GlassCard>
        </Col>
        <Col xxl={20} xl={20} lg={24} md={24} sm={24} xs={24}>
          <Form.Provider>
            <Flex vertical gap={20}>
              <div id="generalInfo">
                <BasicInfoCard />
              </div>
              <div id="descriptions">
                <DescriptionsCard />
              </div>
              <div id="images">
                <ImagesInfoCard />
              </div>
              <div id="identifiers">
                <ProductIdentifiersCard />
              </div>
              <div id="markets">
                <MarketInfoCard />
              </div>
              <div id="seo">
                <SeoInfoCard />
              </div>
              <div id="tax">
                <TaxInfoCard />
              </div>
              <div id="customs">
                <CustomsInfoCard />
              </div>
            </Flex>
          </Form.Provider>
        </Col>
      </Row>
    </>
  );
}
