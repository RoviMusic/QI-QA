"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Col, Flex, InputNumber, Row } from "antd";
import { use } from "react";
import { dataComparision, dataDetalles } from "../../dataDummy";
import { DefaultTitle, TableText } from "@/components/core/Titulo";

export default function ComparisionPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = use(params);

  const columnsComparision: DinamicColumnsType[] = [
    {
      column_id: "precio",
      title: "Precio",
      type: "custom",
      align: "center",
      render: (value, record) => (
        <InputNumber value={value} controls={false} style={{ width: "100%" }} />
      ),
    },
    {
      column_id: "margen",
      title: "Margen",
      type: "custom",
      align: "center",
      render: (value, record) => <TableText>{value}%</TableText>,
    },
    {
      column_id: "ganancia",
      title: "Ganancia",
      type: "price",
      align: "center",
    },
    {
      column_id: "ingreso",
      title: "Ingreso",
      type: "price",
      align: "center",
    },
    {
      column_id: "actual",
      title: "Actual",
      type: "price",
      align: "center",
    },
    {
      column_id: "minimo",
      title: "Mínimo",
      type: "price",
      align: "center",
    },
    {
      column_id: "ideal",
      title: "Ideal",
      type: "price",
      align: "center",
    },
    {
      column_id: "cantidad",
      title: "Cantidad",
      type: "int",
    },
    {
      column_id: "stock",
      title: "Stock",
      type: "int",
    },
    {
      column_id: "id",
      title: "ID",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            console.log("idk");
          },
        },
      ],
    },
  ];

  return (
    <>
      <Container>
        <Row gutter={[20, 20]}>
          {dataComparision.map((item) => (
            <Col xxl={12} key={item.id}>
              <GlassCard>
                <Flex vertical gap={20}>
                  <Flex style={{backgroundColor: ''}}>
                    <DefaultTitle>{item.title.toUpperCase()}</DefaultTitle>
                  </Flex>
                  <DinamicTable
                    columns={columnsComparision}
                    dataSource={item.data}
                    hasPagination={false}
                  />
                </Flex>
              </GlassCard>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
