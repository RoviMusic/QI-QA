import {
  AlertOutlined,
  CheckCircleOutlined,
  FileExcelFilled,
  FileExcelOutlined,
  LoadingOutlined,
  PlaySquareOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";     // Iconos de la libreria antd
import { Button, Col, Flex, Row, Collapse, Space, Divider, Tooltip } from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  dataDummy,               // Info Dummy a comparar
  DataDummyType,           // Tipo de variable para productos Dummy
  FieldsUpdatedType,       // Tipo de variables para productos pendiente
  PendingProductType,      // Tipo de productos pendientes
  SendingRowType,          // Informacion que se va enviar en el Excel
  UpdatedValuesType,       // Tipo de variables para info a actualizar
} from "../types/DataDummy";  // Informacion dummy que se usara de prueba
import ProductComparison from "./ProductComparison";   // Produccion de comparacion
import type { CollapseProps } from "antd";  // Define todas las propiedades que se pueden usar en el compontente Collapse
import { normalizedCategories } from "../lib/normalizedCategories";   // Archivo que sirve para normalizar y limpiar las categorias
// antes de compararlo con Excel y Dollibar
export default function DBProcessor() {
  const [file, setFile] = useState<any>(null); //archivo de excel subido
  const [isProcessing, setIsProcessing] = useState(false); //estado de procesamiento
  const [processedData, setProcessedData] = useState<number>(0); //total de filas procesadas
  const [newData, setNewData] = useState<any>([]); //filas nuevas
  const [updatedData, setUpdatedData] = useState<any>([]); //filas actualizadas
  const [pendingData, setPendingData] = useState<PendingProductType[]>([]); //filas pendientes de revisión
  const [noChangeData, setNoChangeData] = useState<any>([]); //filas sin cambios
  const [progress, setProgress] = useState(0); //progreso de procesamiento
  const [pendingProduct, setPendingProduct] =
    useState<PendingProductType | null>(null); //producto pendiente seleccionado
  const [status, setStatus] = useState(""); //estado del procesamiento
  const [errors, setErrors] = useState<any>([]); //lista de errores encontrados

  const data = dataDummy; // Simulación de datos de Dolibarr
  //se debera consultar bd de dolibarr y traer todos los sku
  //llenar data de esa consulta
  // const data = await fetchDataFromDolibarr();

  // Manejar la subida del archivo
  const handleFileUpload = (event: any) => {
    const uploadedFile = event.target.files[0];             // Obtiene el archivo subido
    if (uploadedFile) {
      if (       // Valida que sea un archivo de Excel
        uploadedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // archivo en formato .xlsx
        uploadedFile.type === "application/vnd.ms-excel"   // archivo en formato .xls
      ) {
        setFile(uploadedFile);    // Guarda el archivo válido
        setProcessedData(0);      // Reinicia el contador
        setPendingData([]);       // Limpia datos pendientes anteriores
        setErrors([]);            // Limpia errores anteriores
        setStatus("Archivo cargado correctamente");  // Mensaje de que subio correctamente el archivo
      } else {
        setStatus(
          "Por favor selecciona un archivo Excel válido (.xlsx o .xls)"  // Mensaje de que seleccione correctamente el archivo
        );
      }
    }
  };

  // Leer el archivo Excel (y los convierte en objeto JSON para procesar y comparar con Dolibarr)
  const readExcelFile = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();  // Variable donde contendra el archivo
      reader.onload = (e) => {
        try {
          if (!e.target || !e.target.result) {
            throw new Error("No se pudo leer el archivo.");  // Mensaje de error de que no pudo leer el archivo
          }
          const result = e.target.result;        // Obtiene el resultado de la lectura del archivo
          if (typeof result === "string") {
            throw new Error("El archivo no es un ArrayBuffer.");  // Mensaje donde señaña que no es un array, si el tipo de dato es string
          }
          const data = new Uint8Array(result); // Convierte el ArrayBuffer en un Uint8array para que la libreria XLSX pueda leer el archivo
          const workbook = XLSX.read(data, { type: "array" });  // Guarda la lectura del archivo de excel
          const sheetName = workbook.SheetNames[0];       // Toma la primera hoja del Excel 
          const worksheet = workbook.Sheets[sheetName];   // Toma la informacion de la hoja

          // Obtener el rango completo de la hoja
          const range = XLSX.utils.decode_range(worksheet["!ref"]!);

          // Obtener todas las columnas del header (primera fila)
          const headers: any[] = [];                                          // Array donde se guardara las columnas
          for (let col = range.s.c; col <= range.e.c; col++) {                // Ciclo que recorre todas las columnas de Excel
            const cellAddress = XLSX.utils.encode_cell({                      // encode_cell ayuda a manejar la info de la hoja de calculo
              r: range.s.r,   // Fila inicial
              c: col,         // Columna actual
            });
            const cellValue = worksheet[cellAddress];                         // Obtiene el valor de la celda en la direccion calculada 
            headers.push(cellValue ? cellValue.v : `Column_${col + 1}`);      // Si la celda existe toma su valor, es esta vacia lo llama Column_i
          }

          // Convertir a JSON con defval para celdas vacías y header explícito
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            defval: "", // Valor por defecto para celdas vacías
            header: headers, // Usar headers explícitos
            range: 1, // Empezar desde la fila 2 (omitir header)
            //raw: false      //   (sugerencia que obliga a mantener todos los valores como texto)
          });

          resolve(jsonData);     // Marca como completada la promesa del procesamiento de Excel
        } catch (error) {
          reject(error);         // Rechaza el procesamiento de Excel
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);  // Lee el archivo como un ArrayBuffer
    });
  };

  // Procesar el archivo Excel
  const processExcel = async () => {
    if (!file) {                                         // Condicional que revisa si hay archivo
      setStatus("Por favor selecciona un archivo.");     // Mensaje que muestra para seleccionar archivo
      return;
    }

    setIsProcessing(true);                               // Activa indicador de procesamiento
    setProgress(0);                                      // Reinicia la barra de progreso
    setErrors([]);                                       // Limpia errores anteriores
    setStatus("Iniciando procesamiento...");             // Mensaje inicial

    try {
      // Leer el archivo Excel
      setStatus("Leyendo archivo Excel...");             // Cambia status a leyendo
      const excelData: any = await readExcelFile(file);

      if (excelData.length === 0) {                      // Revisa que el archivo no este vacio
        throw new Error("El archivo Excel está vacío");
      }

      //setStatus(`Procesando ${excelData.length} filas...`);
      setStatus(`Procesando las primeras 150 filas...`);

      // inicializar contadores
      let totalRows: number = 0; // contador total de filas procesadas
      const newRows: any[] = []; // filas nuevas
      const updatedRows: FieldsUpdatedType[] = []; // filas actualizadas
      const errorsList = []; // lista de errores encontrados
      const pendingRows: PendingProductType[] = []; // filas pendientes de revisión
      const noChangeRows: any[] = []; //filas sin cambios

      for (let i = 0; i < 150; i++) {                              // Bucle donde solo procesa las primeras 150 filas del Excel
        const row = excelData[i]; // fila actual del excel
        try {
          setStatus(`Procesando fila ${i + 1} de 150...`);

          /*en este bloque se hace la consulta a la api de dolibarr -- se envia row completo */
          //sacar las medidas de las dimensiones
          const ln = row["DIMENSIONES LARGO"] ? (row["DIMENSIONES LARGO"].trim()).slice(0, -2) : '';
          const wd = row["DIMENSIONES ANCHO"] ? (row["DIMENSIONES ANCHO"].trim()).slice(0, -2) : '';
          const hg = row["DIMENSIONES ALTO"] ? (row["DIMENSIONES ALTO"].trim()).slice(0, -2) : '';
          const dimensionUnit = row["DIMENSIONES LARGO"] ? (row["DIMENSIONES LARGO"].trim()).slice(-2) : (row["DIMENSIONES ALTO"].trim()).slice(-2);
          // Remueve las ultimas 2 letras (unidades)
          const wh = row["PESO"] ? (row["PESO"].trim()).slice(0, -2) : '';
          // Toma las ultimas 2 letras (unidades)
          const weightUnit = row["PESO"] ? (row["PESO"].trim()).slice(-2) : '';

          // mejor usar esto -> const eq_it: string[] = String(row["PRODUCTOS EQUIVALENTES"]).trim()
          // const eq_it: string[] = row["PRODUCTOS EQUIVALENTES"].trim()

          //parsear datos del excel a json para enviar al back (Convierte la fila de Excel al formato que espera recibir Dolibarr)
          const sendingProduct: SendingRowType = {
            // Muchos SKU son number en vez de string, por eso marca varios errores, una manera de
            // solucionarlo es normalizar SKU con String(row["SKU"]).trim()
            SKU: row["SKU"].trim(),
            CATEGORY: row["CATEGORIA DOLI"].trim(),
            NAME: row["NOMBRE"].trim(),
            BRAND: row["MARCA"].trim(),
            MODEL: row["MODELO"].toString().trim(),
            SUPPLIER: row["PROVEEDOR"].trim(),
            SAT_CODE: row["SAT"].toString().trim(),
            SERIAL_NUMBER: row["NUMERO DE SERIE"].toString().trim(),
            UPC: row["UPC"].toString().trim(),
            LENGTH: Number(ln),
            WIDTH: Number(wd),
            HEIGHT: Number(hg),
            MEASUREMENTS_UNIT: dimensionUnit,
            WEIGHT: Number(wh),
            WEIGHT_UNIT: weightUnit,
            SEO_NAME: row["NOMBRE SEO"].trim(),
            SHORT_DESCRIPTION: row["DESCRIPCION CORTA"].trim(),
            DESCRIPTION: row["DESCRIPCION LARGA"].trim(),
            TECH_SPECS: row["ESPECIFICACIONES TEC"].trim(),
            IMAGES: (row["IMAGENES"].trim()).split(','),
            CAT_ML: row["CATEGORIZACION ML"].trim(),
            CAT_AMAZON: row["CATEGORIZACION AMA"].trim(),
            CAT_COPPEL: row["CATEGORIZACION COPPEL"].trim(),
            CAT_WALMART: row["CATEGORIZACION WALMART"].trim(),
            RM_MEASUREMENTS: row["DIMENSIONES ROVI"].trim(),
            RM_WEIGHT: row["PESO ROVI"].toString().trim(),
            COUNTRY: row["PAIS"].trim(),
            STOCK: row["STOCK"].toString().trim(),
            LOCATION_IN_STORES: (row["UBICACION TIENDAS"].trim()).split(','),
            // Los valores que contienen algunas celdas como del SKU 990810200, tiene en productos equivalentes
            // un valor como este: 990810248,099081, al ser un number lo marca como error
            // una sugerencia para evitar esto es usando (String(row["PRODUCTOS EQUIVALENTES"]).trim()).split(',')
            EQUIVALENT_ITEMS: (String(row["PRODUCTOS EQUIVALENTES"]).trim()).split(','),
            RELATED_ITEMS: (row["RELACIONADOS"].toString().trim()).split(','),
            REPLACEMENT_ITEMS: (row["REEMPLAZO"].toString().trim()).split(','),
            VARIANTS_ITEMS: (row["VARIANTES"].toString().trim()).split(','),
          }

          console.warn(`elemento parseado ${i + 1}`, sendingProduct)

          // buscar si el producto (SKU) ya existe en la base de datos de Dolibarr -- esto se reemplaza por la consulta a la api
          // usa dataDummy como simulacion
          const existingRow = data.find(
            (item: DataDummyType) => item.sku === row["SKU"]
          );

          //producto ya existe en dolibarr
          if (existingRow) {
            const flags: any[] = [];                          // Variable para guardar las diferencias que requieren reviion
            const fieldsUpdated: UpdatedValuesType[] = [];    // Campos para actualizar

            // Compara cada campo: NOMBRE, MARCA, MODELO y CATEGORIA DOLI, si dolibarr es diferente actualiza directamente
            // si hay diferencia marca para revision manual
            if (existingRow.productName !== row["NOMBRE"]) {
              if (!existingRow.productName) {
                //nombre es vacio, se actualiza
                console.log("se actualiza nombre en dolibarr:", row);
                fieldsUpdated.push({
                  key: "Nombre",
                  value: row["NOMBRE"],
                });
              } else {
                //nombre es diferente, necesita revision
                flags.push("name");
              }
            }
            if (existingRow.brand !== row["MARCA"]) {
              if (!existingRow.brand) {
                // marca es vacio, se actualiza
                console.log("se actualiza marca en dolibarr:", row);
                fieldsUpdated.push({ key: "Marca", value: row["MARCA"] });
              } else {
                // marca es diferente, necesita revision
                flags.push("brand");
              }
            }
            if (existingRow.model !== row["MODELO"]) {
              if (!existingRow.model) {
                //modelo es vacio, se actualiza
                console.log("se actualiza modelo en dolibarr:", row);
                fieldsUpdated.push({ key: "Modelo", value: row["MODELO"] });
              } else {
                //model es diferente, requiere revision
                flags.push("model");
              }
            }

            if (
              normalizedCategories(existingRow.categories) !==
              normalizedCategories(row["CATEGORIA DOLI"])
            ) {
              if (!existingRow.categories) {
                //categoria es vacio, se actualiza
                console.log("se actualiza categoria en dolibarr:", row);
                fieldsUpdated.push({
                  key: "Categoria",
                  value: row["CATEGORIA DOLI"],
                });
              } else {
                //categoria es diferente
                flags.push("category");
              }
            }

            //si hay flags, significa que hay diferencias, mandar a lista de productos pendientes
            if (flags.length > 0) {
              const pendingR = {
                sku: row["SKU"],
                dolibarr: existingRow,
                excel: row,
                flags,
              };

              pendingRows.push(pendingR);
              console.log("fila pendiente ", pendingR);
            } else {
              //si hubo actualizaciones de campos mandar a lista de actualizados, si no hubo actualizaciones, no hacer nada
              if (fieldsUpdated.length > 0) {
                const updated = {
                  sku: existingRow.sku,
                  updatedValues: fieldsUpdated,
                };
                updatedRows.push(updated);
              } else {
                const noChange = {
                  sku: existingRow.sku,
                  name: existingRow.productName,
                };
                noChangeRows.push(noChange);
              }
            }
          } else {
            //no existe el producto en dolibarr
            //accion de insert a las dos bd
            //console.log("se inserta nuevo sku:", row["SKU"]);
            newRows.push(row);
          }
        } catch (error: any) {                                      // Manejo de errores por fila
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

      // Guarda todos los resultados del estado para mostrarlos en el UI
      setProcessedData(totalRows);     // Total de filas contadas
      setNewData(newRows);             // Total de productos nuevos agregados
      setUpdatedData(updatedRows);     // Total de productos actualizados
      setErrors(errorsList);           // Total de errores procesados
      setPendingData(pendingRows);     // Total de productos pendientes que requieren revision
      setNoChangeData(noChangeRows);   // Total de productos que no requieren revision

      // Mensaje final
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

  // Funcion que selecciona un producto pendiente para revision manual
  const handleClickPending = (item: PendingProductType) => { // Recibe un producto de tipo PendingProductType (tiene datos de SKU, DOlibarr, Excel y flags)
    console.log("Producto pendiente seleccionado:", item);
    setPendingProduct(item);                                 // Guarda el estado en pendingProduct
  };

  // Funcion que guarda la desicion del usuario y remueve el producto de la lista de  pendientes una vez tomado la desicion
  const handleSavePending = (finalProduct: any) => {
    console.log("Producto final guardado:", finalProduct);
    // Aquí puedes implementar la lógica para guardar el producto final
    // Por ejemplo, enviar una solicitud a la API o actualizar el estado
    // Luego, puedes resetear el producto pendiente seleccionado
    setPendingProduct(null);                                 // Cierra el panel de revisión al limpiar el producto seleccionado
    console.log(finalProduct.sku);
    // También puedes actualizar pendingData si es necesario
    const updatedPendingData = pendingData.filter(           // Filtra el producto de listas pendientes usando el SKU
      (item) => item.sku !== finalProduct.sku
    );
    setPendingData(updatedPendingData);                      // Actualiza el estado pendingData sin el producto ya revisado
  };

  // Funcion para crear paneles para mostrar los 4 tipos de resultados de la comparacion, cada uno con su propia estructura
  const getResume = (
    type: "add" | "update" | "pending" | "noChange",   // Tipo de resultado
    data: any[]                                        // Datos a mostrar
  ) => {
    const label =                                      // Crea el titulo del panel con el conteo de elementos
      type === "add"
        ? `Se agregaron ${data.length} nuevo(s) producto(s).`
        : type === "update"
          ? `Se actualizaron ${data.length} producto(s).`
          : type === "pending"
            ? `Hay ${data.length} producto(s) pendientes de revisión.`
            : `${data.length} producto(s) no tuvieron cambios.`;

    let children;    // Aqui se almacenara el contenido especifico

    switch (type) {
      case "add":    // Renderiza la lista de productos nuevos que se agregaron
        children = (
          <>
            {data.map((item: any, index: number) => (
              <>
                <Flex key={index} gap={10}>
                  <span>✅</span>
                  <Row gutter={[20, 0]}>
                    <Col xxl={6}>     {/*Columna SKU */}
                      <Space direction="vertical" size={0}>
                        <p className="font-bold">SKU: </p>
                        <p>{item["SKU"]}</p>  {/*Valor del SKU */}
                      </Space>
                    </Col>

                    <Col xxl={18}>   {/*Columna Nombre */}
                      <Space direction="vertical" size={0}>
                        <p className="font-bold">Nombre: </p>  {/*Valor del nombre*/}
                        <p>{item["NOMBRE"]}</p>
                      </Space>
                    </Col>
                  </Row>
                </Flex>
                <Divider size="small" />    {/*Separador entre productos*/}
              </>
            ))}
          </>
        );
        break;
      case "update":     // Renderiza la lista de productos que fueron actualizados
        children = (
          <>
            {data.map((item: FieldsUpdatedType, index: number) => (
              <>
                <Flex key={index} gap={10}>
                  <span>✅</span>
                  <Row gutter={[20, 0]}>
                    <Col xxl={24}>
                      <Space>
                        <p className="font-bold">SKU: </p>
                        <p>{item.sku}</p>   {/*SKU del producto */}
                      </Space>
                    </Col>

                    <Col xxl={24}>
                      <p className="font-bold">Actualizaciones: </p>
                      <Flex vertical gap={5}>   {/*Lista de campos actualizados */}
                        {item.updatedValues.map(
                          (val: UpdatedValuesType, idx: number) => (
                            <Space key={idx} direction="vertical" size={0}>
                              <p>{`${val.key}: ${val.value}`}</p> {/*Campo Valor */}
                            </Space>
                          )
                        )}
                      </Flex>
                    </Col>
                  </Row>
                </Flex>
                <Divider size="small" />
              </>
            ))}
          </>
        );
        break;
      case "pending":    // Renderiza la lista de productos que requieren revision, se pueden seleccionar para realizar la comparacion
        children = (
          <ul className="text-sm text-yellow-700 space-y-1">
            {data.map((item: PendingProductType, index: number) => (
              <li
                key={index}
                className="hover:text-blue-600 hover:cursor-pointer"
                onClick={() => handleClickPending(item)}    // Al hacer click abre modal de revision
              >
                SKU {item.dolibarr.sku}   {/*Muestra el SKU */}
              </li>
            ))}
          </ul>
        );
        break;
      case "noChange":     // Renderiza la lista de productos que no tuvieron cambios
        children = (
          <>
            {data.map((item: any, index: number) => (
              <>
                <Flex key={index} gap={10}>
                  <span>✅</span>
                  <Row gutter={[20, 0]}>
                    <Col xxl={6}>
                      <Space direction="vertical" size={0}>
                        <p className="font-bold">SKU: </p>
                        <p>{item.sku}</p>   {/* SKU */}
                      </Space>
                    </Col>

                    <Col xxl={18}>
                      <Space direction="vertical" size={0}>
                        <p className="font-bold">Nombre: </p>
                        <p>{item.name}</p>    {/* Nombre */}
                      </Space>
                    </Col>
                  </Row>
                </Flex>
                <Divider size="small" />
              </>
            ))}
          </>
        );
        break;
      default:
        children = null;
    }

    const items: CollapseProps["items"] = [                   // Crea el objeto para el componente Collapse de Ant Design
      {
        key: type,                                                          // Identificador de panel unico
        label: <span className="font-medium text-gray-800">{label}</span>,  // titulo visible
        children: children,                                                 // Contenido cuando se expande
      },
    ];

    return <Collapse items={items} ghost />;
  };

  // Descargar el archivo de productos pendientes
  const downloadPendingFile = () => {
    if (!pendingData) return;            // Si no hay datos pendientes no hace nada

    const pendingExcel: any[] = []       // Array vacio para almacenar los datos

    pendingData.map((item, index) => {
      pendingExcel.push(item.excel)      // Extrae los datos originales del Excel
    })

    const worksheet = XLSX.utils.json_to_sheet(pendingExcel);    // Convierte el json a hoja de calculo de Excel
    const workbook = XLSX.utils.book_new();                      // Inicializa un libro vacio de excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pendientes");  // Añade la hoja al libro con el nombre "Pendientes"

    const fileName = `${file.name.replace(/\.[^/.]+$/, "")}_pendientes.xlsx`;  // Genera el nombre del archivo
    XLSX.writeFile(workbook, fileName);                    // Genera y descarga el archivo
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
        justify={pendingData.length > 0 ? "space-between" : "center"}
        gutter={20}
      >
        <Col xxl={8} xl={10} lg={12}>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Procesador de excel a QI
            </h1>

            {/* Subida de archivo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileExcelOutlined className="inline w-4 h-4 mr-2" />
                Archivo Excel
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"                         // Tipo archivo
                  accept=".xlsx,.xls"                 // Solo acepta Excel
                  onChange={handleFileUpload}         // Funcion que maneja la subida de archivos
                  className="hidden"                  // Input oculto
                  id="file-input"                     // ID para label
                  disabled={isProcessing}             // Se desactiva durante procesamiento
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <UploadOutlined className="w-12 text-gray-400 mb-2" />
                  <span className="text-gray-600">
                    {file  // Muestra nombre o instruccion
                      ? file.name
                      : "Haz clic para seleccionar un archivo Excel"}
                  </span>
                </label>
              </div>
            </div>

            {/* Estado */}
            {status && (                // Muestra mensaje de "Procesando..." o "Archivo cargado"
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{status}</p>
              </div>
            )}

            {/* Botón de procesamiento */}
            <div className="mb-2 flex justify-center">
              <Button
                onClick={processExcel}                         // Funcion que procesa el archivo de Excel
                disabled={!file || isProcessing}               // Desactivado si no hay archivo o esta procesando
                type="primary"
                icon={                                         // Icono dinamico
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

            {/* Barra de progreso  (Solo se muestra durante procesamiento)*/}
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
          </div>

          {/* Resumen de datos procesados */}
          {processedData > 0 && (     // Solo muestra si algo proceso
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

                    {/*Muestra los datos que tienen datos */}
                    {newData.length > 0 && getResume("add", newData)}              {/*Nuevos */}
                    {updatedData.length > 0 && getResume("update", updatedData)}   {/*Actualizados */}
                    {noChangeData.length > 0 &&
                      getResume("noChange", noChangeData)}                         {/*Sin cambios */}
                  </div>

                  {/*Panel de pendientes con botón de descarga */}
                  {pendingData && pendingData.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <Flex justify="end" className="mb-3">
                        <Tooltip title="Descargar excel de productos pendientes">
                          <Button icon={<FileExcelFilled />} variant="solid" color="green" onClick={downloadPendingFile} />
                        </Tooltip>
                      </Flex>
                      {getResume("pending", pendingData)}       {/*Pendientes */}
                    </div>
                  )}
                </Flex>
              </div>
            </>
          )}
        </Col>

        {/* productos pendientes de revision */}
        {/*Muestra un panel lateral cuando hay productos pendientes que requieran revisión */}
        {pendingData && pendingData.length > 0 && (        // Verifica que el array existe y tenga al menos 1 elemento
          <Col xxl={16} xl={14} lg={12}>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 mt-4">
                Selecciona un producto de la lista para compararlo
              </h3>

              {pendingProduct && (                    // Renderiza cuando hay un producto seleccionado
                <ProductComparison
                  pendingProduct={pendingProduct}     // Datos a comparar (Dolibarr + Excel + flags)
                  onSave={handleSavePending}          // Guarda la desicion del usuario
                />
              )}
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}