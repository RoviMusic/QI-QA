"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Checkbox, Col, Flex, Input, Row, Select, Space } from "antd";
import { LabelTitle, Subtitle } from "@/components/core/Titulo";
import { useMemo, useState } from "react";
import { MarketsIDEnum } from "@/shared/enums/MarketEnum";
import { getEnumOptions } from "@/lib/utils";
import type { GetProp } from "antd";
import { StockMarketType } from "../types/stockMarketsType";

interface StockProps {
  data: StockMarketType[];
}

export default function StockMarketsList({ data }: StockProps) {
  const columns: DinamicColumnsType[] = [
    {
      column_id: "sku",
      title: "SKU",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            console.log("Order details:", record);
            if (record.idProduct) {
              window.open(
                `${process.env.NEXT_PUBLIC_DOLIBARR_PRODUCT_CARD}id=${record.idProduct}`,
                "_blank"
              );
            }
          },
        },
      ],
      width: "20%",
    },
    {
      column_id: "stock",
      title: "Cantidad",
      type: "int",
      width: "10%",
    },
    {
      column_id: "label",
      title: "Nombre producto",
      type: "string",
      width: "50%",
    },
    {
      column_id: "warehouse",
      title: "Market",
      type: "string",
    },
  ];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMarkets, setSelectedMarkets] = useState<number[]>(
    Object.values(MarketsIDEnum).filter((v) => typeof v === "number")
  );

  const filterByMarket = (items: StockMarketType[]) =>
    items.filter((item) => {
      // Busca el valor (meli, amazon, etc) correspondiente al market del item
      return selectedMarkets.some((key) => item.idWarehouse === key);
    });

  const filterMarket = useMemo(
    () => filterByMarket(data),
    [data, selectedMarkets]
  );

  const filterBySearch = (items: any[]) =>
    !searchTerm.trim()
      ? items
      : items.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

  // Aplica ambos filtros: market y búsqueda
  const displayedData = useMemo(
    () => filterBySearch(filterMarket),
    [filterMarket, searchTerm]
  );

  const onChangeMarket: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    if (checkedValues.length === 0) {
      setSelectedMarkets(
        Object.values(MarketsIDEnum).filter((v) => typeof v === "number")
      );
    } else {
      setSelectedMarkets(checkedValues as number[]);
    }
  };

  return (
    <>
      <Flex vertical gap={20}>
        <GlassCard>
          <Row gutter={[20, 20]} justify="space-between">
            <Col xl={10} lg={12} md={24} sm={24} xs={24}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <LabelTitle>Buscar </LabelTitle>
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
              </Space>
            </Col>

            <Col xxl={14} xl={12} md={24} sm={24} xs={24}>
              <Flex gap={10} justify="space-between">
                <Space direction="vertical">
                  <LabelTitle>Filtrar por market:</LabelTitle>
                  <Checkbox.Group
                    onChange={onChangeMarket}
                    options={getEnumOptions(MarketsIDEnum)}
                  />
                </Space>
              </Flex>
            </Col>
          </Row>
        </GlassCard>
        <Row justify="center">
          <Col xxl={20} xl={24}>
            <GlassCard>
              <DinamicTable
                columns={columns}
                dataSource={displayedData}
                hasPagination={false}
              />
            </GlassCard>
          </Col>
        </Row>
      </Flex>
    </>
  );
}
