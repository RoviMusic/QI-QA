'use client'
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Col, Row, Tag } from "antd";
import { useRouter } from "next/navigation";

interface ProductsProps {
  list: any;
}

export default function ProductsList({ list }: ProductsProps) {
  const router = useRouter();
  const columnsCompetition: DinamicColumnsType[] = [
    {
      column_id: "sku",
      title: "ID",
      type: "string",
      //width: 200,
    },
    {
      column_id: "label",
      title: "Título",
      type: "string",
      //width: 500,
    },
    {
      column_id: "estatus",
      title: "Estatus",
      type: "custom",
      align: "center",
      width: 100,
      render: (value, record) => (
        <>
          <Tag color={record.estatus == "Activo" ? "success" : "error"}>
            {value}
          </Tag>
        </>
      ),
    },
    {
      column_id: "ventas",
      title: "Ventas",
      type: "int",
      width: "10%",
    },
    {
      column_id: "filtros",
      title: "Filtros",
      type: "actions",
      align: "center",
      width: 80,
      actions: [
        {
          onPress: (record) => {
            router.push(`/tools/competition/filter/${record.sku}`);
          },
          tooltip: "Filtros",
          icon: "Filter",
        },
      ],
      //width: 80,
    },
    {
      column_id: "comparar",
      title: "Comparar",
      type: "actions",
      align: "center",

      actions: [
        {
          onPress: (record) => {
            router.push(`/tools/competition/comparison/${record.sku}`);
          },
          tooltip: "Comparar",
          icon: "People-Arrows",
        },
      ],
      width: 100,
    },
  ];

  return (
    <>
      <Row justify="center">
        <Col xxl={24}>
          <GlassCard>
            <DinamicTable
              columns={columnsCompetition}
              dataSource={[]}
              hasPagination={false}
            />
          </GlassCard>
        </Col>
      </Row>
    </>
  );
}
