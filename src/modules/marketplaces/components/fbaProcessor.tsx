"use client";
import UploaderExcel from "@/components/core/UploaderExcel";
import {
  AlertOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  LoadingOutlined,
  PlaySquareOutlined,
  ReloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Flex } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  AmazonTicketData,
  createAmazonTicketAction,
} from "../actions/createAmazonTicketActions";
import { GlassCard } from "@/components/core/GlassCard";

export default function FBAProcessor() {
  const [file, setFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<any>([]);
  const [progress, setProgress] = useState(0);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  //Manejar subida de archivo
  const fileUpload = (event: any) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (
        uploadedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        uploadedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(uploadedFile);
        setProcessedData(null);
        setErrors([]);
        setStatus("Archivo cargado correctamente");
      } else {
        setStatus(
          "Por favor selecciona un archivo Excel válido (.xlsx o .xls)"
        );
      }
    }
  };

  // Leer el archivo Excel
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

  // Procesar el archivo Excel
  const processExcel = async () => {
    if (!file) {
      setStatus("Por favor selecciona un archivo.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setErrors([]);
    setStatus("Iniciando procesamiento...");

    try {
      // Leer el archivo Excel
      setStatus("Leyendo archivo Excel...");
      const excelData: any = await readExcelFile(file);

      if (excelData.length === 0) {
        throw new Error("El archivo Excel está vacío");
      }

      setStatus(`Procesando ${excelData.length} filas...`);

      // Procesar cada fila
      const processedRows = [];
      const errorsList = [];

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      for (let i = 0; i < excelData.length; i++) {
        const row = excelData[i];

        try {
          setStatus(`Procesando fila ${i + 1} de ${excelData.length}...`);

          const data: AmazonTicketData = {
            amazonCode: row["amazon-order-id"],
            sku: row["sku"],
            quantity: Number(row["quantity"]),
            price: Number(row["price"]),
          };

          const result = await createAmazonTicketAction(data);
          console.log("Resultado de la acción:", result?.data?.ticket);
          const processedRow = {
            ...row,
            Ticket: result?.data?.ticket,
          };
          processedRows.push(processedRow);

        } catch (error: any) {
          console.error(`Error procesando fila ${i + 1}:`, error);

          // Agregar fila con error marcado
          const errorRow = {
            ...row,
            Ticket: `ERROR: ${error.message}`,
          };

          processedRows.push(errorRow);
          errorsList.push({
            row: i + 1,
            error: error.message,
          });
        }

        // Actualizar progreso
        setProgress(((i + 1) / excelData.length) * 100);
      }

      setProcessedData(processedRows);
      setErrors(errorsList);

      if (errorsList.length === 0) {
        setStatus(`✅ Procesamiento completado exitosamente.`);
      } else {
        setStatus(
          `⚠️ Procesamiento completado con ${errorsList.length} errores.`
        );
      }
    } catch (error: any) {
      console.error("Error durante el procesamiento:", error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Descargar el archivo procesado
  const downloadProcessedFile = () => {
    if (!processedData) return;

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Procesado");

    const fileName = `${file.name.replace(/\.[^/.]+$/, "")}_procesado.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const reset = () => {
    setFile(null);
    setIsProcessing(false);
    setProcessedData(null);
    setProgress(0);
    setStatus("");
    setErrors([]);
    const fileInput = document.getElementById(
      "file-input"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <>
      <GlassCard>
        <Flex vertical gap={20}>
          {/* Subida de archivo */}
          <UploaderExcel
            file={file}
            isProcessing={isProcessing}
            handleFileUpload={fileUpload}
          />

          {/* Estado */}
          {status && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">{status}</p>
            </div>
          )}

          {/* Botón de procesamiento */}
          <div className="mb-6 flex justify-center">
            <Button
              onClick={processExcel}
              disabled={!file || isProcessing}
              type="primary"
              icon={
                isProcessing ? (
                  <LoadingOutlined className="w-5 h-5 animate-spin" />
                ) : (
                  <PlaySquareOutlined className="w-5 h-5" />
                )
              }
            >
              {isProcessing ? "Procesando..." : "Procesar Archivo"}
            </Button>
          </div>

          {/* Barra de progreso */}
          {isProcessing && (
            <div className="mb-6">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {progress.toFixed(1)}% completado
              </p>
            </div>
          )}

          {/* Errores */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                <AlertOutlined className="w-4 h-4 mr-2" />
                Errores encontrados ({errors.length})
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.slice(0, 5).map((error: any, index: number) => (
                  <li key={index}>
                    Fila {error.row}: {error.error}
                  </li>
                ))}
                {errors.length > 5 && (
                  <li>... y {errors.length - 5} errores más</li>
                )}
              </ul>
            </div>
          )}

          {/* Resumen de datos procesados */}
          {processedData && (
            <>
              <Flex vertical gap={20}>
                {/* className="text-sm text-green-700" */}
                <div
                  className={
                    errors.length > 0
                      ? "bg-yellow-50 border border-yellow-200 rounded-md p-4"
                      : "bg-green-50 border border-green-200 rounded-md p-4"
                  }
                >
                  <h3
                    className={
                      errors.length > 0
                        ? "text-sm font-medium text-yellow-800 mb-2 flex items-center"
                        : "text-sm font-medium text-green-800 mb-2 flex items-center"
                    }
                  >
                    {errors.length > 0 ? (
                      <WarningOutlined className="w-4 h-4 mr-2" />
                    ) : (
                      <CheckCircleOutlined className="w-4 h-4 mr-2" />
                    )}
                    Procesamiento completado{" "}
                    {errors.length > 0 && "con errores"}
                  </h3>

                  <p
                    className={
                      errors.length > 0
                        ? "text-sm text-yellow-700"
                        : "text-sm text-green-700"
                    }
                  >
                    Se procesaron {processedData.length} filas.
                    {errors.length > 0 &&
                      ` ${errors.length} filas tuvieron errores.`}
                  </p>
                </div>

                {/* Botón de descarga solo cuando hay errores */}
                {errors.length > 0 && (
                  <Button
                    onClick={downloadProcessedFile}
                    icon={<DownloadOutlined />}
                    color="green"
                    variant="solid"
                  >
                    Descargar Archivo Procesado
                  </Button>
                )}

                {/* reset */}
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={reset}
                >
                  Procesar otro archivo
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </GlassCard>
    </>
  );
}
