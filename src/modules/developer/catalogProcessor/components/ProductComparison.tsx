'use client'
import { Button, Checkbox, Col, Flex, Radio, Row, Space } from "antd";
import { PendingProductType } from "../types/DataDummy";
import { SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import ReactDiffViewer from "react-diff-viewer";
import { normalizedCategories } from "../lib/normalizedCategories";

type comparisionProps = {
  pendingProduct: PendingProductType;
  onSave: (finalProduct: any) => void; // Callback para guardar cambios
};

export default function ProductComparison({
  pendingProduct,
  onSave,
}: comparisionProps) {
  // Variable de estado para manejar solo las selecciones de campos con flags
  const [fieldSelections, setFieldSelections] = useState<
    Record<string, string>
  >({});  // Objeto vacio
  const [doubleReview, setDoubleReview] = useState(false);                 // Variable de estado para doble revision

  // Función para manejar la selección de un campo flaggeado
  const handleFieldSelection = (fieldName: any, source: any) => {
    setFieldSelections((prev) => ({
      ...prev,
      [fieldName]: source, // 'dolibarr' 'excel' o 'none' como origen elegido
    }));
    handleSetCheck();   // Funcion que verifica si todas las funciones estan hechas
  };

  // Funcion para ver si el usuario ha tomado una desicion para todos los campos que tienen diferencias
  const handleSetCheck = () => {

    console.log("filedSelect ", fieldSelections);  // Muestra en la consola el estado actual de las selecciones

    console.log('has none? ', Object.values(fieldSelections).includes('none')) // Vefifica selecciones de none
    setDoubleReview(Object.values(fieldSelections).includes('none'))    // Actualiza el estado de doble revision
    // Si hay al menos un campo con "none" setDoubleReview(true)
    // Si no hay ningun campo con "none" setDoubleReview(false)

  }

  // Función para construir el objeto final basado en Excel + selecciones con las desiciones del usuario
  const buildFinalProduct = () => {
    // Comenzamos con todos los datos del Excel
    const finalProduct: { [key: string]: any } = { ...pendingProduct.excel };

    // Sustituimos solo los campos flaggeados según la selección del usuario
    pendingProduct.flags.forEach((flag) => {   // Iteracion sobre los campos con diferencias
      const selection = fieldSelections[flag];  // Obtiene la desicion para este campo ('excel', 'dolibarr', 'none')
      if (selection === "excel") {              // Condicional en caso de que el usuario seleccione Excel
        // Mapeo de campos entre las fuentes
        // Copia el valor de excel al campo de dolibarr
        type FlagKey = "name" | "category" | "brand" | "model";
        const fieldMapping: Record<
          FlagKey,
          { excel: string; dolibarr: string }
        > = {
          name: { excel: "NOMBRE", dolibarr: "productName" },
          category: { excel: "CATEGORIA DOLI", dolibarr: "categories" },
          brand: { excel: "MARCA", dolibarr: "brand" },
          model: { excel: "MODELO", dolibarr: "model" },
        };

        if ((flag as FlagKey) in fieldMapping) {
          const mapping = fieldMapping[flag as FlagKey];
          finalProduct[mapping.dolibarr] = (pendingProduct.excel as any)[
            mapping.excel
          ];
        }
      }
      if (selection === "none") {   // Si el usuario eligio none mantiene el valor original de excel
        setDoubleReview(true);      // Pero marca que necesita doble revision
      }
      // Si selection === 'dolibarr' o no hay selección, mantiene el valor original de dolibarr
    });

    return {
      sku: finalProduct["SKU"],               // SKU identificador
      producto: { ...finalProduct },          // Producto con desiciones aplicadas
      doubleReview: doubleReview,             // Si necesita una segunda revision
      fieldSelect: fieldSelections,           // Todas las desiciones del usuario
    };
  };

  // Función para guardar los cambios
  const handleSaveChanges = () => {
    const finalProduct = buildFinalProduct();
    onSave(finalProduct);
  };

  // Función para renderizar un campo (siempre muestra ambos valores)
  const renderField = (
    fieldName: string,     // "name", "brand", "category", "model"
    label: string,         // "Nombre", "Marca", "Categoria", "Modelo"
    dolibarrValue: string, // Valor de Dolibarr
    excelValue: string     // Valor de Excel
  ) => {
    const hasFlag = pendingProduct.flags.includes(fieldName);   // Variable que verifica si tiene campos con diferencias
    // Determina si tiene opciones o solo informacion 

    return (
      <Flex vertical gap={15}>
        <Space>
          <p className="font-semibold text-gray-700">{label}:</p>
          {hasFlag && (   // Solo muestra si hay conflicto
            <span className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
              ⚠️ CONFLICTO
            </span>
          )}
        </Space>

        {hasFlag ? (
          <>
            <Space direction="vertical" size="middle">
              <ReactDiffViewer           // Componente que permite diferenciar componentes
                oldValue={dolibarrValue}
                newValue={excelValue}
                splitView={true}        // Vista dividida a lado
                hideLineNumbers         // Oculta numero de lineas
                styles={{ contentText: { wordBreak: "break-all" } }}  // Ajuste de textos
                leftTitle="Dolibarr"    // Titulo izquierdo
                rightTitle="Excel"      // Titulo derecho
              />
              <Radio.Group
                //value={fieldSelections[fieldName] || 'excel'} // Default a Excel si no hay selección
                onChange={(e) =>       // Radio Group para la seleccion
                  handleFieldSelection(fieldName, e.target.value)
                }
                className="w-full"
              >
                <Space direction="vertical" className="w-full">     {/*Opción 1: Dolibarr */}
                  <Radio value="dolibarr" className="w-full">
                    <div
                      className={`p-3 rounded border ${fieldSelections[fieldName] === "dolibarr"
                          ? "bg-green-50 border-green-300"         // Seleccionado
                          : "bg-gray-50 border-gray-200"           // No seleccionado
                        }`}
                    >
                      <span className="text-sm text-gray-600">Dolibarr:</span>
                      <br />
                      <span className="font-medium break-all">
                        {dolibarrValue || "N/A"}
                      </span>
                    </div>
                  </Radio>
                  <Radio value="excel" className="w-full">      {/*Opción 2 Excel */}
                    <div
                      className={`p-3 rounded border ${fieldSelections[fieldName] === "excel"
                          ? "bg-green-50 border-green-300"      // Seleccionado
                          : "bg-gray-50 border-gray-200"        // No seleccionado
                        }`}
                    >
                      <span className="text-sm text-gray-600">Excel:</span>
                      <br />
                      <span className="font-medium break-all">
                        {excelValue || "N/A"}
                      </span>
                    </div>
                  </Radio>
                  <Radio value="none" className="w-full">       {/*Opción 3: Ninguno */}
                    <div
                      className={`p-3 rounded border ${fieldSelections[fieldName] === "none"
                          ? "bg-green-50 border-green-300"        // Seleccionado
                          : "bg-gray-50 border-gray-200"          // No seleccionado
                        }`}
                    >
                      <span className="font-medium break-all">
                        Ninguno de los anteriores
                      </span>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </Space>
          </>
        ) : (
          // Campo sin flag: solo muestra información
          <div className="space-y-2">
            {/* Dolibarr (se usará automáticamente) */}
            <div className="p-3 rounded border bg-blue-50 border-blue-300">
              <span className="text-sm text-gray-600">
                Dolibarr (se usará este):
              </span>
              <br />
              <span className="font-medium break-all">
                {dolibarrValue || "N/A"}
              </span>
            </div>
            {/* Excel (solo informativo) */}
            <div className="p-3 rounded border bg-gray-50 border-gray-200 ">
              <span className="text-sm text-gray-600">Excel:</span>
              <br />
              <span className="font-medium break-all">
                {excelValue || "N/A"}
              </span>
            </div>
          </div>
        )}
      </Flex>
    );
  };

  // Verificar si todos los campos con flags están seleccionados
  // El usuario ha tomado una desicion para todos los conflictos
  const isFormComplete = () => {
    return pendingProduct.flags.every((flag) => fieldSelections[flag]);
  };

  // Función para obtener el valor que se usará en el resultado final
  const getFinalValue = (
    fieldName: "name" | "category" | "brand" | "model"  // Solo acepta estos 4 campos mapeados
  ) => {
    const fieldMapping = {                              // Diccionario de conversion de nombres
      name: { excel: "NOMBRE", dolibarr: "productName" },
      category: { excel: "CATEGORIA DOLI", dolibarr: "categories" },
      brand: { excel: "MARCA", dolibarr: "brand" },
      model: { excel: "MODELO", dolibarr: "model" },
    };

    // Si no esta en flags usa automaticamente el valor de Dolibarr
    if (!pendingProduct.flags.includes(fieldName)) { // Revisa si el fieldname no esta dentro de la lista flags del pendingProduct
      // Sin flag: siempre dolibarr
      return pendingProduct.dolibarr[
        // as keyof typeof convence que TypeScript de que la clave viene del diccionario fieldMapping y si pertenece al objeto
        // pendingProduct.dolibarr
        fieldMapping[fieldName].dolibarr as keyof typeof pendingProduct.dolibarr
      ];
    }

    const selection = fieldSelections[fieldName];  // Obtiene la fuente de datos seleccionado por el usuario para ese campo
    if (selection === "excel") {     // Si el usuario eligio excel, devuelve el valor de Excel
      return pendingProduct.excel[
        fieldMapping[fieldName].excel as keyof typeof pendingProduct.excel
      ];
    }

    // Default o 'dolibarr'
    return pendingProduct.dolibarr[    // Usa el valor de dolibarr o none
      fieldMapping[fieldName].dolibarr as keyof typeof pendingProduct.dolibarr
    ];
  };

  return (
    <>
      {pendingProduct && (   // Solo renderiza si hay producto seleccionado
        <>
          <Row justify="space-between" gutter={20} className="mb-4">
            <Col xxl={24}>
              <div className="p-4 bg-gray-50 rounded-md space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Comparación de datos - Producto: {pendingProduct.dolibarr.sku}    {/*Muestra el SKU para identificacion clara */}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre - siempre se muestra */}
                  <div>
                    {renderField(
                      "name",
                      "Nombre",
                      pendingProduct.dolibarr.productName,
                      pendingProduct.excel["NOMBRE"]
                    )}
                  </div>

                  {/* Categoría - siempre se muestra */}
                  <div>
                    {renderField(
                      "category",
                      "Categoría",
                      normalizedCategories(pendingProduct.dolibarr.categories),
                      normalizedCategories(
                        pendingProduct.excel["CATEGORIA DOLI"]
                      )
                    )}
                  </div>

                  {/* Marca - siempre se muestra */}
                  <div>
                    {renderField(
                      "brand",
                      "Marca",
                      pendingProduct.dolibarr.brand,
                      pendingProduct.excel["MARCA"]
                    )}
                  </div>

                  {/* Modelo - siempre se muestra */}
                  <div>
                    {renderField(
                      "model",
                      "Modelo",
                      pendingProduct.dolibarr.model,
                      pendingProduct.excel["MODELO"]
                    )}
                  </div>
                </div>

                {/* Resumen de lo que se guardará */}
                <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-3">
                    📄 Datos finales que se guardarán:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700 break-all">
                        <strong>Nombre:</strong> {getFinalValue("name")}   {/*Muestra el valor final que se guardara */}
                        {pendingProduct.flags.includes("name") && (
                          <span className="ml-2 text-xs bg-yellow-200 px-1 rounded">
                            {fieldSelections["name"] == "none"    // texto dinamico, muestra la desicion tomada
                              ? "No se harán cambios"
                              : fieldSelections["name"] || "dolibarr"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 break-all">
                        <strong>Categoría:</strong> {getFinalValue("category")}   {/*Muestra el valor final que se guardara */}
                        {pendingProduct.flags.includes("category") && (
                          <span className="ml-2 text-xs bg-yellow-200 px-1 rounded">
                            {fieldSelections["category"] == "none"  // texto dinamico, muestra la desicion tomada
                              ? "No se harán cambios"
                              : fieldSelections["category"] || "dolibarr"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 break-all">
                        <strong>Marca:</strong> {getFinalValue("brand")}   {/*Muestra el valor final que se guardara */}
                        {pendingProduct.flags.includes("brand") && (
                          <span className="ml-2 text-xs bg-yellow-200 px-1 rounded">
                            {fieldSelections["brand"] == "none"        // texto dinamico, muestra la desicion tomada
                              ? "No se harán cambios"
                              : fieldSelections["brand"] || "dolibarr"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 break-all ">
                        <strong>Modelo:</strong> {getFinalValue("model")}   {/*Muestra el valor final que se guardara */}
                        {pendingProduct.flags.includes("model") && (
                          <span className="ml-2 text-xs bg-yellow-200 px-1 rounded">
                            {fieldSelections["model"] == "none"   // texto dinamico, muestra la desicion tomada
                              ? "No se harán cambios"
                              : fieldSelections["model"] || "dolibarr"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {/*Aclara que los otros campos (no mostrados) tambien se guardaran */}
                  <p className="text-xs text-blue-600 mt-2">
                    * Se agregarán todos los demás campos del Excel
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <Flex justify="end" className="mt-4" gap={15}>
            <Space>
              {/*Checkbox de doble revision */}
              <Checkbox
                checked={Object.values(fieldSelections).includes('none')}   // revisa si hay campos con none
                onChange={(e) => setDoubleReview(e.target.checked)}         // realiza doble revision si hay campos con none
                disabled={Object.values(fieldSelections).includes('none')}  // disabled si hay campos con none
              >
                Aplicar doble revisión
              </Checkbox>
            </Space>
            {/*Boton de guardar */}
            <Button
              type="primary"
              icon={<SaveOutlined />}
              disabled={!isFormComplete()}
              onClick={handleSaveChanges}
            >
              Guardar cambios
            </Button>
          </Flex>
        </>
      )}
    </>
  );
}