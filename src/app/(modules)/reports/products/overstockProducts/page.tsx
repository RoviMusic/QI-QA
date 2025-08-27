"use client";
import { MainButton } from "@/components/core/Buttons";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle, TableText } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Flex } from "antd";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function OverstockProductPage() {
  const [data, setData] = useState<any[]>([]);
  const columns: DinamicColumnsType[] = [
    {
      column_id: "ref",
      title: "Ref.",
      type: "string",
      width: 100,
    },
    {
      column_id: "label",
      title: "Etiqueta",
      type: "string",
      width: 250,
    },
    {
      column_id: "seuil_stock_alerte",
      title: "Alerta",
      type: "custom",
      width: 100,
      align: "center",
      render: (value, record) => (
        <>
          {value != null ? (
            <TableText>{value}</TableText>
          ) : (
            <TableText>Sin dato</TableText>
          )}
        </>
      ),
    },
    {
      column_id: "desiredstock",
      title: "Deseado",
      type: "custom",
      width: 100,
      align: "center",
      render: (value, record) => (
        <>
          {value != null ? (
            <TableText>{value}</TableText>
          ) : (
            <TableText>Sin dato</TableText>
          )}
        </>
      ),
    },
    {
      column_id: "stock",
      title: "Stock",
      type: "int",
      width: 100,
    },
    {
      column_id: "entrepot",
      title: "Almacén",
      type: "string",
      width: 100,
      align: "center",
    },
    {
      column_id: "price_ttc",
      title: "Precio",
      type: "price",
      width: 80,
      align: "center",
    },
  ];

  const fetchOverStockData = async () => {
    try {
      //fetch
      const url = `/api/reports/overstockproduct`;
      const response = await fetch(url);
      const result = await response.json();

      console.log("this result ", result);
      setData(result);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOverStockData();
  }, []);

  // Descargar el archivo xlsx
  const downloadProcessedFile = () => {
    if (!data) return;

    const cleanRows = data.map((item) => ({
      sku: item.ref,
      etiqueta: item.label,
      alerta: item.seuil_stock_alerte,
      deseado: item.desiredstock,
      stock: item.stock,
      almacen: item.entrepot,
      precio: item.price_ttc,
    }));

    // xlsx build
    const worksheet = XLSX.utils.json_to_sheet(cleanRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Excedentes");

    //headers
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["SKU", "Etiqueta", "Alerta", "Deseado", "Stock", "Almacen", "Precio"]],
      { origin: "A1" }
    );

    /* calculate column width */
    const max_width = cleanRows.reduce((w, r) => Math.max(w, r.sku.length), 10);
    worksheet["!cols"] = [{ wch: max_width }];

    const fileName = `overstock_products.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <Flex justify="space-between" align="center">
            <MainTitle>Productos con excendente</MainTitle>
            <MainButton onPress={downloadProcessedFile}>
              Descargar Excel
            </MainButton>
          </Flex>

          <GlassCard>
            <DinamicTable columns={columns} dataSource={data} />
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
