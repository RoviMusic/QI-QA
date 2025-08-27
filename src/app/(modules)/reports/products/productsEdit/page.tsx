"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Button, Col, Flex, Form, Input, Row, Select, Space } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import LoadingAnimation from "@/components/core/LoadingAnimation";

const ENDPOINTS = {
  products: `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/products`,
  refProv: `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/ref_prov`,
  stockAlerte: `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/stock_alerte`,
  desiredStock: `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/desaire_stock`,
  editProduct: `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/edit_product`,
};

const ENTRE: Record<string, number> = {
  CE: 1, // CEDIS / almacén
  PI: 2, // Piso
  MJ: 3, // Mercado
  JI: 10, // JIR
  TEC: 49, // TEC
  MA: 4, // Matehuala
  FU: 16, // Full
};

type ProductRow = {
  rowid: number;
  ref: string;
  label: string;
  barcode: string | null;

  // extrafields
  criteriosinlimite: number | null;
  prdlinea: number | null;
  high_end: number | null;
  contenido: number | null;
  contenido_picking: number | null;
  etiquetas: number | null;
  area: string | null;
  pasillo: string | null;
  estante: string | null;
  columna: string | null;
  posicion: string | null;
  catproveedor: string | null;
  marcaproducto: string | null;

  // status
  tosell: number | null;
  tobuy: number | null;

  // calculados (se cargan por fila)
  ref_prov?: string;
  min?: Partial<Record<keyof typeof ENTRE, string>>; // -CE, -PI, ...
  max?: Partial<Record<keyof typeof ENTRE, string>>; // +CE, +PI, ...
};

