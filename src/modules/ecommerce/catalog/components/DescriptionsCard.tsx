import { GlassCard } from "@/components/core/GlassCard";
import { Subtitle } from "@/components/core/Titulo";
import { Col, Flex, Form, Input, Row } from "antd";
import { useTranslations } from "next-intl";

const { TextArea } = Input;

export default function DescriptionsCard() {
    const t = useTranslations("Ecommerce.catalog.product.descriptions");
  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t("title")}</Subtitle>
            <Row gutter={10}>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label={t("detailedDesc")}>
                  <TextArea />
                </Form.Item>
              </Col>

              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label={t("shortDesc")}>
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Flex>
        </GlassCard>
      </Form>
    </>
  );
}
