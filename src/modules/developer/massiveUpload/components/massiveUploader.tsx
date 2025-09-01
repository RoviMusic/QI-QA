import {
    AlertOutlined,
    CheckCircleOutlined,
    FileExcelOutlined,
    LoadingOutlined,
    PlaySquareOutlined,
    UploadOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Button, Col, Flex, Row } from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
    SendingRowType2,
} from "../../../../modules/developer/catalogProcessor/types/DataDummy";


export default function MassiveUploader() {
  const [file, setFile] = useState<any>(null); //archivo de excel subido
    const [isProcessing, setIsProcessing] = useState(false); //estado de procesamiento
    const [processedData, setProcessedData] = useState<number>(0); //total de filas procesadas
    const [progress, setProgress] = useState(0); //progreso de procesamiento
    const [status, setStatus] = useState(""); //estado del procesamiento
    const [errors, setErrors] = useState<any>([]); //lista de errores encontrados
    const [processedRows, setProcessedRows] = useState<SendingRowType2[]>([]);

    const expectedHeaders = [
        "Código",
        "Division",
        "Clave Division",
        "Marca",
        "Est.",
        "Existencia",
        "Nombre",
        "Modelo",
        "Multiplo",
        "Precio distribuidor SIN IVA",
        "Precio público sugerido CON IVA",
        "Precio público mínimo CON IVA",
        "Precio MARKETPLACE sugerido CON IVA",
        "% Descuento",
        "Promoción distribuidor SIN IVA",
        "Promoción público sugerido CON IVA",
        "Promoción público mínimo CON IVA",
        "Promoción MARKETPLACE sugerido CON IVA"
    ];

    // Manejar la subida del archivo
    const handleFileUpload = (event: any) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            if (
                uploadedFile.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                uploadedFile.type === "application/vnd.ms-excel"
            ) {
                setFile(uploadedFile);
                setProcessedData(0);
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

                    // Obtener el rango completo de la hoja
                    const range = XLSX.utils.decode_range(worksheet["!ref"]!);

                    // Obtener todas las columnas del header (primera fila)
                    const headers: any[] = [];
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellAddress = XLSX.utils.encode_cell({
                            r: range.s.r,
                            c: col,
                        });
                        const cellValue = worksheet[cellAddress];
                        headers.push(cellValue ? cellValue.v : `Column_${col + 1}`);
                    }

                    // Validar encabezados
                    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
                    if (missingHeaders.length > 0) {
                        reject(new Error(`Archivo Excel inválido. Faltan columnas: ${missingHeaders.join(", ")}`));
                        return;
                    }

                    // Convertir a JSON con defval para celdas vacías y header explícito
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        defval: "", // Valor por defecto para celdas vacías
                        header: headers, // Usar headers explícitos
                        range: 1, // Empezar desde la fila 2 (omitir header)
                    });

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

            //setStatus(`Procesando ${excelData.length} filas...`);
            setStatus(`Procesando las primeras 150 filas...`);

            let totalRows: number = 0; // contador total de filas procesadas
            const errorsList = []; // lista de errores encontrados

            for (let i = 0; i < excelData.length; i++) {
                const row = excelData[i]; // fila actual del excel
                try {
                    setStatus(`Procesando fila ${i + 1} de ${excelData.length}...`);

                    //parsear datos del excel a json para enviar al back
                    const sendingProduct: SendingRowType2 = {
                        CODIGO: row["Código"],
                        DIVISION: row["Division"],
                        CLAVEDIV: row["Clave Division"],
                        MARCA: row["Marca"],
                        ESTADO: row["Est."],
                        EXISTENCIA: row["Existencia"],
                        NOMBRE: row["Nombre"],
                        MODELO: row["Modelo"],
                        MULTIPLO: row["Multiplo"],
                        PRECIOSINIVA: row["Precio distribuidor SIN IVA"],
                        PRECIOSUGIVA: row["Precio público sugerido CON IVA"],
                        PRECIOMINIVA: row["Precio público mínimo CON IVA"],
                        MARKETPLACEIVA: row["Precio MARKETPLACE sugerido CON IVA"],
                        DESC: row["% Descuento"],
                        PROMDISTSINIVA: row["Promoción distribuidor SIN IVA"],
                        PROMSGCONIVA: row["Promoción público sugerido CON IVA"],
                        PROMMINCONIVA: row["Promoción público mínimo CON IVA"],
                        MARKETPLACESUGCONIVA: row["Promoción MARKETPLACE sugerido CON IVA"]
                    }

                    setProcessedRows(prev => [...prev, sendingProduct]);

                    console.warn(`elemento parseado ${i + 1}`, sendingProduct)

                } catch (error: any) {
                    console.error(`Error procesando fila ${i + 1}:`, error);

                    errorsList.push({
                        row: i + 1,
                        sku: row["SKU"],
                        error: error.message,
                    });
                }

                // Actualizar progreso
                setProgress(((i + 1) / 150) * 100);
                totalRows++;
            }

            setProcessedData(totalRows);
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
            setStatus(`❌ Error durante el procesamiento: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // funcion que se ejecuta al detectar que el usuario cierra la tab o recarga la pantalla
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])
    const alertUser = (e: any) => {
        e.preventDefault()
        e.returnValue = ''
    }

    return (
        <>
            <Row
                justify={"center"}
                gutter={20}
            >
                <Col xxl={8} xl={10} lg={12}>
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                            Procesador de archivos de Excel
                        </h1>

                        {/* Subida de archivo */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileExcelOutlined className="inline w-4 h-4 mr-2" />
                                Archivo Excel
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-input"
                                    disabled={isProcessing}
                                />
                                <label
                                    htmlFor="file-input"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <UploadOutlined className="w-12 text-gray-400 mb-2" />
                                    <span className="text-gray-600">
                                        {file
                                            ? file.name
                                            : "Haz clic para seleccionar un archivo Excel"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Estado */}
                        {status && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700">{status}</p>
                            </div>
                        )}

                        {/* Botón de procesamiento */}
                        <div className="mb-2 flex justify-center">
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
                                            SKU {error.sku}: {error.error}
                                        </li>
                                    ))}
                                    {errors.length > 5 && (
                                        <li>... y {errors.length - 5} errores más</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {processedData > 0 && (
                            <>
                                <div className="p-6 bg-white rounded-lg shadow-lg mt-4">
                                    <Flex vertical gap={20}>
                                        <div className={errors.length > 0 ? 'bg-yellow-50 border border-yellow-200 rounded-md p-4' : 'bg-green-50 border border-green-200 rounded-md p-4'}>
                                            <h3 className={errors.length > 0 ? 'font-medium text-yellow-800 mb-2 flex items-center' : 'font-medium text-green-800 mb-2 flex items-center'}>
                                                {errors.length > 0 ? <WarningOutlined className="w-4 h-4 mr-2" /> : <CheckCircleOutlined className="w-4 h-4 mr-2" />}
                                                Procesamiento completado. Se procesaron {
                                                    processedData
                                                }{" "}
                                                filas.
                                                {errors.length > 0 &&
                                                    ` ${errors.length} filas tuvieron errores.`}
                                            </h3>

                                        </div>
                                    </Flex>
                                </div>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
            {processedRows.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th style={{ padding: "0 5px" }}>Código</th>
                            <th style={{ padding: "0 5px" }}>Division</th>
                            <th style={{ padding: "0 5px" }}>Clave Division</th>
                            <th style={{ padding: "0 5px" }}>Marca</th>
                            <th style={{ padding: "0 5px" }}>Est.</th>
                            <th style={{ padding: "0 5px" }}>Existencia</th>
                            <th style={{ padding: "0 5px" }}>Nombre</th>
                            <th style={{ padding: "0 5px" }}>Modelo</th>
                            <th style={{ padding: "0 5px" }}>Multiplo</th>
                            <th style={{ padding: "0 5px" }}>Precio distribuidor SIN IVA</th>
                            <th style={{ padding: "0 5px" }}>Precio público sugerido CON IVA</th>
                            <th style={{ padding: "0 5px" }}>Precio público mínimo CON IVA</th>
                            <th style={{ padding: "0 5px" }}>Precio MARKETPLACE sugerido CON IVA</th>
                            <th style={{ padding: "0 5px" }}>% Descuento</th>
                            <th style={{ padding: "0 5px" }}>Promoción distribuidor SIN IVA</th>
                            <th style={{ padding: "0 5px" }}>Promoción público sugerido CON IVA</th>
                            <th style={{ padding: "0 5px" }}>Promoción público mínimo CON IVA</th>
                            <th style={{ padding: "0 5px" }}>Promoción MARKETPLACE sugerido CON IVA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedRows.map((row, index) => (
                            <tr key={index}>
                                <td style={{ padding: "0 5px" }}>{row.CODIGO}</td>
                                <td style={{ padding: "0 5px" }}>{row.DIVISION}</td>
                                <td style={{ padding: "0 5px" }}>{row.CLAVEDIV}</td>
                                <td style={{ padding: "0 5px" }}>{row.MARCA}</td>
                                <td style={{ padding: "0 5px" }}>{row.ESTADO}</td>
                                <td style={{ padding: "0 5px" }}>{row.EXISTENCIA}</td>
                                <td style={{ padding: "0 5px" }}>{row.NOMBRE}</td>
                                <td style={{ padding: "0 5px" }}>{row.MODELO}</td>
                                <td style={{ padding: "0 5px" }}>{row.MULTIPLO}</td>
                                <td style={{ padding: "0 5px" }}>{row.PRECIOSINIVA}</td>
                                <td style={{ padding: "0 5px" }}>{row.PRECIOSUGIVA}</td>
                                <td style={{ padding: "0 5px" }}>{row.PRECIOMINIVA}</td>
                                <td style={{ padding: "0 5px" }}>{row.MARKETPLACEIVA}</td>
                                <td style={{ padding: "0 5px" }}>{row.DESC}</td>
                                <td style={{ padding: "0 5px" }}>{row.PROMDISTSINIVA}</td>
                                <td style={{ padding: "0 5px" }}>{row.PROMSGCONIVA}</td>
                                <td style={{ padding: "0 5px" }}>{row.PROMMINCONIVA}</td>
                                <td style={{ padding: "0 5px" }}>{row.MARKETPLACESUGCONIVA}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}
