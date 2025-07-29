import { GlassCard } from "@/components/core/GlassCard";
import { Subtitle } from "@/components/core/Titulo";
import { Col, Flex, Form, Input, Row } from "antd";
import { useTranslations } from "next-intl";

export default function TaxInfoCard() {
     const t = useTranslations("Ecommerce.catalog.product.taxInfo");
  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t("title")}</Subtitle>
            <Row gutter={10}>
              <Col xxl={8} xl={6} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("satCode")}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4} xl={6} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("taxClass")}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4} xl={4} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("ivaPercentage")}>
                  <Input value={16} suffix="%" />
                </Form.Item>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("taxProviderCode")}>
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
