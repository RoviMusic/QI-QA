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
import { MainButton } from "@/components/core/Buttons";
import LoadingAnimation from "@/components/core/LoadingAnimation";

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
  pp_quality: string;
  pp_sensey: string;
  pre: string;
  cedis: string;
  piso: string;
  mercado: string;
  mat: string;
  jir: string;
  tec: string;
  full: string;
  garantias: string;
  sep_rmc: string;
  sep_jir: string;
  sep_mj: string;
  sep_mat: string;
  exhibicion_rmc: string;
  pp_gonher: string;
  pp_inovaudio: string;
  pp_audyson: string;
  amazon: string;
  rappi: string;
  liverpool: string;
  g_remates: string;
  coppel: string;
  pp_lemus: string;
  controversias: string;
  defecto: string;
  faltante: string;
  shopee: string;
  g_calidad: string;
  g_proveedor: string;
  g_refaccion: string;
  g_reparacion: string;
  g_merma: string;
  status: string;
  max: string | null;
  in_transit: string;
  total: number;
  diferencia: number;
  pedidos: number | "Error";
  unitmeasure: string | null;
  uomvalue: number | null;
  contenido: number | null;
};

async function mapToUi(r: ApiRow): Promise<UiRow> {
  // Endpoint de categoria
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/purchaseReport/category?rowid=${r.rowid}`
  );
  const data = await res.json();
  const categoria = data.data[0]?.description ?? "";

  // Optimizacion de consultas de almacenes
  const resAlmacen = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/purchaseReport/stock?rowid=${r.rowid}`
  );
  const dataAlmacen = await resAlmacen.json();
  const stockMap = dataAlmacen.data;

  // Acceso a cada almacen
  const pp_quality = stockMap[36] ?? "";
  const pp_sensey = stockMap[43] ?? "";
  const preS = stockMap[42] ?? "";
  const cedis = stockMap[1] ?? "";
  const piso = stockMap[2] ?? "";
  const mercado = stockMap[3] ?? "";
  const mat = stockMap[4] ?? "";
  const jir = stockMap[10] ?? "";
  const tec = stockMap[49] ?? "";
  const full = stockMap[16] ?? "";
  const garantias = stockMap[9] ?? "";
  const sep_rmc = stockMap[18] ?? "";
  const sep_jir = stockMap[19] ?? "";
  const sep_mj = stockMap[20] ?? "";
  const sep_mat = stockMap[21] ?? "";
  const exhibicion_rmc = stockMap[44] ?? "";
  const pp_gonher = stockMap[23] ?? "";
  const pp_inovaudio = stockMap[24] ?? "";
  const pp_audyson = stockMap[25] ?? "";
  const amazon = stockMap[26] ?? "";
  const rappi = stockMap[27] ?? "";
  const liverpool = stockMap[28] ?? "";
  const g_remates = stockMap[29] ?? "";
  const coppel = stockMap[3] ?? "";
  const pp_lemus = stockMap[30] ?? "";
  const controversias = stockMap[32] ?? "";
  const defecto = stockMap[33] ?? "";
  const faltante = stockMap[34] ?? "";
  const shopee = stockMap[35] ?? "";
  const g_calidad = stockMap[37] ?? "";
  const g_proveedor = stockMap[38] ?? "";
  const g_refaccion = stockMap[39] ?? "";
  const g_reparacion = stockMap[40] ?? "";
  const g_merma = stockMap[41] ?? "";

  // Ultimas columnas de la tabla
  const pre = r.uomvalue ?? null; // “presentación”/unidades por pack
  const totalStock =
    Number(cedis) +
    Number(piso) +
    Number(mercado) +
    Number(mat) +
    Number(jir) +
    Number(tec); // si luego agregas stocks por almacén, súmalos aquí

  const total = (Number(r.in_transit) ?? 0) + Number(totalStock);

  const max = r.max;

  const diferencia = max && max !== 0 ? max - total : 0;

  const pedidos = pre && pre !== 0 ? Math.round(diferencia / pre) : "Error";

  const status = r.tosell == 0 && r.tobuy == 0 ? "Descontinuado" : "";

  return {
    id: r.rowid, // rowid
    referencia: r.ref, // ref
    modelo: r.modelo ?? "", // modelo
    descripcion: r.label, // label
    barcode: r.barcode, // barcode
    proveedor: r.catproveedor, // proveedor
    marca: r.marcaproducto, // marca
    categoria, // categoria
    precio: Number(r.price_ttc ?? 0), // Precio venta
    pmp: Number(r.pmp ?? 0), // Costo PMP (Sin IVA)
    linea: r.prdlinea === 1 ? "SI" : "", // Prod. linea
    pp_quality: pp_quality, // pp_quality
    pp_sensey: pp_sensey, // pp_sensey
    pre: preS, // pre
    cedis: cedis, // cedis
    piso: piso, // piso
    mercado: mercado, // mercado
    mat: mat, // mat
    jir: jir, // jir
    tec: tec, // tec
    full: full, // full
    garantias: garantias, // garantias
    sep_rmc: sep_rmc, // SEP .RMC
    sep_jir: sep_jir, // SEP .JIR
    sep_mj: sep_mj, // SEP .MJ
    sep_mat: sep_mat, // SEP .MAT
    exhibicion_rmc: exhibicion_rmc, // EXHIBICION RMC
    pp_gonher: pp_gonher, // PP Gonher
    pp_inovaudio: pp_inovaudio, // PP Inovaudio
    pp_audyson: pp_audyson, // PP Audyson
    amazon: amazon, // amazon
    rappi: rappi, // rappi
    liverpool: liverpool, // liverpool
    g_remates: g_remates, // G. Remates
    coppel: coppel, // coppel
    pp_lemus: pp_lemus, // PP Lemus
    controversias: controversias, // Controversias
    defecto: defecto, // Defecto
    faltante: faltante, // Faltante
    shopee: shopee, // Shopee
    g_calidad: g_calidad, // G. Calidad
    g_proveedor: g_proveedor, // G. Proveedor
    g_refaccion: g_refaccion, // G. Refacción
    g_reparacion: g_reparacion, // G. Reparación
    g_merma: g_merma, // G. Merma
    status, // Status
    max: max?.toString() ?? "", // Max
    in_transit: r.in_transit?.toString() ?? "", // En transito
    total, // Tot. stock
    diferencia, // Diferencia
    pedidos, // Pedidos
    // Uom pedido
    unitmeasure:
      r.unitmeasure == "1"
        ? "Pieza"
        : r.unitmeasure == "2"
        ? "Paquete"
        : r.unitmeasure == "3"
        ? "Juego"
        : "",
    uomvalue: r.uomvalue, // Uom Value
    contenido: r.contenido, // Contenido
  };
}

