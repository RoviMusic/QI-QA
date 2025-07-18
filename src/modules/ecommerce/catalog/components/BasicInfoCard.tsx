import GlassCard from "@/components/core/GlassCard";
import { DefaultTitle, Subtitle } from "@/components/core/Titulo";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Flex, Form, Input, InputNumber, Row } from "antd";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function BasicInfoCard() {
  const t = useTranslations("Ecommerce.catalog.product.generalInfo");
  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t("title")}</Subtitle>

            <Row gutter={[10, 10]}>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("sku")}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("productName")}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Flex align="center" gap={15}>
                  <Form.Item label={t("supplier")} style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Link href={"#"}>
                    {t("goSupplierPage")}{" "}
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </Link>
                </Flex>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("model")}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("brand")}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("manufacturer")}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Flex vertical gap={10}>
              <DefaultTitle>{t("supplierDimensions")}</DefaultTitle>
              <Row gutter={10}>
                <Col xxl={8} lg={20} md={24} sm={24} xs={24}>
                  <Form.Item label={t("dimensions")}>
                    <Row gutter={[5, 10]}>
                      <Col xxl={8} lg={8} md={8} sm={24} xs={24}>
                        <InputNumber
                          addonBefore={t("length")}
                          suffix="cms"
                          controls={false}
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col xxl={8} lg={8} md={8} sm={24} xs={24}>
                        <InputNumber
                          addonBefore={t("width")}
                          suffix="cms"
                          controls={false}
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col xxl={8} lg={8} md={8} sm={24} xs={24}>
                        <InputNumber
                          addonBefore={t("height")}
                          suffix="cms"
                          controls={false}
                          style={{ width: "100%" }}
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>

                <Col xxl={4} lg={4} md={8} sm={24} xs={24}>
                  <Form.Item label={t("weight")}>
                    <InputNumber
                      suffix="kgs."
                      style={{ width: "100%" }}
                      controls={false}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Flex>
          </Flex>
        </GlassCard>
      </Form>
    </>
  );
}
