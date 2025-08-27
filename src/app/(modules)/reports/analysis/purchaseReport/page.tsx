"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Button, Col, Flex, Form, Input, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as XLSX from "xlsx";

type PurchaseType = {
  supplier: string;
  brand: string;
  stock: string;
};

type ApiRow = {
  pmp: number | null;
  rowid: number;
  ref: string;
  label: string;
  barcode: string | null;
  tosell: number | null;
  tobuy: number | null;
  contenido: number | null;
  modelo: string | null;
  catproveedor: string | null;
  marcaproducto: string | null;
  high_end: number | null;
  prdlinea: number | null; // 1 => "SI"
  unitmeasure: string | null;
  uomvalue: number | null; // <- lo usaremos como "pre"
  price_ttc: number | null;
  max: number | null; // suma desiredstock (almacenes relevantes)
  in_transit: number | null; // picking en tránsito último mes
};

type UiRow = {
  id: number;
  referencia: string;
  modelo: string;
  descripcion: string;
  barcode: string | null;
  proveedor: string | null;
  marca: string | null;
  categoria: string; // si no hay, queda vacío
  precio: number;
  pmp: number;
  linea: string; // "SI" | ""
  pre: number | null; // uomvalue
  cedis: number;
  piso: number;
  mercado: number;
  mat: number;
  jir: number;
  tec: number;
  full: number;
  max: number;
  total: number;
  diferencia: number;
  pedidos: number | "Error";
};

function mapToUi(r: ApiRow): UiRow {
  const pre = r.uomvalue ?? null; // “presentación”/unidades por pack
  const totalStock = 0; // si luego agregas stocks por almacén, súmalos aquí
  const total = (r.in_transit ?? 0) + totalStock;
  const max = r.max ?? 0;
  const diferencia = max - total;
  const pedidos = pre && pre !== 0 ? Math.round(diferencia / pre) : "Error";

  return {
    id: r.rowid,
    referencia: r.ref,
    modelo: r.modelo ?? "",
    descripcion: r.label,
    barcode: r.barcode,
    proveedor: r.catproveedor,
    marca: r.marcaproducto,
    categoria: "",
    precio: Number(r.price_ttc ?? 0),
    pmp: Number(r.pmp ?? 0),
    linea: r.prdlinea === 1 ? "SI" : "",
    pre,
    cedis: 0,
    piso: 0,
    mercado: 0,
    mat: 0,
    jir: 0,
    tec: 0,
    full: 0,
    max,
    total,
    diferencia,
    pedidos,
  };
}

export default function PurchaseReportPage() {
  const [form] = Form.useForm<PurchaseType>();
  const [rows, setRows] = useState<UiRow[]>([]);

  const { message } = App.useApp();

  const fetchReport = useMutation({
    mutationFn: async (values: {
      supplier: string | undefined;
      brand: string | undefined;
      stock: string | undefined;
    }) => {
      const qs = new URLSearchParams({
        prov: values.supplier ?? "",
        marca: values.brand ?? "",
        stock: String(values.stock ?? 0),
      });
      const res = await fetch(`/api/reports/purchaseReport?${qs.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("FETCH_FAIL");
      return (await res.json()) as ApiRow[];
    },
    onSuccess: (data) => {
      if (!Array.isArray(data) || data.length === 0) {
        message.open({
          type: "info",
          content: "No hay datos para mostrar",
        });
        setRows([]);
        return;
      }
      console.log(data);

      setRows(data.map(mapToUi));
    },
    onError: (err) => {
      console.error("hubo un error ", err);
      message.open({
        type: "error",
        content: "Hubo un error al cargar datos",
      });
    },
  });

  const columns: DinamicColumnsType[] = useMemo(
    () => [
      { title: "ID", column_id: "id", type: "int", width: 90, align: "center" },
      {
        title: "Referencia",
        column_id: "referencia",
        type: "string",
        width: 140,
      },
      { title: "Modelo", column_id: "modelo", type: "string", width: 140 },
      {
        title: "Producto",
        column_id: "descripcion",
        type: "string",
        width: 260,
      },
      {
        title: "Cod. Barras",
        column_id: "barcode",
        type: "string",
        width: 140,
      },
      {
        title: "Proveedor",
        column_id: "proveedor",
        type: "string",
        width: 160,
      },
      { title: "Marca", column_id: "marca", type: "string", width: 140 },
      {
        title: "Categoría",
        column_id: "categoria",
        type: "string",
        width: 140,
      },
      { title: "Precio Venta", column_id: "precio", type: "price", width: 120 },
      {
        title: "Costo PMP (Sin IVA)",
        column_id: "pmp",
        type: "price",
        decimals: 2,
        width: 120,
      },
      {
        title: "Prod. de Línea",
        column_id: "linea",
        type: "string",
        width: 90,
        align: "center",
      },
      {
        title: "Pre",
        column_id: "pre",
        type: "float",
        decimals: 0,
        width: 90,
        align: "right",
      },
      {
        title: "Cedis",
        column_id: "cedis",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Piso",
        column_id: "piso",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Mercado",
        column_id: "mercado",
        type: "int",
        width: 100,
        align: "right",
      },
      {
        title: "Mat",
        column_id: "mat",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Jir",
        column_id: "jir",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Tec",
        column_id: "tec",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Full",
        column_id: "full",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Max",
        column_id: "max",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Total",
        column_id: "total",
        type: "int",
        width: 90,
        align: "right",
      },
      {
        title: "Diferencia",
        column_id: "diferencia",
        type: "int",
        width: 110,
        align: "right",
      },
      {
        title: "Pedidos",
        column_id: "pedidos",
        type: "string",
        width: 110,
        align: "right",
      },
    ],
    []
  );

  // Descargar el archivo xlsx
  const downloadProcessedFile = () => {
    if (!rows) return;

    const cleanRows = rows.map((item) => ({
      id: item.id,
      pedido: item.pedidos,
      ref: item.referencia,
      modelo: item.modelo,
      producto: item.descripcion,
      barcode: item.barcode,
      proveddor: item.proveedor,
      marca: item.marca,
      categoria: item.categoria,
      precio_venta: item.precio,
      costo_pmp: item.pmp,
      prod_linea: item.linea,
      //pp_qu: item.
    }));

    // xlsx build
    const worksheet = XLSX.utils.json_to_sheet(cleanRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte para compras");

    //headers
    // XLSX.utils.sheet_add_aoa(
    //   worksheet,
    //   [["SKU", "Etiqueta", "Alerta", "Deseado", "Stock", "Almacen", "Precio"]],
    //   { origin: "A1" }
    // );

    /* calculate column width */
    const max_width = cleanRows.reduce(
      (w, r) => Math.max(w, r.id.toString().length),
      10
    );
    worksheet["!cols"] = [{ wch: max_width }];

    const fileName = `reporte_compras.xlsx`;
    XLSX.writeFile(workbook, fileName);
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
              onFinish={(values) => fetchReport.mutate(values)}
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
            <DinamicTable columns={columns} dataSource={rows} />
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