async function fetchText(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch fail ${url}`);
  return r.text();
}

async function enrichRow(p: ProductRow): Promise<ProductRow> {
  // Ref proveedor + min/max de cada entrepôt (en paralelo)
  const [refProv, ...stocks] = await Promise.all<string>([
    fetchText(`${ENDPOINTS.refProv}?rowid=${p.rowid}`),
    fetchText(
      `${ENDPOINTS.stockAlerte}?fk_product=${p.rowid}&entrepot=${ENTRE.CE}`
    ),
    fetchText(
      `${ENDPOINTS.desiredStock}?fk_product=${p.rowid}&entrepot=${ENTRE.CE}`
    ),
    fetchText(
      `${ENDPOINTS.stockAlerte}?fk_product=${p.rowid}&entrepot=${ENTRE.PI}`
    ),
    fetchText(
      `${ENDPOINTS.desiredStock}?fk_product=${p.rowid}&entrepot=${ENTRE.PI}`
    ),
    fetchText(
      `${ENDPOINTS.stockAlerte}?fk_product=${p.rowid}&entrepot=${ENTRE.MJ}`
    ),
    fetchText(
      `${ENDPOINTS.desiredStock}?fk_product=${p.rowid}&entrepot=${ENTRE.MJ}`
    ),
    fetchText(
      `${ENDPOINTS.stockAlerte}?fk_product=${p.rowid}&entrepot=${ENTRE.JI}`
    ),
    fetchText(
      `${ENDPOINTS.desiredStock}?fk_product=${p.rowid}&entrepot=${ENTRE.JI}`
    ),
    fetchText(
      `${ENDPOINTS.stockAlerte}?fk_product=${p.rowid}&entrepot=${ENTRE.TEC}`
    ),
    fetchText(
      `${ENDPOINTS.desiredStock}?fk_product=${p.rowid}&entrepot=${ENTRE.TEC}`
    ),
    fetchText(
      `${ENDPOINTS.stockAlerte}?fk_product=${p.rowid}&entrepot=${ENTRE.MA}`
    ),
    fetchText(
      `${ENDPOINTS.desiredStock}?fk_product=${p.rowid}&entrepot=${ENTRE.MA}`
    ),
    fetchText(
      `${ENDPOINTS.stockAlerte}?fk_product=${p.rowid}&entrepot=${ENTRE.FU}`
    ),
    fetchText(
      `${ENDPOINTS.desiredStock}?fk_product=${p.rowid}&entrepot=${ENTRE.FU}`
    ),
  ]);

  const clean = (s: string) => s.replace(/^"|"$/g, "").trim();

  const [
    mCE,
    dCE,
    mPI,
    dPI,
    mMJ,
    dMJ,
    mJI,
    dJI,
    mTEC,
    dTEC,
    mMA,
    dMA,
    mFU,
    dFU,
  ] = stocks.map(clean);

  return {
    ...p,
    ref_prov: clean(refProv),
    min: { CE: mCE, PI: mPI, MJ: mMJ, JI: mJI, TEC: mTEC, MA: mMA, FU: mFU },
    max: { CE: dCE, PI: dPI, MJ: dMJ, JI: dJI, TEC: dTEC, MA: dMA, FU: dFU },
  };
}

// Concurrencia limitada para no saturar el servidor/APIs
async function enrichMany(base: ProductRow[], concurrency = 8) {
  const out: ProductRow[] = Array(base.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= base.length) break;
      const p = base[idx];
      try {
        out[idx] = await enrichRow(p);
      } catch {
        out[idx] = p;
      }
    }
  }
  await Promise.all(new Array(concurrency).fill(0).map(worker));
  return out;
}

const initialFilters = {
  ref: "",
  label: "",
  proveedor: "",
  marca: "",
  tipo: "",
  area: "",
  pasillo: "",
  estante: "",
  columna: "",
  posicion: "",
};

export default function ProductsEditionPage() {
  const [form] = Form.useForm();
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loadingRow, setLoadingRow] = useState<number | null>(null);
  const [enriching, setEnriching] = useState(false);

  const { message } = App.useApp();

  const loadProducts = useMutation({
    mutationFn: async (filters: typeof initialFilters) => {
      console.log("hi ", filters);
      const qs = new URLSearchParams(filters as any).toString();
      const res = await fetch(`${ENDPOINTS.products}?${qs}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("FETCH_PRODUCTS");
      const base: ProductRow[] = await res.json();
      // Enriquecemos con límite de concurrencia
      setEnriching(true);
      const enriched = await enrichMany(base, 8);
      setEnriching(false);
      return enriched;
    },
    onSuccess: setRows,
    onError: () => {
      message.open({
        type: "error",
        content: "No se pudieron cargar los productos.",
      });
    },
  });

  const getInitialData = async () => {
    const response = await fetch(`${ENDPOINTS.products}`, {
      cache: "no-store",
    });

    const result = await response.json();
    console.log("this result ", result);
    setEnriching(true);
    const enriched = await enrichMany(result, 8);
    setEnriching(false);

    setRows(enriched);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  // Guardar: inputs (enter) y selects (onChange)
  async function saveChange(payload: {
    rowid: number;
    type: string;
    field: string;
    value: any;
  }) {
    try {
      const r = await fetch(ENDPOINTS.editProduct, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const txt = await r.text();
      if (
        r.ok &&
        (txt === "ok" ||
          txt === "ok_alert" ||
          txt === '"ok"' ||
          txt === '"ok_alert"')
      ) {
        message.success("Guardado");
      } else {
        message.warning(txt || "Respuesta inesperada");
      }
    } catch (e) {
      message.error("Error guardando");
    }
  }

  // Render común de <input/> (enter para guardar)
  const renderInput =
    (field: string, type: string, width = 100, numberOnly = false) =>
    (value: any, record: ProductRow) =>
      (
        <Input
          defaultValue={value ?? ""}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              const v = (e.currentTarget.value || "").trim();
              if (numberOnly) e.currentTarget.value = v.replace(/\D/g, "");
              saveChange({
                rowid: record.rowid,
                type,
                field,
                value: numberOnly ? v.replace(/\D/g, "") : v,
              });
            }
          }}
          onInput={(e) => {
            if (numberOnly)
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
          }}
        />
      );

  const renderSelect =
    (
      field: string,
      type: string,
      options: { value: string | number; label: string }[]
    ) =>
    (value: any, record: ProductRow) =>
      (
        <Select
          defaultValue={value ?? options[0]?.value}
          style={{ width: 140 }}
          options={options}
          onChange={(v) =>
            saveChange({ rowid: record.rowid, type, field, value: v })
          }
        />
      );

  const columns: DinamicColumnsType[] = [
    {
      column_id: "ref",
      title: "Ref.",
      type: "custom",
      width: 150,
      render: renderInput("ref", "product_ref", 140),
    },
    {
      column_id: "ref_prov",
      title: "Ref Prov",
      type: "custom",
      width: 130,
      render: renderInput("ref_prov", "ref_prov", 140),
    },
    {
      column_id: "label",
      title: "Etiqueta",
      type: "custom",
      width: 250,
      render: renderInput("label", "product_label", 220),
    },
    {
      column_id: "barcode",
      title: "Cod. Barras",
      type: "custom",
      width: 150,
      render: renderInput("barcode", "product_barcode", 140),
    },
    {
      column_id: "min.CE",
      title: "-CE",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "seuil_stock_alerte_almacen",
          "productw",
          60,
          true
        )(r.min?.CE, r),
    },
    {
      column_id: "max.CE",
      title: "+CE",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput("desiredstock_almacen", "productw", 60, true)(r.max?.CE, r),
    },
    {
      column_id: "min.PI",
      title: "-PI",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "seuil_stock_alerte_piso",
          "productw",
          60,
          true
        )(r.min?.PI, r),
    },
    {
      column_id: "max.PI",
      title: "+PI",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput("desiredstock_piso", "productw", 60, true)(r.max?.PI, r),
    },
    {
      column_id: "min.MJ",
      title: "-MJ",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "seuil_stock_alerte_mercado",
          "productw",
          60,
          true
        )(r.min?.MJ, r),
    },
    {
      column_id: "max.MJ",
      title: "+MJ",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput("desiredstock_mercado", "productw", 60, true)(r.max?.MJ, r),
    },
    {
      column_id: "min.JI",
      title: "-JI",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "seuil_stock_alerte_jir",
          "productw",
          60,
          true
        )(r.min?.JI, r),
    },
    {
      column_id: "max.JI",
      title: "+JI",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput("desiredstock_jir", "productw", 60, true)(r.max?.JI, r),
    },
    {
      column_id: "min.TEC",
      title: "-TEC",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "seuil_stock_alerte_TEC",
          "productw",
          60,
          true
        )(r.min?.TEC, r),
    },
    {
      column_id: "max.TEC",
      title: "+TEC",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput("desiredstock_TEC", "productw", 60, true)(r.max?.TEC, r),
    },
    {
      column_id: "min.MA",
      title: "-MA",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "seuil_stock_alerte_matehuala",
          "productw",
          60,
          true
        )(r.min?.MA, r),
    },
    {
      column_id: "max.MA",
      title: "+MA",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "desiredstock_matehuala",
          "productw",
          60,
          true
        )(r.max?.MA, r),
    },
    {
      column_id: "min.FU",
      title: "-FU",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput(
          "seuil_stock_alerte_full",
          "productw",
          60,
          true
        )(r.min?.FU, r),
    },
    {
      column_id: "max.FU",
      title: "+FU",
      type: "custom",
      width: 50,
      render: (_: any, r) =>
        renderInput("desiredstock_full", "productw", 60, true)(r.max?.FU, r),
    },
    {
      column_id: "criteriosinlimite",
      title: "PC",
      type: "custom",
      width: 100,
      render: renderSelect("criteriosinlimite", "product_extra", [
        { value: "0", label: "Desactivado" },
        { value: 1, label: "1 pieza" },
        { value: 5, label: "5 piezas" },
        { value: 10, label: "10 piezas" },
      ]),
    },
    {
      column_id: "prdlinea",
      title: "PL",
      type: "custom",
      width: 50,
      render: renderInput("prdlinea", "product_extra", 80, true),
    },
    {
      column_id: "high_end",
      title: "MKP",
      type: "custom",
      width: 50,
      render: renderInput("high_end", "product_extra", 80, true),
    },
    {
      column_id: "contenido",
      title: "CO",
      type: "custom",
      width: 50,
      render: renderInput("contenido", "product_extra", 80, true),
    },
    {
      column_id: "contenido_picking",
      title: "PI",
      type: "custom",
      width: 50,
      render: renderInput("contenido_picking", "product_extra", 80, true),
    },
    {
      column_id: "etiquetas",
      title: "ET",
      type: "custom",
      width: 50,
      render: renderInput("etiquetas", "product_extra", 80, true),
    },
    {
      column_id: "area",
      title: "AR",
      type: "custom",
      width: 50,
      render: renderInput("area", "product_extrachar", 120),
    },
    {
      column_id: "pasillo",
      title: "PA",
      type: "custom",
      width: 50,
      render: renderInput("pasillo", "product_extrachar", 120),
    },
    {
      column_id: "estante",
      title: "ES",
      type: "custom",
      width: 50,
      render: renderInput("estante", "product_extrachar", 120),
    },
    {
      column_id: "columna",
      title: "COL",
      type: "custom",
      width: 80,
      render: renderInput("columna", "product_extrachar", 120),
    },
    {
      column_id: "posicion",
      title: "PO",
      type: "custom",
      width: 80,
      render: renderInput("posicion", "product_extrachar", 120),
    },
    {
      column_id: "catproveedor",
      title: "PROV",
      type: "custom",
      width: 150,
      render: renderInput("catproveedor", "product_proveedor", 160),
    },
    {
      column_id: "marcaproducto",
      title: "Marca",
      type: "custom",
      width: 150,
      render: renderInput("marcaproducto", "product_marca", 140),
    },
    {
      column_id: "tosell",
      title: "E. Ventas",
      type: "custom",
      width: 100,
      render: renderSelect("tosell", "product_status", [
        { value: 0, label: "Fuera de venta" },
        { value: 1, label: "En venta" },
      ]),
    },
    {
      column_id: "tobuy",
      title: "E. Compras",
      type: "custom",
      width: 100,
      render: renderSelect("tobuy", "product_status", [
        { value: 0, label: "Fuera de compra" },
        { value: 1, label: "En compra" },
      ]),
    },
  ];

  return (
    <>
      <LoadingAnimation isActive={loadProducts.isPending}>
        <Container>
          <Flex vertical gap={20}>
            <MainTitle>Edición de productos</MainTitle>

            <GlassCard>
              <Form
                layout="vertical"
                form={form}
                initialValues={initialFilters}
                onFinish={(values) =>
                  loadProducts.mutate(values as typeof initialFilters)
                }
              >
                <Row gutter={[20, 20]}>
                  <Col xxl={8} xl={6}>
                    <Form.Item label="Referencia producto" name="ref">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Etiqueta producto" name="label">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Proveedor" name="proveedor">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Marca" name="marca">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Tipo" name="tipo">
                      <Select
                        style={{ width: "100%" }}
                        options={[
                          { value: "", label: "Seleccione" },
                          { value: "criterio", label: "Pedido a Criterio" },
                          { value: "prdlinea", label: "Producto de Línea" },
                          {
                            value: "stock_cedis",
                            label: "Sin Min-Max (CEDIS ✓)",
                          },
                          {
                            value: "maximo-almacen",
                            label: "Error en Min-Max (Almacen)",
                          },
                          {
                            value: "maximo-piso",
                            label: "Error en Min-Max (Piso)",
                          },
                          {
                            value: "maximo-mercado",
                            label: "Error en Min-Max (Mercado)",
                          },
                          {
                            value: "maximo-jir",
                            label: "Error en Min-Max (JIR)",
                          },
                          {
                            value: "maximo-TEC",
                            label: "Error en Min-Max (TEC)",
                          },
                          {
                            value: "maximo-matehuala",
                            label: "Error en Min-Max (Matehuala)",
                          },
                          {
                            value: "maximo-full",
                            label: "Error en Min-Max (Full)",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Área" name="area">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Pasillo" name="pasillo">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Estante" name="estante">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Columna" name="columna">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={6}>
                    <Form.Item label="Posición" name="posicion">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xxl={8} xl={"auto"}>
                    <Form.Item>
                      <Space>
                        <Button
                          onClick={() => {
                            form.resetFields();
                            form.setFieldsValue(initialFilters);
                            loadProducts.mutate(initialFilters);
                          }}
                        >
                          Limpiar
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loadProducts.isPending || enriching}
                        >
                          Filtrar
                        </Button>
                      </Space>
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
      </LoadingAnimation>
    </>
  );
}
