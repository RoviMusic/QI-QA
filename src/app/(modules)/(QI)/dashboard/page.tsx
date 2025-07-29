"use client";

import {GlassCard, GlassCardHoverable} from "@/components/core/GlassCard";
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
          <Col xxl={8} xl={8}>
            <GlassCardHoverable onPress={() => router.push('tools/syncprocess')}>
              <Flex vertical justify="center" align="center">
                <MainTitle>{getIcon("Rotate")}</MainTitle>
                <MainTitle>Sincronizador y Procesador</MainTitle>
              </Flex>
            </GlassCardHoverable>
          </Col>

          <Col xxl={8} xl={8}>
            <GlassCardHoverable onPress={() => router.push('tools/picking')}>
              <Flex vertical justify="center" align="center">
                <MainTitle>{getIcon("Truck")}</MainTitle>
                <MainTitle>Fullfilment</MainTitle>
              </Flex>
            </GlassCardHoverable>
          </Col>
        </Row>
      </Container>
    </>
  );
}
