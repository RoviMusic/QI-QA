import { DefaultTitle, LabelTitle, MainTitle, Subtitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { getIcon } from "@/lib/utils";
import { Button, Col, Flex, Input, InputNumber, Row, Space } from "antd";

type DataPickingType = {
  pickingId: string;
  currentStock: number;
  productName: string;
  sku: string;
  upc: string;
  section: string;
  reStock: number;
  user: string;
};

const dataPicking: DataPickingType = {
  pickingId: '1',
  currentStock: 15,
  productName: 'Cejas Diap. Guit. Elec. D/PLAS JIMMYWESS GN-P12(10)',
  sku: '7501232',
  upc: '389328932',
  section: 'A-1-1-D-26',
  reStock: 1,
  user: 'Daniel'
}

export default async function PickingNumberPage({
  params,
}: {
  params: Promise<{ picking: string }>;
}) {
  const { picking } = await params;

  function getPicking() {}

  return (
    <>
      <Container>
        <Row justify="center">
          <Col xl={12} lg={12} md={16} sm={18} xs={24}>
            <LabelTitle>Stock: 15 (0)</LabelTitle>
            <Flex vertical gap={20} align="center">
              <DefaultTitle level={3} style={{textAlign: 'center'}}>
                Cejas Diap. Guit. Elec. D/PLAS JIMMYWESS GN-P12(10)
              </DefaultTitle>

              <MainTitle style={{ margin: 0 }}>SKU: 7501232</MainTitle>
              <MainTitle style={{ margin: 0 }}>UPC: 389328932</MainTitle>

              <Input autoFocus size="large" style={{ fontSize: 24, width: "70%" }} />

              <Subtitle>Seccio: A-1-1-D-26</Subtitle>
              <Subtitle>Re-Stock: 1</Subtitle>

              <div className="bg-red-600 text-white text-4xl p-3.5 rounded-2xl hover:bg-red-500">
                No hay
              </div>

              <Space>
                <Button
                  icon={getIcon("Minus")}
                  style={{ fontSize: 30, height: 50, width: 50 }}
                />
                <InputNumber
                  controls={false}
                  size="large"
                  style={{ height: 50, width: "100px" }}
                  readOnly
                />
                <Button
                  icon={getIcon("Plus")}
                  style={{ fontSize: 30, height: 50, width: 50 }}
                />
              </Space>

              <Space>
                <Button type="default" style={{ fontSize: 30, height: 50 }} disabled>Agregar</Button>
                <Button type="primary" style={{ fontSize: 30, height: 50 }}>Finalizar</Button>
              </Space>

              <Subtitle>Daniel....</Subtitle>
            </Flex>
          </Col>
        </Row>
      </Container>
    </>
  );
}
