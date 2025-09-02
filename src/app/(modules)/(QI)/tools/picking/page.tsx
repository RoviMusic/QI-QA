"use client";
import { LargeButton } from "@/components/core/Buttons";
import Container from "@/components/layout/Container";
import { Col, Row, Space } from "antd";
import { useRouter } from "next/navigation";

type PickingType = {
  id: string;
  label: string;
  pendingPickings: number;
};

const pickings: PickingType[] = [
  { label: "JIR", pendingPickings: 0, id: "jir" },
  { label: "MERCADO", pendingPickings: 0, id: "mercado" },
  { label: "PISO", pendingPickings: 0, id: "piso" },
  { label: "MERCADO LIBRE", pendingPickings: 0, id: "ml" },
  { label: "FULL", pendingPickings: 0, id: "full" },
];

export default function PickingPage() {
  const router = useRouter();
  const onc = () => {};

  return (
    <>
      <Container>
        <Row gutter={[40, 40]}>
          {pickings.map((pk, index) => (
            <Col xl={8} key={index}>
              <LargeButton
                onPress={() => router.push(`/tools/picking/${pk.id}`)}
                key={index}
              >
                <Space direction="vertical" size="small">
                  <span className="text-3xl">{pk.label}</span>

                  <span style={{ fontSize: 16 }}>
                    Pickings pendientes {pk.pendingPickings}
                  </span>
                </Space>
              </LargeButton>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
