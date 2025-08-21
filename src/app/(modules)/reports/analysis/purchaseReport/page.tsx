"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Button, Col, Flex, Form, Input, Row, Select } from "antd";
import { useState } from "react";

type PurchaseType = {
  supplier?: string;
  brand?: string;
  stock?: string;
};

export default function PurchaseReportPage() {
  const [data, setData] = useState<any[]>([]);
  const columns: DinamicColumnsType[] = [
    {
      column_id: "rowid",
      title: "ID",
      type: "link",
      width: 100,
      align: "center",
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
      width: 100,
    },
    {
      column_id: "modelo",
      title: "Modelo",
      type: "string",
      width: 100,
    },
    {
      column_id: "label",
      title: "Producto",
      type: "string",
      width: 300,
    },
    {
      column_id: "barcode",
      title: "Cod. Barras",
      type: "string",
      width: 100,
    },
    {
      column_id: "catproveedor",
      title: "Proveedor",
      type: "string",
      width: 150,
    },
    {
      column_id: "marcaproducto",
      title: "Marca",
      type: "string",
      width: 100,
    },
    {
      column_id: "category",
      title: "Categoría",
      type: "string",
      width: 150,
    },
    {
      column_id: "price_ttc",
      title: "Precio venta",
      type: "price",
      width: 100,
    },
    {
      column_id: "pmp",
      title: "Costo PMP (sin iva)",
      type: "price",
      decimals: 2,
      width: 100,
    },
    {
      column_id: "prdlinea",
      title: "Prod. de línea",
      type: "int",
      width: 100,
    },
    {
      column_id: "pp_quality",
      title: "PP Quality",
      type: "int",
      width: 100,
    },
    {
      column_id: "pp_sensey",
      title: "PP Sensey",
      type: "int",
      width: 100,
    },
    {
      column_id: "pre",
      title: "PRE-REC-CEDIS",
      type: "int",
      width: 100,
    },
    {
      column_id: "cedis",
      title: "Almacén",
      type: "int",
      width: 100,
    },
    {
      column_id: "piso",
      title: "Piso",
      type: "int",
      width: 100,
    },
    {
      column_id: "mercado",
      title: "Mercado",
      type: "int",
      width: 100,
    },
    {
      column_id: "mat",
      title: "Matehuala",
      type: "int",
      width: 100,
    },
    {
      column_id: "jir",
      title: "JIR",
      type: "int",
      width: 100,
    },
    {
      column_id: "tec",
      title: "TEC",
      type: "int",
      width: 100,
    },
    {
      column_id: "full",
      title: "FULL",
      type: "int",
      width: 100,
    },
    {
      column_id: "garantias",
      title: "Garantias",
      type: "int",
      width: 100,
    },
    {
      column_id: "sep_rmc",
      title: "SEP.RMC",
      type: "int",
      width: 100,
    },
    {
      column_id: "sep_jir",
      title: "SEP.JIR",
      type: "int",
      width: 100,
    },
    {
      column_id: "sep_mj",
      title: "SEP.MJ",
      type: "int",
      width: 100,
    },
    {
      column_id: "sep_mat",
      title: "SEP.MAT",
      type: "int",
      width: 100,
    },
    {
      column_id: "ermc",
      title: "Exhibición RMC",
      type: "int",
      width: 100,
    },
    {
      column_id: "pp_gonher",
      title: "PP Gonher",
      type: "int",
      width: 100,
    },
    {
      column_id: "pp_inovaudio",
      title: "PP Inovaudio",
      type: "int",
      width: 100,
    },
    {
      column_id: "pp_audyson",
      title: "PP Audyson",
      type: "int",
      width: 100,
    },
    {
      column_id: "amazon",
      title: "Amazon",
      type: "int",
      width: 100,
    },
    {
      column_id: "rappi",
      title: "Rappi",
      type: "int",
      width: 100,
    },
    {
      column_id: "liverpool",
      title: "Liverpool",
      type: "int",
      width: 100,
    },
    {
      column_id: "gremates",
      title: "G. Remates",
      type: "int",
      width: 100,
    },
    {
      column_id: "copper",
      title: "Coppel",
      type: "int",
      width: 100,
    },
    {
      column_id: "pp_lemus",
      title: "PP Lemus",
      type: "int",
      width: 100,
    },
    {
      column_id: "controversias",
      title: "Controversias",
      type: "int",
      width: 100,
    },
    {
      column_id: "defecto",
      title: "Defecto",
      type: "int",
      width: 100,
    },
    {
      column_id: "faltante",
      title: "Faltante",
      type: "int",
      width: 100,
    },
    {
      column_id: "shopee",
      title: "Shopee",
      type: "int",
      width: 100,
    },
    {
      column_id: "gcalidad",
      title: "G. Calidad",
      type: "int",
      width: 100,
    },
    {
      column_id: "gproveedor",
      title: "G. Proveedor",
      type: "int",
      width: 100,
    },
    {
      column_id: "grefaccion",
      title: "G. Refacción",
      type: "int",
      width: 100,
    },
    {
      column_id: "greparacion",
      title: "G. Reparación",
      type: "int",
      width: 100,
    },
    {
      column_id: "gmerma",
      title: "G. Merma",
      type: "int",
      width: 100,
    },
    {
      column_id: "status",
      title: "Status",
      type: "string",
      width: 100,
    },
    {
      column_id: "marketplaces",
      title: "Marketplaces",
      type: "int",
      width: 120,
    },
    {
      column_id: "unitmeasure",
      title: "Uom pedido",
      type: "int",
      width: 100,
    },
    {
      column_id: "uomvalue",
      title: "Uom Valor",
      type: "int",
      width: 100,
    },
    {
      column_id: "contenido",
      title: "Contenido",
      type: "int",
      width: 100,
    },
    {
      column_id: "in_transit",
      title: "En tránsito",
      type: "int",
      width: 100,
    },
    {
      column_id: "max",
      title: "Max.",
      type: "int",
      width: 100,
    },
    {
      column_id: "stock",
      title: "Tot. Stock",
      type: "int",
      width: 100,
    },
    {
      column_id: "pedir",
      title: "Pedir",
      type: "int",
      width: 100,
    },
    {
      column_id: "predido2",
      title: "Pedido",
      type: "int",
      width: 100,
    },
  ];

  const [form] = Form.useForm<PurchaseType>();

  const onFinish = async (values: PurchaseType) => {
    try {
      const params = new URLSearchParams();
      if (values.supplier) params.append("supplier", values.supplier);
      if (values.brand) params.append("brand", values.brand);
      if (values.stock) params.append("stock", values.stock);

      const url = `/api/reports/purchaseReport?${params.toString()}`;
      const response = await fetch(url);
      const result = await response.json();

      console.log("this result ", result);
      
        

      setData(result.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Lista de productos</MainTitle>

          <GlassCard>
            <Form
              layout="vertical"
              name="purchaseReport"
              onFinish={onFinish}
              form={form}
            >
              <Row gutter={[20, 20]}>
                <Col xxl={8} xl={6}>
                  <Form.Item<PurchaseType> label="Proveedor" name="supplier">
                    <Input allowClear />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item<PurchaseType> label="Marca" name="brand">
                    <Input allowClear />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item<PurchaseType> label="Stock" name="stock">
                    <Select
                      allowClear
                      options={[
                        {
                          value: 1,
                          label:
                            "Todos los SKUs con stock en Cedis, RMC, MJ y JIR",
                        },
                        {
                          value: 2,
                          label: "Todos los productos de línea CON y SIN stock",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={"auto"}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Procesar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </GlassCard>

          <GlassCard>
            <DinamicTable columns={columns} dataSource={data} />
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
