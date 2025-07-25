"use client";

import GlassCard from "@/components/core/GlassCard";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { getIcon } from "@/lib/utils";
import { Col, Flex, Row } from "antd";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <>
      <Container>
        <Row
          gutter={[40, 20]}
          justify="center"
          align="middle"
          style={{ height: "100%" }}
        >
          <Col onClick={() => router.push('ecommerce/catalog')}>
            <GlassCard >
              <Flex vertical justify="center" align="center">
                <MainTitle>{getIcon("Store")}</MainTitle>
                <MainTitle>Catálogo</MainTitle>
              </Flex>
            </GlassCard>
          </Col>

          <Col onClick={() => router.push('tools/picking')}>
            <GlassCard>
              <Flex vertical justify="center" align="center">
                <MainTitle>{getIcon("Truck")}</MainTitle>
                <MainTitle>Picking</MainTitle>
              </Flex>
            </GlassCard>
          </Col>
        </Row>
      </Container>
    </>
  );
}
