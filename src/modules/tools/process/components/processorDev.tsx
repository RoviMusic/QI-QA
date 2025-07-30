"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DefaultTitle, LabelTitle, MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import ItemsList from "@/modules/tools/shared/components/ItemsList";
import { Badge, Col, Flex, Modal, Radio, Row, Space } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { processService } from "../services/processorService";
import { DataProcessorType } from "../types/processorTypes";

export type markets = "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";

export default function ProcessorDev() {
  const [dataProcessed, setDataProcessed] = useState<DataProcessorType[]>([]);
  const [dataPending, setDataPending] = useState<DataProcessorType[]>([]);
  const [dataErrors, setDataErrors] = useState<DataProcessorType[]>([]);

  useEffect(() => {
    processService
      .getProcesser()
      .then((data) => {
        console.warn(" data fetched:", data.meli);
        setDataProcessed(data.meli.processed);
        setDataPending(data.meli.pending);
        setDataErrors(data.meli.error);
      })
      .catch((error) => {
        console.error("Error fetching fullfilment data:", error);
      });
  }, []);

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
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <GlassCard style={{ border: "2px solid #FA312B" }}>
              <ItemsList title="Errores" items={dataErrors} type="Error" />
            </GlassCard>
          </Col>
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
        </Row>
      </Flex>
    </>
  );
}
