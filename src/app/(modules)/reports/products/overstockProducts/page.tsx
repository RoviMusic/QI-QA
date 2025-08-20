import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Flex } from "antd";

export default function OverstockProductPage() {
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
      width: 200
    },
    {
      column_id: "alerta",
      title: "Alerta",
      type: "int",
      width: 100
    },
    {
      column_id: "deseado",
      title: "Deseado",
      type: "int",
      width: 100
    },
    {
      column_id: "stock",
      title: "Stock",
      type: "int",
      width: 100
    },
    {
      column_id: "almacen",
      title: "Almacén",
      type: "string",
      width: 100
    },
    {
      column_id: "precio",
      title: "Precio",
      type: "price",
      width: 100
    },
  ];

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Productos con excendente</MainTitle>

          <GlassCard>
            <DinamicTable columns={columns} dataSource={[]} />
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
