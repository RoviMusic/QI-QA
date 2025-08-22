"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import UploaderExcel from "@/components/core/UploaderExcel";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Button, Col, Flex, Row } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";
import tableStyles from "@/styles/Tables.module.css";
import { v4 as uuidv4 } from "uuid";
import {
  LoadingOutlined,
  PlaySquareOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const columns: DinamicColumnsType[] = [
  {
    column_id: "Ref.",
    title: "SKU",
    type: "string",
    align: "center",
  },
  {
    column_id: "Modelo",
    title: "Modelo",
    type: "string",
    align: "center",
  },
  {
    column_id: "Producto",
    title: "Producto",
    type: "string",
    align: "center",
  },
  {
    column_id: "Pedido2",
    title: "Cantidad",
    type: "int",
  },
];

export default function VeerkampCartPage() {
  const [file, setFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [dataCart, setDataCart] = useState<any[]>([]);
  const { notification } = App.useApp();

  const token = process.env.NEXT_PUBLIC_VEERKAMP_TOKEN;

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
    let listCart = [];
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

            console.warn(`item id ${row["Ref."]}`);

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

  const sendCart = async () => {
    const dataSend = { cuenta_Id: "201905", listado: dataCart };

    const init = new Headers();
    init.append("Authorization", token!);
    init.append("Content-Type", "application/json");

    const r = await fetch("https://cadi.veerkamp.biz:8443/updCarrito", {
      method: "POST",
      headers: init,
      body: JSON.stringify(dataSend),
    });

    const responseJ = await r.json();
    console.log(responseJ)

    if (responseJ.resultado != "ok"){
      notification.open({
        type: "error",
        message: "Hubo un error",
        description: "Hubo un error al generar el carrito",
      });
    }else{
      notification.open({
        type: "success",
        message: "Se ha enviado correctamente el carrito",
      });
    }
  };

  const reset = () => {
    setFile(null);
    setData([]);
  };

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Carrito de compras Veerkamp</MainTitle>

          <Row gutter={[20, 20]} justify="space-between">
            <Col xxl={8} xl={8}>
              <GlassCard>
                <Flex vertical gap={20}>
                  <UploaderExcel
                    title="Cargar archivo para crear carrito"
                    file={file}
                    isProcessing={isProcessing}
                    handleFileUpload={handleFileUpload}
                  />

                  <Button
                    type="primary"
                    disabled={!file || isProcessing}
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

                  <Button icon={<ReloadOutlined />} onClick={reset} disabled={isProcessing}>
                    Hacer un nuevo pedido
                  </Button>
                </Flex>
              </GlassCard>
            </Col>

            <Col xxl={16} xl={16}>
              <GlassCard>
                <DinamicTable
                  columns={columns}
                  dataSource={data}
                  rowStyle
                  getRowClass={setStatusRow}
                  hasPagination={false}
                />
              </GlassCard>
            </Col>
          </Row>
        </Flex>
      </Container>
    </>
  );
}
