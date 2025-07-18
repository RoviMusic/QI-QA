import GlassCard from "@/components/core/GlassCard";
import { DefaultTitle, Subtitle } from "@/components/core/Titulo";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Segmented,
  Select,
  Tooltip,
} from "antd";
import { useState } from "react";
const { TextArea } = Input;
import type { CheckboxProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

export default function MarketInfoCard() {
    const t = useTranslations("Ecommerce.catalog.product.marketInfo");
  const [checked, setChecked] = useState(false);
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };

  const [value, setValue] = useState<string[]>(["Ava Swift"]);
  const suffix = (
    <>
      <span>
        {value.length} / {3}
      </span>
    </>
  );

  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t("title")}</Subtitle>
            <Row gutter={10}>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("productType")}>
                  <Select
                    defaultValue="physical"
                    options={[
                      { value: "physical", label: t("physical") },
                      { value: "digital", label: t("digital") },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("condition")}>
                  <Select
                    defaultValue="new"
                    options={[
                      { value: "new", label: t("new") },
                      { value: "used", label: t("used") },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("availability")}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Form.Item label={t("warrantyInfo")}>
                  <TextArea />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label={t("featuredProduct")}>
                  <Checkbox
                    checked={checked}
                    onChange={onChange}
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "5px",
                      opacity: 0,
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    style={{ fontSize: 30 }}
                    color={checked ? "#FEB81C" : "#B0B5B7"}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Flex vertical gap={10}>
              <DefaultTitle>{t("roviDimensions")}</DefaultTitle>
              <Row gutter={10}>
                <Col>
                  <Form.Item label={t("dimensions")}>
                    <Segmented
                      options={[
                        {
                          label: <Tooltip title="50x20x120">{t("guitar")}</Tooltip>,
                          value: "guitar",
                        },
                        {
                          label: <Tooltip title="40x20x135">{t("bass")}</Tooltip>,
                          value: "bass",
                        },
                        {
                          label: <Tooltip title="37x20x92">{t("violin")}</Tooltip>,
                          value: "violin",
                        },
                        {
                          label: <Tooltip title="18x14x48">{t("melodica")}</Tooltip>,
                          value: "melodica",
                        },
                        {
                          label: <Tooltip title="24x14x24">{t("littleBox")}</Tooltip>,
                          value: "littleBox",
                        },
                        {
                          label: <Tooltip title="10x10x10">{t("envelope")}</Tooltip>,
                          value: "envelope",
                        },
                        {
                          label: <Tooltip title="45x7x45">{t("patch")}</Tooltip>,
                          value: "patch",
                        },
                        {
                          label: <Tooltip title={t("other")}>{t("other")}</Tooltip>,
                          value: "other",
                        },
                      ]}
                    />
                    {/* <Row gutter={[5, 10]}>
                            <Col xxl={8} lg={8} md={8} sm={24} xs={24}>
                              <InputNumber
                                addonBefore="Largo"
                                suffix="cms"
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Col>
                            <Col xxl={8} lg={8} md={8} sm={24} xs={24}>
                              <InputNumber
                                addonBefore="Ancho"
                                suffix="cms"
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Col>
                            <Col xxl={8} lg={8} md={8} sm={24} xs={24}>
                              <InputNumber
                                addonBefore="Alto"
                                suffix="cms"
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Col>
                          </Row> */}
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

            <Flex vertical gap={10}>
              <DefaultTitle>{t("specs")}</DefaultTitle>
              <Form.List name="specs">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={15}>
                        <Col xxl={4} xl={4} lg={4} md={6} sm={24} xs={24}>
                          <Form.Item
                            {...restField}
                            name={[name, "type"]}
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Select
                              placeholder={t("type")}
                              options={[
                                {
                                  value: "spec",
                                  label: t("spec"),
                                },
                                { value: "att", label: t("attribute") },
                              ]}
                            />
                          </Form.Item>
                        </Col>

                        <Col xxl={4} xl={6} lg={10} md={6} sm={24} xs={24}>
                          <Form.Item
                            {...restField}
                            name={[name, "title"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing last name",
                              },
                            ]}
                          >
                            <Input placeholder={t("titleSpec")} />
                          </Form.Item>
                        </Col>
                        <Col xxl={12} xl={12} lg={8} md={10} sm={20} xs={20}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                          >
                            <TextArea placeholder={t("description")} />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Tooltip title={t("remove")}>
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
                        {t("addSpec")}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Flex>

            <Flex vertical gap={10}>
              <DefaultTitle>{t("variants")}</DefaultTitle>
              <Form.List name="variante">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={15}>
                        <Col xxl={4} xl={8} lg={8} md={10} sm={20} xs={20}>
                          <Form.Item
                            {...restField}
                            name={[name, "key"]}
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Input placeholder={t("variantName")} />
                          </Form.Item>
                        </Col>

                        <Col xxl={4} xl={8} lg={8} md={10} sm={20} xs={20}>
                          <Form.Item
                            {...restField}
                            name={[name, "value"]}
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Input placeholder={t("value")} />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Tooltip title={t("remove")}>
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
                        {t("addVariant")}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Flex>

            <Flex vertical gap={10}>
              <DefaultTitle>{t("relations")}</DefaultTitle>
              <Row gutter={10}>
                <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                  <Form.Item label={t("relatedProducts")}>
                    <Select
                      mode="multiple"
                      maxCount={5}
                      value={value}
                      style={{ width: "100%" }}
                      onChange={setValue}
                      suffixIcon={suffix}
                      placeholder="Please select"
                      options={[
                        { value: "Ava Swift", label: "Ava Swift" },
                        { value: "Cole Reed", label: "Cole Reed" },
                        { value: "Mia Blake", label: "Mia Blake" },
                        { value: "Jake Stone", label: "Jake Stone" },
                        { value: "Lily Lane", label: "Lily Lane" },
                        { value: "Ryan Chase", label: "Ryan Chase" },
                        { value: "Zoe Fox", label: "Zoe Fox" },
                        { value: "Alex Grey", label: "Alex Grey" },
                        { value: "Elle Blair", label: "Elle Blair" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                  <Form.Item label={t("alternativeProducts")}>
                    <Select
                      mode="multiple"
                      maxCount={5}
                      value={value}
                      style={{ width: "100%" }}
                      onChange={setValue}
                      suffixIcon={suffix}
                      placeholder="Please select"
                      options={[
                        { value: "Ava Swift", label: "Ava Swift" },
                        { value: "Cole Reed", label: "Cole Reed" },
                        { value: "Mia Blake", label: "Mia Blake" },
                        { value: "Jake Stone", label: "Jake Stone" },
                        { value: "Lily Lane", label: "Lily Lane" },
                        { value: "Ryan Chase", label: "Ryan Chase" },
                        { value: "Zoe Fox", label: "Zoe Fox" },
                        { value: "Alex Grey", label: "Alex Grey" },
                        { value: "Elle Blair", label: "Elle Blair" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                  <Form.Item label={t("replacementProducts")}>
                    <Select
                      mode="multiple"
                      maxCount={5}
                      value={value}
                      style={{ width: "100%" }}
                      onChange={setValue}
                      suffixIcon={suffix}
                      placeholder="Please select"
                      options={[
                        { value: "Ava Swift", label: "Ava Swift" },
                        { value: "Cole Reed", label: "Cole Reed" },
                        { value: "Mia Blake", label: "Mia Blake" },
                        { value: "Jake Stone", label: "Jake Stone" },
                        { value: "Lily Lane", label: "Lily Lane" },
                        { value: "Ryan Chase", label: "Ryan Chase" },
                        { value: "Zoe Fox", label: "Zoe Fox" },
                        { value: "Alex Grey", label: "Alex Grey" },
                        { value: "Elle Blair", label: "Elle Blair" },
                      ]}
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