export default function PurchaseReportPage() {
  const [form] = Form.useForm<PurchaseType>();
  const [rows, setRows] = useState<UiRow[]>([]);
  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  async function mapWithConcurrencyLimit<T, R>(
    arr: T[],
    mapper: (item: T) => Promise<R>,
    limit: number
  ): Promise<R[]> {
    const result: R[] = [];
    let i = 0;
    async function next() {
      if (i >= arr.length) return;
      const idx = i++;
      result[idx] = await mapper(arr[idx]);
      await next();
    }
    const workers = Array.from({ length: limit }, next);
    await Promise.all(workers);
    return result;
  }

  const fetchReport = useMutation({
    mutationFn: async (values: {
      supplier: string | undefined;
      brand: string | undefined;
      stock: string | undefined;
    }) => {
      setLoading(true);
      const qs = new URLSearchParams({
        prov: values.supplier ?? "",
        marca: values.brand ?? "",
        stock: String(values.stock ?? 0),
      });

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_INTERNAL_API_URL
        }/reports/purchaseReport?${qs.toString()}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("FETCH_FAIL");

      return (await res.json()) as ApiRow[];
    },

    // hacemos async para poder usar await
    onSuccess: async (data) => {
      if (!Array.isArray(data) || data.length === 0) {
        message.open({
          type: "info",
          content: "No hay datos para mostrar",
        });
        setRows([]);
        setLoading(false);
        return;
      }

      //console.log(data);

      // Esperamos a que todas las promesas devueltas por mapToUi terminen
      //const mapped = await Promise.all(data.map((r) => mapToUi(r)));
      const mapped = await mapWithConcurrencyLimit(data, mapToUi, 15); // Límite de 15

      setRows(mapped);
      setLoading(false);
    },

    onError: (err) => {
      console.error("hubo un error ", err);
      message.open({
        type: "error",
        content: "Hubo un error al cargar datos",
      });
      setLoading(false);
    },
  });

  const columns: DinamicColumnsType[] = useMemo(
    () => [
      {
        title: "ID",
        column_id: "id",
        type: "string",
        width: 90,
        align: "center",
      },
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
        title: "PP Quality",
        column_id: "pp_quality",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "PP sensey",
        column_id: "pp_sensey",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "PRE-REC-CEDIS",
        column_id: "pre",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Almacén",
        column_id: "cedis",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Piso",
        column_id: "piso",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Mercado",
        column_id: "mercado",
        type: "string",
        width: 100,
        align: "right",
      },
      {
        title: "Mat",
        column_id: "mat",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Jir",
        column_id: "jir",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Tec",
        column_id: "tec",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Full",
        column_id: "full",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Garantias",
        column_id: "garantias",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "SEP .RMC",
        column_id: "sep_rmc",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "SEP .JIR",
        column_id: "sep_jir",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "SEP .MJ",
        column_id: "sep_mj",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "SEP .MAT",
        column_id: "sep_mat",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "EXHIBICIÓN RMC",
        column_id: "exhibicion_rmc",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "PP Gonher",
        column_id: "pp_gonher",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "PP Inovaudio",
        column_id: "pp_inovaudio",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "PP Audyson",
        column_id: "pp_audyson",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Amazon",
        column_id: "amazon",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Rappi",
        column_id: "rappi",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Liverpool",
        column_id: "liverpool",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "G. Remates",
        column_id: "g_remates",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Coppel",
        column_id: "coppel",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "PP Lemus",
        column_id: "pp_lemus",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Controversias",
        column_id: "controversias",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Defecto",
        column_id: "defecto",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Faltante",
        column_id: "faltante",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Shopee",
        column_id: "shopee",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "G. Calidad",
        column_id: "g_calidad",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "G. Proveedor",
        column_id: "g_proveedor",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "G. Refacción",
        column_id: "g_refaccion",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "G. Reparación",
        column_id: "g_reparacion",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "G. Merma",
        column_id: "g_merma",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "Status",
        column_id: "status",
        type: "string",
        width: 100,
      },
      {
        title: "Uom Pedido",
        column_id: "unitmeasure",
        type: "string",
        width: 100,
      },
      {
        title: "Uom Valor",
        column_id: "uomvalue",
        type: "string",
        width: 90,
        align: "center",
      },
      {
        title: "Contenido",
        column_id: "contenido",
        type: "string",
        width: 90,
      },
      {
        title: "Max",
        column_id: "max",
        type: "string",
        width: 90,
        align: "right",
      },
      {
        title: "En transito",
        column_id: "in_transit",
        type: "string",
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
        type: "string",
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
      ref: item.referencia,
      pedido: item.pedidos,
      modelo: item.modelo,
      producto: item.descripcion,
      barcode: item.barcode,
      proveedor: item.proveedor,
      marca: item.marca,
      categoria: item.categoria,
      precio_venta: item.precio,
      costo_pmp: item.pmp,
      prod_linea: item.linea,
      pp_quality: item.pp_quality,
      pp_sensey: item.pp_sensey,
      pre: item.pre,
      cedis: item.cedis,
      piso: item.piso,
      mercado: item.mercado,
      mat: item.mat,
      jir: item.jir,
      tec: item.tec,
      full: item.full,
      garantias: item.garantias,
      sep_rmc: item.sep_rmc,
      sep_jir: item.sep_jir,
      sep_mj: item.sep_mj,
      sep_mat: item.sep_mat,
      exhibicion_rmc: item.exhibicion_rmc,
      pp_gonher: item.pp_gonher,
      pp_inovaudio: item.pp_inovaudio,
      pp_audyson: item.pp_audyson,
      amazon: item.amazon,
      rappi: item.rappi,
      liverpool: item.liverpool,
      g_remates: item.g_remates,
      coppel: item.coppel,
      pp_lemus: item.pp_lemus,
      controversias: item.controversias,
      defecto: item.defecto,
      faltante: item.faltante,
      shopee: item.shopee,
      g_calidad: item.g_calidad,
      g_proveedor: item.g_proveedor,
      g_refaccion: item.g_refaccion,
      g_reparacion: item.g_reparacion,
      g_merma: item.g_merma,
      status: item.status,
      uomPedido: item.unitmeasure,
      uomValor: item.uomvalue,
      contenido: item.contenido,
      max: item.max,
      in_transit: item.in_transit,
      total: item.total,
      diff: item.diferencia,
    }));

    // xlsx build
    const worksheet = XLSX.utils.json_to_sheet(cleanRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte para compras");

    //headers
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "ID",
          "Referencia",
          "Pedido",
          "Modelo",
          "Producto",
          "Código de barras",
          "Proveedor",
          "Marca",
          "Categoría",
          "Precio Venta",
          "Costo PMP",
          "Producto de línea",
          "PP Quality",
          "PP Sensey",
          "Pre",
          "Cedis",
          "Piso",
          "Mercado Juárez",
          "Matehuala",
          "JIR",
          "TEC",
          "Full",
          "Garantias",
          "SEP .RMC",
          "SEP .JIR",
          "SEP .MJ",
          "SEP .MAT",
          "EXHIBICION RMC",
          "PP Gonher",
          "PP Inovaudio",
          "PP Audyson",
          "Amazon",
          "Rappi",
          "Liverpool",
          "G. Remates",
          "Coppel",
          "PP Lemus",
          "Controversias",
          "Defecto",
          "Faltante",
          "Shopee",
          "G. Calidad",
          "G. Proveedor",
          "G. Refacción",
          "G. Reparación",
          "G. Merma",
          "Status",
          "Uom Pedido",
          "Uom Valor",
          "Contenido",
          "Max",
          "En transito",
          "Total",
          "Diferencia",
        ],
      ],
      {
        origin: "A1",
      }
    );

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
      <LoadingAnimation isActive={loading}>
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
                            label:
                              "Todos los productos de línea CON y SIN stock",
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
              {rows.length > 0 && (
                <div>
                  <MainButton onPress={downloadProcessedFile}>
                    Descargar excel
                  </MainButton>
                </div>
              )}
              <DinamicTable columns={columns} dataSource={rows} />
            </GlassCard>
          </Flex>
        </Container>
      </LoadingAnimation>
    </>
  );
}
