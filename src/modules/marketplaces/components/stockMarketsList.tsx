"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Checkbox, Col, Flex, Input, Row, Select, Space } from "antd";
import { LabelTitle, Subtitle, TableText } from "@/components/core/Titulo";
import { useMemo, useState } from "react";
import { MarketsIDEnum } from "@/shared/enums/MarketEnum";
import { getEnumOptions } from "@/lib/utils";
import type { GetProp } from "antd";
import { StockMarketType } from "../types/stockMarketsType";

interface StockProps {
  data: StockMarketType[];
}

const toKey = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^\w]+/g, "_") // espacios y símbolos -> _
    .replace(/^_|_$/g, "");

export default function StockMarketsList({ data }: StockProps) {
  function pivotStocks(raw: StockMarketType[]) {
    // 1) catálogo de almacenes (id+nombre)
    const warehouses = Array.from(
      new Map(raw.map((r) => [r.idWarehouse, r.warehouse])).entries()
    )
      .map(([id, name]) => ({ id, name, key: toKey(name) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // 2) pivot por SKU (y producto)
    const bySku = new Map<string, any>();

    for (const r of raw) {
      const rowKey = `${r.idProduct}|${r.sku}`;
      let row = bySku.get(rowKey);
      if (!row) {
        row = { idProduct: r.idProduct, sku: r.sku, label: r.label };
        // inicializa todos los almacenes en 0
        for (const w of warehouses) row[w.key] = 0;
        bySku.set(rowKey, row);
      }
      // suma por si hay varias filas del mismo sku en el mismo almacén
      const wKey = toKey(r.warehouse);
      row[wKey] = (row[wKey] || 0) + r.stock;
    }

    const dataSource = Array.from(bySku.values()).sort((a, b) =>
      a.sku.localeCompare(b.sku)
    );

    return { dataSource, warehouses };
  }

  const baseColumns: DinamicColumnsType[] = [
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
      width: "10%",
    },
    {
      column_id: "label",
      title: "Nombre producto",
      type: "string",
      width: "40%",
    },
  ];

  const { dataSource, warehouses } = pivotStocks(data);

  const warehouseColumns: DinamicColumnsType[] = warehouses.map((w) => ({
    column_id: w.key, // <- la key segura (sin espacios)
    title: w.name, // <- etiqueta visible tal cual el nombre del almacén
    type: "custom",
    align: "center",
    render: (value, record) => {
      return <TableText>{Number(value) > 0 ? value : ""}</TableText>;
    },
  }));

  const columns: DinamicColumnsType[] = [...baseColumns, ...warehouseColumns];

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
    () => filterBySearch(dataSource),
    [dataSource, searchTerm]
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

            {/* <Col xxl={14} xl={12} md={24} sm={24} xs={24}>
              <Flex gap={10} justify="space-between">
                <Space direction="vertical">
                  <LabelTitle>Filtrar por market:</LabelTitle>
                  <Checkbox.Group
                    onChange={onChangeMarket}
                    options={getEnumOptions(MarketsIDEnum)}
                  />
                </Space>
              </Flex>
            </Col> */}
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
