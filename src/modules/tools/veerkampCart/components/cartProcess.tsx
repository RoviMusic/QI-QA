"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Button, Col, Flex, Input, Row } from "antd";
import { useState } from "react";
import tableStyles from "@/styles/Tables.module.css";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { GetExtraData } from "../services/veerkampCartService";
import {
  LoadingOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
const { TextArea } = Input;

const columns: DinamicColumnsType[] = [
  {
    column_id: "sku",
    title: "SKU",
    type: "string",
    align: "center",
    width: "100px",
  },
  {
    column_id: "model",
    title: "Modelo",
    type: "string",
    align: "center",
    width: "200px",
  },
  {
    column_id: "product",
    title: "Producto",
    type: "string",
    align: "center",
    width: "200px",
  },
  {
    column_id: "cant",
    title: "Cantidad",
    type: "int",
    width: "80px",
  },
];

type Item = { id: number; sku: string; cant: number };
const SEP = /\t|,|;|\||\s+/;

export default function CartProcess({ token }: { token: string | undefined }) {
  const [file, setFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [dataCart, setDataCart] = useState<any[]>([]);
  const { notification } = App.useApp();

  const [text, setText] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const setStatusRow = (status: any) => {
    let statusColor = "";
    switch (status) {
      case "good":
        statusColor = tableStyles.processedRow;
        break;
      case "diff":
        statusColor = tableStyles.diffRow;
        break;
      case "bad":
        statusColor = tableStyles.errorRow;
        break;
    }
    return statusColor;
  };

  //sube el archivo
  const handleFileUpload = async (event: any) => {
    setIsProcessing(true);
    console.log("processing file upload");
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (
        uploadedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        uploadedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(uploadedFile);
        await processExcel(uploadedFile);
      } else {
        console.error("Archivo inválido");
        notification.open({
          type: "error",
          message: "Archivo inválido",
          description:
            "Por favor selecciona un archivo Excel válido (.xlsx o .xls)",
        });
        setIsProcessing(false);
      }
    }
  };

  //lee el archivo
  const readExcelFile = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (!e.target || !e.target.result) {
            throw new Error("No se pudo leer el archivo.");
          }
          const result = e.target.result;
          if (typeof result === "string") {
            throw new Error("El archivo no es un ArrayBuffer.");
          }
          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  async function processExcel(file: any) {
    const listCart = [];
    if (!file) {
      notification.open({
        type: "error",
        message: "Hubo un error",
        description: "Por favor, selecciona un archivo",
      });
      setIsProcessing(false);
      return;
    }
    try {
      const excelData: any = await readExcelFile(file);

      if (excelData.length === 0) {
        throw new Error("El archivo Excel está vacío");
      }

      const filteredData = excelData.filter(
        (item: any) => item["Pedido2"] > 0 && item["Prod. de Línea"] === "SI"
      );
      setData(filteredData);

      for (let i = 0; i < filteredData.length; i++) {
        const row = filteredData[i];
        try {
          const stock = await get_stock(row["Ref."]);
          if (stock != null) {
            const actual = Math.min(row["Pedido2"], stock);

            //console.warn(`item id ${row["Ref."]}`);

            listCart.push({
              itemId: row["Ref."],
              cantidad: actual,
              numLinea: i,
              id: uuidv4(),
            });

            setData((prev) =>
              prev.map((item, index) =>
                item["Ref."] === row["Ref."]
                  ? {
                      ...item,
                      type: actual == row["Pedido2"] ? "good" : "diff",
                      cant: actual,
                    }
                  : item
              )
            );
          }
        } catch (error: any) {
          setData((prev) =>
            prev.map((item, index) =>
              item["Ref."] === row["Ref."] ? { ...item, type: "bad" } : item
            )
          );
        }
      }

      setDataCart(listCart);
      setIsProcessing(false);
    } catch (error: any) {
      console.error(error);
      notification.open({
        type: "error",
        message: "Hubo un error",
        description: error.message,
      });
      setIsProcessing(false);
    }
  }

  async function get_stock(sku: any) {
    const init = new Headers();
    init.append("Authorization", token!);

    const response = await fetch(
      `https://cadi.veerkamp.biz:8443/prodsbyparam?texto1=${sku}&limitpage=1&opcion=all`,
      { headers: init }
    );

    const jsonResponse = await response.json();

    if (jsonResponse.resultado != "ok" || jsonResponse.data.docs.length == 0) {
      //console.error(`sku ${sku} y response ${jsonResponse.data.docs.length}`);
      setData((prev) =>
        prev.map((item, index) =>
          item["Ref."] === sku ? { ...item, type: "bad" } : item
        )
      );
      return null;
    }

    return jsonResponse.data.docs[0].existencia;
  }

  const sendCart = async () => {
    const dataSend = { cuenta_Id: "201905", listado: dataCart };
    console.log("data to send", dataSend);

    const init = new Headers();
    init.append("Authorization", token!);
    init.append("Content-Type", "application/json");

    const r = await fetch("https://cadi.veerkamp.biz:8443/updCarrito", {
      method: "POST",
      headers: init,
      body: JSON.stringify(dataSend),
    });

    const responseJ = await r.json();
    console.log(responseJ);

    if (responseJ.resultado != "ok") {
      notification.open({
        type: "error",
        message: "Hubo un error",
        description: "Hubo un error al generar el carrito",
      });
    } else {
      notification.open({
        type: "success",
        message: "Se ha enviado correctamente el carrito",
      });
    }
  };

  const reset = () => {
    setFile(null);
    setData([]);
    setItems([]);
    setText("");
    setDataCart([]);
  };

  function toNumber(n?: string | number) {
    const v = Number(String(n ?? "").replace(",", "."));
    return Number.isFinite(v) ? v : null;
  }

  function parseSkuTextarea(text: string) {
    setIsProcessing(true);
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    const out: Item[] = [];
    let id = 1;
    for (const raw of lines) {
      const tokens = raw.trim().split(SEP).filter(Boolean);
      if (!tokens.length) continue;

      const [skuTok, qtyTok] = tokens;
      const sku = (skuTok ?? "")
        .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "")
        .trim();
      if (!sku) continue;
      const qty = toNumber(qtyTok);
      if (qty === null || qty <= 0) continue;
      out.push({ id: id++, sku, cant: qty });
    }
    if (out.length === 0) {
      setIsProcessing(false);
      notification.open({
        type: "warning",
        message: "Ingresa al menos un SKU y cantidad válidos",
      });
      return;
    }
    console.log("parsed items", out);
    setItems(out);
    getExtraData(out);
  }

  const getExtraData = async (data: any) => {
    if (data.length === 0) return null;
    const listCart = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const stock = await get_stock(row.sku);
        const url = `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/shared/getModel?sku=${row.sku}`;
        const response = await fetch(url);
        const jsonData = await response.json();
        if (stock != null) {
          const actual = Math.min(row.cant, stock);

          listCart.push({
            itemId: row.sku,
            cantidad: actual,
            numLinea: i,
            id: uuidv4(),
          });

          setItems((prev) =>
            prev.map((item, index) =>
              item.sku === row.sku
                ? {
                    ...item,
                    type: actual == row.cant ? "good" : "diff",
                    cant: actual,
                    model: jsonData.length > 0 ? jsonData[0].model : "",
                    product: jsonData.length > 0 ? jsonData[0].product : "",
                  }
                : item
            )
          );
        } else {
          setItems((prev) =>
            prev.map((item, index) =>
              item.sku === row.sku
                ? {
                    ...item,
                    type: "bad",
                    cant: 0,
                    model: jsonData.length > 0 ? jsonData[0].model : "",
                    product: jsonData.length > 0 ? jsonData[0].product : "",
                  }
                : item
            )
          );
        }
      } catch (error: any) {
        console.error("error sku ", error);
        setItems((prev) =>
          prev.map((item, index) =>
            item.sku === row.sku ? { ...item, type: "bad" } : item
          )
        );
      }
    }
    setDataCart(listCart);
    setIsProcessing(false);
  };

  return (
    <>
      <Row gutter={[20, 20]} justify="space-between">
        <Col xxl={8} xl={8}>
          <GlassCard>
            {/* <Flex vertical gap={20}>
                  <UploaderExcel
                    title="Cargar archivo para crear carrito"
                    file={file}
                    isProcessing={isProcessing}
                    handleFileUpload={handleFileUpload}
                  />

                  <Button
                    type="primary"
                    disabled={!file || isProcessing}
                    //onClick={sendCart}
                    icon={
                      isProcessing ? (
                        <LoadingOutlined className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShoppingCartOutlined className="w-5 h-5" />
                      )
                    }
                  >
                    Hacer pedido
                  </Button>

                  <Button
                    icon={<ReloadOutlined />}
                    onClick={reset}
                    disabled={isProcessing}
                  >
                    Hacer un nuevo pedido
                  </Button>
                </Flex> */}

            <Flex vertical gap={20}>
              <small>Ingresa sku's y cantidad, después da 'enter'</small>
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Ejemplo:\n4002165\t2\n4002175\t1\n4201170\t2`}
                autoSize={{ minRows: 6, maxRows: 12 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // evita insertar nueva línea
                    parseSkuTextarea(text); // convierte a array
                  }
                }}
              />
              <Button
                type="primary"
                disabled={items.length == 0 || isProcessing}
                onClick={sendCart}
                icon={
                  isProcessing ? (
                    <LoadingOutlined className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingCartOutlined className="w-5 h-5" />
                  )
                }
              >
                Hacer pedido
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={reset}
                disabled={isProcessing}
              >
                Limpiar
              </Button>
            </Flex>
          </GlassCard>
        </Col>

        <Col xxl={16} xl={16}>
          <GlassCard>
            <DinamicTable
              columns={columns}
              dataSource={items}
              rowStyle
              getRowClass={setStatusRow}
              hasPagination={false}
            />
          </GlassCard>
        </Col>
      </Row>
    </>
  );
}
