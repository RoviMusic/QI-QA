import { GlassCard } from "@/components/core/GlassCard";
import { Subtitle } from "@/components/core/Titulo";
import { Col, Flex, Form, Input, Row } from "antd";
import { useTranslations } from "next-intl";

export default function ProductIdentifiersCard() {
    const t = useTranslations("Ecommerce.catalog.product.productIdentifiers");
  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t("title")}</Subtitle>
            <Row gutter={10}>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("upc")}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("serialNumber")}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("mpn")}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("gtin")}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("bpn")}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Flex>
        </GlassCard>
      </Form>
    </>
  );
}
