"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Button, Col, Flex, Form, Input, Row } from "antd";

export default function PurchaseReportPage() {
  const columns: DinamicColumnsType[] = [
    {
      column_id: "rowid",
      title: "ID",
      type: "link",
      width: 100,
      actions: [
        {
          onPress: (record) => {
            console.log("press");
          },
        },
      ],
    },
    {
      column_id: "ref",
      title: "Ref.",
      type: "string",
      width: 100
    },
    {
      column_id: "model",
      title: "Modelo",
      type: "string",
      width: 100
    },
    {
      column_id: "producto",
      title: "Producto",
      type: "string",
      width: 150
    },
    {
      column_id: "barcode",
      title: "Cod. Barras",
      type: "string",
      width: 100
    },
    {
      column_id: "proveedor",
      title: "Proveedor",
      type: "string",
      width: 150
    },
    {
      column_id: "marca",
      title: "Marca",
      type: "string",
      width: 100
    },
    {
      column_id: "categoria",
      title: "Categoría",
      type: "string",
      width: 150
    },
    {
      column_id: "price_ttc",
      title: "Precio venta",
      type: "price",
      width: 100
    },
    {
      column_id: "pmp",
      title: "Costo PMP (sin iva)",
      type: "float",
      decimals: 2,
      width: 100
    },
    {
      column_id: "prdlinea",
      title: "Prod. de línea",
      type: "int",
      width: 100
    },
    {
      column_id: "pp_quality",
      title: "PP Quality",
      type: "int",
      width: 100
    },
    {
      column_id: "pp_sensey",
      title: "PP Sensey",
      type: "int",
      width: 100
    },
    {
      column_id: "pre",
      title: "PRE-REC-CEDIS",
      type: "int",
      width: 100
    },
    {
      column_id: "cedis",
      title: "Almacén",
      type: "int",
      width: 100
    },
    {
      column_id: "piso",
      title: "Piso",
      type: "int",
      width: 100
    },
    {
      column_id: "mercado",
      title: "Mercado",
      type: "int",
      width: 100
    },
    {
      column_id: "mat",
      title: "Matehuala",
      type: "int",
      width: 100
    },
    {
      column_id: "jir",
      title: "JIR",
      type: "int",
      width: 100
    },
    {
      column_id: "tec",
      title: "TEC",
      type: "int",
      width: 100
    },
    {
      column_id: "full",
      title: "FULL",
      type: "int",
      width: 100
    },
    {
      column_id: "garantias",
      title: "Garantias",
      type: "int",
      width: 100
    },
    {
      column_id: "sep_rmc",
      title: "SEP.RMC",
      type: "int",
      width: 100
    },
    {
      column_id: "sep_jir",
      title: "SEP.JIR",
      type: "int",
      width: 100
    },
    {
      column_id: "sep_mj",
      title: "SEP.MJ",
      type: "int",
      width: 100
    },
    {
      column_id: "sep_mat",
      title: "SEP.MAT",
      type: "int",
      width: 100
    },
    {
      column_id: "ermc",
      title: "Exhibición RMC",
      type: "int",
      width: 100
    },
    {
      column_id: "pp_gonher",
      title: "PP Gonher",
      type: "int",
      width: 100
    },
    {
      column_id: "pp_inovaudio",
      title: "PP Inovaudio",
      type: "int",
      width: 100
    },
    {
      column_id: "pp_audyson",
      title: "PP Audyson",
      type: "int",
      width: 100
    },
    {
      column_id: "amazon",
      title: "Amazon",
      type: "int",
      width: 100
    },
    {
      column_id: "rappi",
      title: "Rappi",
      type: "int",
      width: 100
    },
    {
      column_id: "liverpool",
      title: "Liverpool",
      type: "int",
      width: 100
    },
    {
      column_id: "gremates",
      title: "G. Remates",
      type: "int",
      width: 100
    },
    {
      column_id: "copper",
      title: "Coppel",
      type: "int",
      width: 100
    },
    {
      column_id: "pp_lemus",
      title: "PP Lemus",
      type: "int",
      width: 100
    },
    {
      column_id: "controversias",
      title: "Controversias",
      type: "int",
      width: 100
    },
    {
      column_id: "defecto",
      title: "Defecto",
      type: "int",
      width: 100
    },
    {
      column_id: "faltante",
      title: "Faltante",
      type: "int",
      width: 100
    },
    {
      column_id: "shopee",
      title: "Shopee",
      type: "int",
      width: 100
    },
    {
      column_id: "gcalidad",
      title: "G. Calidad",
      type: "int",
      width: 100
    },
    {
      column_id: "gproveedor",
      title: "G. Proveedor",
      type: "int",
      width: 100
    },
    {
      column_id: "grefaccion",
      title: "G. Refacción",
      type: "int",
      width: 100
    },
    {
      column_id: "greparacion",
      title: "G. Reparación",
      type: "int",
      width: 100
    },
    {
      column_id: "gmerma",
      title: "G. Merma",
      type: "int",
      width: 100
    },
    {
      column_id: "status",
      title: "Status",
      type: "string",
      width: 100
    },
    {
      column_id: "marketplaces",
      title: "Marketplaces",
      type: "int",
      width: 120
    },
    {
      column_id: "unitmeasure",
      title: "Uom pedido",
      type: "int",
      width: 100
    },
    {
      column_id: "uomvalue",
      title: "Uom Valor",
      type: "int",
      width: 100
    },
    {
      column_id: "contenido",
      title: "Contenido",
      type: "int",
      width: 100
    },
    {
      column_id: "in_transit",
      title: "En tránsito",
      type: "int",
      width: 100
    },
    {
      column_id: "max",
      title: "Max.",
      type: "int",
      width: 100
    },
    {
      column_id: "stock",
      title: "Tot. Stock",
      type: "int",
      width: 100
    },
    {
      column_id: "pedir",
      title: "Pedir",
      type: "int",
      width: 100
    },
    {
      column_id: "predido2",
      title: "Pedido",
      type: "int",
      width: 100
    },
  ];

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Lista de productos</MainTitle>

          <GlassCard>
            <Form layout="vertical">
              <Row gutter={[20, 20]}>
                <Col xxl={8} xl={6}>
                  <Form.Item label="Proveedor">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Marca">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Adicional">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={"auto"}>
                  <Form.Item>
                    <Button type="primary">Procesar</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </GlassCard>

          <GlassCard>
            <DinamicTable columns={columns} dataSource={[]} />
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
