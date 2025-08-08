"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { LabelTitle, MainTitle } from "@/components/core/Titulo";
import ItemsList from "@/modules/tools/shared/components/ItemsList";
import { App, Badge, Checkbox, Col, Flex, Input, Row, Space } from "antd";
import { useMemo, useState } from "react";
import { DataProcessorType } from "../types/processorTypes";
import type { GetProp } from "antd";
import LoadingAnimation from "@/components/core/LoadingAnimation";
import { IProcessor, IProcessorErrors, IProcessorPending } from "../types/processorMongoInterfaces";

export type markets = "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";

interface ProcessorDevProps {
  processedData: IProcessor[];
  errorsData: IProcessorErrors[];
  pendingData: IProcessorPending[]
}

export default function ProcessorDev({ processedData, errorsData, pendingData }: ProcessorDevProps) {
  const [dataProcessed, setDataProcessed] = useState<any[]>(processedData);
  const [dataPending, setDataPending] = useState<any[]>(pendingData);
  const [dataErrors, setDataErrors] = useState<any[]>(errorsData);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([
    "meli",
    "amazon",
    "wl",
    "cop",
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { notification } = App.useApp();
  const [loading, setIsLoading] = useState<boolean>(false);

  const marketMap: Record<string, string> = {
    meli: "Mercado Libre",
    amazon: "Amazon",
    wl: "Walmart",
    cop: "Coppel",
  };

  const filterByMarket = (items: DataProcessorType[]) =>
    items.filter((item) => {
      // Busca el valor (meli, amazon, etc) correspondiente al market del item
      return selectedMarkets.some((key) => item.market === marketMap[key]);
    });

  const filteredProcessed = useMemo(
    () => filterByMarket(dataProcessed),
    [dataProcessed, selectedMarkets]
  );
  const filteredPending = useMemo(
    () => filterByMarket(dataPending),
    [dataPending, selectedMarkets]
  );
  const filteredErrors = useMemo(
    () => filterByMarket(dataErrors),
    [dataErrors, selectedMarkets]
  );

  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("Selected markets:", checkedValues);
    if ((checkedValues as string[]).length === 0) {
      setSelectedMarkets(Object.keys(marketMap));
    } else {
      setSelectedMarkets(checkedValues as string[]);
    }
  };

  // Helper para filtrar por término de búsqueda en cualquier campo string
  const filterBySearch = (items: DataProcessorType[]) =>
    !searchTerm.trim()
      ? items
      : items.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

  // Aplica ambos filtros: mercado y búsqueda
  const displayedProcessed = useMemo(
    () => filterBySearch(filteredProcessed),
    [filteredProcessed, searchTerm]
  );
  const displayedPending = useMemo(
    () => filterBySearch(filteredPending),
    [filteredPending, searchTerm]
  );
  const displayedErrors = useMemo(
    () => filterBySearch(filteredErrors),
    [filteredErrors, searchTerm]
  );

  return (
    <>
      <LoadingAnimation isActive={loading}>
        <Flex gap={20} vertical>
          <Flex gap={10} align="center" wrap>
            <MainTitle>Procesador de órdenes</MainTitle>
            <Badge status="success" text="Procesador en funcionamiento" />
          </Flex>

          <GlassCard>
            <Row gutter={[20, 20]} justify="space-between">
              <Col xl={10} lg={12} md={24} sm={24} xs={24}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <LabelTitle>
                    Buscar por órden de compra u órden de venta:{" "}
                  </LabelTitle>
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </Space>
              </Col>

              <Col>
                <Flex vertical>
                  <LabelTitle>Filtrar por:</LabelTitle>

                  <Checkbox.Group
                    onChange={onChange}
                    options={[
                      {
                        value: "meli",
                        label: (
                          <span className="text-[#F2A516]">Mercado Libre</span>
                        ),
                      },
                      {
                        value: "amazon",
                        label: <span className="text-[#232F3E]">Amazon</span>,
                      },
                      {
                        value: "wl",
                        label: <span className="text-[#0071DC]">Walmart</span>,
                      },
                      {
                        value: "cop",
                        label: <span className="text-[#1C42E8]">Coppel</span>,
                      },
                    ]}
                  />
                </Flex>
              </Col>
            </Row>
          </GlassCard>

          <Row gutter={[20, 20]}>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <GlassCard style={{ border: "2px solid #FA312B" }}>
                <ItemsList
                  title="Errores"
                  items={displayedErrors}
                  type="Error"
                />
              </GlassCard>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <GlassCard>
                <ItemsList
                  title="Órdenes por procesar"
                  items={displayedProcessed}
                  type="Processed"
                />
              </GlassCard>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <GlassCard>
                <ItemsList
                  title="Órdenes sincronizadas"
                  items={displayedPending}
                  type="Pending"
                />
              </GlassCard>
            </Col>
          </Row>
        </Flex>
      </LoadingAnimation>
    </>
  );
}
