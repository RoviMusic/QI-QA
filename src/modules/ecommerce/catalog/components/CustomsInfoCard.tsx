import { GlassCard } from "@/components/core/GlassCard";
import { DefaultTitle, Subtitle } from "@/components/core/Titulo";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Flex, Form, Input, Row, Tooltip } from "antd";
import { useTranslations } from "next-intl";

export default function CustomsInfoCard() {
     const t = useTranslations("Ecommerce.catalog.product.customsInfo");
  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t('title')}</Subtitle>
            <Row gutter={10}>
              <Col xxl={4} xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item label={t('countryOrigin')}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Flex vertical gap={10}>
              <DefaultTitle>{t('hsCodes')}</DefaultTitle>
              <Form.List name="aduana">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={15} key={key}>
                        <Col xxl={4} xl={8} lg={8} md={10} sm={24} xs={24}>
                          <Form.Item
                            {...restField}
                            name={[name, "country"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing first name",
                              },
                            ]}
                          >
                            <Input placeholder={t('destinationCountry')} />
                          </Form.Item>
                        </Col>

                        <Col xxl={4} xl={8} lg={8} md={10} sm={20} xs={20}>
                          <Form.Item
                            {...restField}
                            name={[name, "hscode"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing last name",
                              },
                            ]}
                          >
                            <Input placeholder={t('hsCode')} />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Tooltip title={t('remove')}>
                            <Button
                              onClick={() => remove(name)}
                              type="dashed"
                              shape="circle"
                              icon={<FontAwesomeIcon icon={faMinus} />}
                            />
                          </Tooltip>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<FontAwesomeIcon icon={faPlus} />}
                      >
                        {t('addCode')}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Flex>
          </Flex>
        </GlassCard>
      </Form>
    </>
  );
}
