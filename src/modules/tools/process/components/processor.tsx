"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DefaultTitle, LabelTitle, MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import ItemsList from "@/modules/tools/shared/components/ItemsList";
import { Badge, Col, Flex, Modal, Radio, Row, Space } from "antd";
import dayjs from "dayjs";

export type ListType = {
  _id: string;
  sale_id: string;
  market: string;
  sale_date: Date | null;
  message: string;
  pickingNumber?: number;
};

export type markets = "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";

function getRandomMarketCompact(): markets {
  const markets: markets[] = ["Mercado Libre", "Amazon", "Walmart", "Coppel"];
  return markets[Math.floor(Math.random() * markets.length)];
}

// fake data generator
const getItemsProcessed = (count: number): ListType[] =>
  Array.from({ length: count }, (v, k) => ({
    _id: `${k}`,
    sale_id: Math.ceil(Math.random() * 90000).toString(),
    sale_date: dayjs().toDate(),
    message: `Order processed`,
    pickingNumber: Math.ceil(Math.random() * 90000),
    market: getRandomMarketCompact(),
  }));

const getItemsPending = (count: number): ListType[] =>
  Array.from({ length: count }, (v, k) => ({
    _id: `${k}`,
    sale_id: Math.ceil(Math.random() * 90000).toString(),
    sale_date: dayjs().toDate(),
    message: `Order pending`,
    market: getRandomMarketCompact(),
  }));

const getItemsError = (count: number): ListType[] =>
  Array.from({ length: count }, (v, k) => ({
    _id: `${k}`,
    sale_id: Math.ceil(Math.random() * 90000).toString(),
    sale_date: dayjs().toDate(),
    message:
      " 'MercadoLibreConnector' object has no attribute 'getProductBySku ",
    market: getRandomMarketCompact(),
  }));

const dataProcessed: ListType[] = getItemsProcessed(10);
const dataPending: ListType[] = getItemsPending(5);
const dataErrors: ListType[] = getItemsError(3);

export default function Processor() {
  return (
    <>
      <Flex gap={20} vertical>
        <Flex gap={10} align="center" justify="space-between">
          <Space>
            <MainTitle>Procesador de órdenes</MainTitle>
            <Badge status="success" text="Procesador en funcionamiento" />
          </Space>

          <GlassCard>
            <Flex vertical>
              <LabelTitle>Filtrar por:</LabelTitle>

              <Radio.Group
                options={[
                  { value: "meli", label: "Mercado Libre" },
                  { value: "ama", label: "Amazon" },
                  { value: "wl", label: "Walmart" },
                  { value: "cop", label: "Coppel" },
                ]}
              />
            </Flex>
          </GlassCard>
        </Flex>

        <Row gutter={[20, 20]}>
          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <GlassCard>
              <ItemsList
                title="Órdenes por procesar"
                items={dataProcessed}
                type="Processed"
              />
            </GlassCard>
          </Col>
          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <GlassCard>
              <ItemsList
                title="Órdenes sincronizadas"
                items={dataPending}
                type="Pending"
              />
            </GlassCard>
          </Col>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <GlassCard style={{ border: "2px solid #FA312B" }}>
              <ItemsList
                title="Errores"
                items={dataErrors}
                type="Error"
              />
            </GlassCard>
          </Col>
        </Row>
      </Flex>
    </>
  );
}
