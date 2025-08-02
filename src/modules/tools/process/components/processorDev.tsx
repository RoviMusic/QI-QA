"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { LabelTitle, MainTitle } from "@/components/core/Titulo";
import ItemsList from "@/modules/tools/shared/components/ItemsList";
import { App, Badge, Checkbox, Col, Flex, Input, Row, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import { processService } from "../services/processorService";
import { DataProcessorType, dummyData } from "../types/processorTypes";
import type { GetProp } from "antd";

export type markets = "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";

export default function ProcessorDev() {
  const [dataProcessed, setDataProcessed] = useState<DataProcessorType[]>([]);
  const [dataPending, setDataPending] = useState<DataProcessorType[]>([]);
  const [dataErrors, setDataErrors] = useState<DataProcessorType[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([
    "meli",
    "amazon",
    "wl",
    "cop",
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { notification } = App.useApp();

  useEffect(() => {
    processService
      .getProcesser()
      .then((data) => {
        console.warn(" data fetched:", data);

        // Helper para agregar el market a cada item
        const addMarket = (items: any[] | undefined, market: string) =>
          (items || []).map((item) => ({ ...item, market }));

        const processedData = [
          ...addMarket(data.meli?.processed, "Mercado Libre"),
          ...addMarket(data.amazon?.processed, "Amazon"),
          ...addMarket(data.wl?.processed, "Walmart"),
          ...addMarket(data.cop?.processed, "Coppel"),
        ];
        const pendingData = [
          ...addMarket(data.meli?.pending, "Mercado Libre"),
          ...addMarket(data.amazon?.pending, "Amazon"),
          ...addMarket(data.wl?.pending, "Walmart"),
          ...addMarket(data.cop?.pending, "Coppel"),
        ];
        const errorsData = [
          ...addMarket(data.meli?.error, "Mercado Libre"),
          ...addMarket(data.amazon?.error, "Amazon"),
          ...addMarket(data.wl?.error, "Walmart"),
          ...addMarket(data.cop?.error, "Coppel"),
        ];

        setDataProcessed(processedData);
        setDataPending(pendingData);
        setDataErrors(errorsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        notification.open({
          type: "error",
          message: "Hubo un error",
          description: `No se pudo obtener la información del procesador: ${error.message}`,
        });
      });
  }, []);

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

  const searchFilteredData = useMemo(() => {
    if (!searchTerm.trim()) return dummyData;

    const searchValue = searchTerm.toLowerCase();

    // Helper para filtrar arrays de órdenes por coincidencia en cualquier campo string
    const filterOrders = (orders?: any[]) =>
      (orders || []).filter((order) =>
        Object.values(order).some((val) =>
          String(val).toLowerCase().includes(searchValue)
        )
      );

    return {
      meli: {
        processed: filterOrders(dummyData.meli?.processed),
        pending: filterOrders(dummyData.meli?.pending),
        error: filterOrders(dummyData.meli?.error),
      },
      amazon: {
        processed: filterOrders(dummyData.amazon?.processed),
        pending: filterOrders(dummyData.amazon?.pending),
        error: filterOrders(dummyData.amazon?.error),
      },
      wl: {
        processed: filterOrders(dummyData.wl?.processed),
        pending: filterOrders(dummyData.wl?.pending),
        error: filterOrders(dummyData.wl?.error),
      },
      cop: {
        processed: filterOrders(dummyData.cop?.processed),
        pending: filterOrders(dummyData.cop?.pending),
        error: filterOrders(dummyData.cop?.error),
      },
    };
  }, [searchTerm, dummyData]);

  return (
    <>
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
                    { value: "meli", label: "Mercado Libre" },
                    { value: "amazon", label: "Amazon" },
                    { value: "wl", label: "Walmart" },
                    { value: "cop", label: "Coppel" },
                  ]}
                />
              </Flex>
            </Col>
          </Row>
        </GlassCard>

        <Row gutter={[20, 20]}>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <GlassCard style={{ border: "2px solid #FA312B" }}>
              <ItemsList title="Errores" items={filteredErrors} type="Error" />
            </GlassCard>
          </Col>
          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <GlassCard>
              <ItemsList
                title="Órdenes por procesar"
                items={filteredProcessed}
                type="Processed"
              />
            </GlassCard>
          </Col>
          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <GlassCard>
              <ItemsList
                title="Órdenes sincronizadas"
                items={filteredPending}
                type="Pending"
              />
            </GlassCard>
          </Col>
        </Row>
      </Flex>
    </>
  );
}
