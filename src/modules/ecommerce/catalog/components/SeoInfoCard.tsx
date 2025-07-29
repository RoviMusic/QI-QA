import { GlassCard } from "@/components/core/GlassCard";
import { Subtitle } from "@/components/core/Titulo";
import { Col, Flex, Form, Input, Row } from "antd";
import { useTranslations } from "next-intl";

export default function SeoInfoCard() {
    const t = useTranslations("Ecommerce.catalog.product.seoInfo");
  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t("title")}</Subtitle>
            <Row gutter={10}>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label={t("keyWords")}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label={t("metaTag")}>
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
