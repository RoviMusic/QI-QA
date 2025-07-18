"use client";
import { Card, Col, Form, Radio, Row, Space, Typography } from "antd";

const { Text } = Typography;

export default function MainFilters() {
  return (
    <>
      <Card>
        <Row>
          <Col>
            <Space direction="vertical">
              <Text className="font-bold">Estatus</Text>
              <Radio.Group
                name="radioStatus"
                defaultValue={"1"}
                options={[
                  { value: "1", label: "Activo" },
                  { value: "0", label: "Pausado" },
                ]}
              />
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
}
