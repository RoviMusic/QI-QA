"use client";
import GlassCard from "@/components/core/GlassCard";
import { MainTitle } from "@/components/core/Titulo";
import { Col, Flex, Form, Input, Row, Space } from "antd";
import { useTranslations } from "next-intl";

export default function CreateSupplierPage() {
  const t = useTranslations("Ecommerce.catalog.supplier");
  return (
    <>
      <Flex vertical gap={30}>
        <Space direction="vertical">
          <MainTitle>{t("createTitle")}</MainTitle>
        </Space>

        <GlassCard>
          <Form layout="vertical">
            <Row gutter={[10, 15]}>
              <Col xxl={8}>
                <Form.Item label="Nombre">
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={8}>
                <Form.Item label="Nombre">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </GlassCard>
      </Flex>
    </>
  );
}
