"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Flex } from "antd";
import { useState, useEffect } from "react";

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
      column_id: "etiqueta",
      title: "Etiqueta",
      type: "string",
      width: 200,
    },
    {
      column_id: "alerta",
      title: "Alerta",
      type: "int",
      width: 100,
    },
    {
      column_id: "deseado",
      title: "Deseado",
      type: "int",
      width: 100,
    },
    {
      column_id: "stock",
      title: "Stock",
      type: "int",
      width: 100,
    },
    {
      column_id: "almacen",
      title: "Almacén",
      type: "string",
      width: 100,
    },
    {
      column_id: "precio",
      title: "Precio",
      type: "price",
      width: 100,
    },
  ];

  const fetchOverStockData = async () => {
    try {
      //fetch
      const url = `/api/reports/overstockproduct`;
      const response = await fetch(url);
      const result = await response.json();

      console.log("this result ", result);

      if (result.success) {
        const formattedData = result.data.map((item: any) => ({
          ref: item.ref,
          label: item.label,
          seuil_stock_alerte: item.seuil_stock_alerte,
          desiredstock: item.desiredstock,
          stock: item.stock,
          entrepot: item.entrepot,
          price_ttc: item.price_ttc,
        }));

        setData(result);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOverStockData();
  }, []);

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Productos con excendente</MainTitle>

          <GlassCard>
            <DinamicTable columns={columns} dataSource={data} />
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
