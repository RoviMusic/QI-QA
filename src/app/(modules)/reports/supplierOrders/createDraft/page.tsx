"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DefaultTitle, MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { OutputMessage } from "@/modules/reports/types/XMLTypes";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import { Flex, Input, Radio, Tabs, Button, Alert, Space, List } from "antd";
import { useState } from "react";
// import type { TabsProps } from "antd";

export default function CreateDraftPage() {
  const [selectedTab, setSelectedTab] = useState<number>(1); // Variable de estado para los tabs
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Variable de estado para la seleccion de archivo
  const [loading, setLoading] = useState<boolean>(false); // Variable de estado para boton de procesar archivo
  const [message, setMessage] = useState<string>(""); // Variable de estado para mostrar mensaje
  const [error, setError] = useState<string>(""); // Variable de estado para mostrar error

  const [outputMessage, setOutputMessage] = useState<OutputMessage>();

  // Funcion que detecta el archivo que el usuario selecciona
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Accede a la lista de archivos seleccionados, toma el primero, si no hay se asinga null
    setSelectedFile(file); // guarda el archivo en el estado selectedFile
    setMessage(""); // Limpia cualquier mensaje previo
    setError(""); // Limpia cualquier mensaje de error previo
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Porfavor seleccione un archivo XML");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const endpoint =
        selectedTab === 1
          ? `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/read_xml`
          : `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/reports/read_xml_adenda`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      // const result = await response.text();

      // if (!response.ok) {
      //   throw new Error(result);
      // }

      const result: OutputMessage = await response.json();
      console.log("result: ", result);
      setOutputMessage(result);

      //setMessage(result);
    } catch (err: any) {
      setError(err.message || "Error al procesar el archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Crear borrador</MainTitle>

          <GlassCard>
            <Flex vertical gap={16}>
              <Radio.Group
                name="draft"
                //defaultValue={1}
                value={selectedTab}
                onChange={(e: any) => setSelectedTab(e.target.value)}
                options={[
                  { value: 1, label: "General" },
                  { value: 2, label: "Addenda" },
                ]}
              />
            </Flex>

            <Flex vertical gap={8}>
              <Input
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                disabled={loading}
                allowClear
                placeholder="Selecciona un archivo xml"
              />
              <small>
                El pedido se procesará, siempre y cuando todos los productos
                existan en dolibarr.
              </small>
            </Flex>

            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              loading={loading}
            >
              {loading ? "Procesando..." : "Procesar"}
            </Button>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
              />
            )}

            {message && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  border: "1px solid #d9d9d9",
                  borderRadius: 6,
                  background: "#fff",
                }}
                dangerouslySetInnerHTML={{ __html: message }}
              />
            )}

            {outputMessage && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  border: "1px solid #d9d9d9",
                  borderRadius: 6,
                  background:
                    outputMessage.type === "success"
                      ? "#F6FFED"
                      : outputMessage.type === "error"
                      ? "#FFF2F0"
                      : "#FFFBE6",
                }}
              >
                <Flex vertical gap={10}>
                  <DefaultTitle>Resultados del proceso:</DefaultTitle>
                  <Space>
                    <p>
                      {outputMessage.type == "error" ? (
                        <CloseCircleFilled color="red" />
                      ) : outputMessage.type == "success" ? (
                        <CheckCircleFilled color="green" />
                      ) : (
                        <WarningFilled color="yellow" />
                      )}
                    </p>
                    <p>{outputMessage.message}</p>
                  </Space>
                  <Flex gap={10} wrap>
                    <Space>
                      <b>Proveedor: </b>
                      <p>{outputMessage.supplier}</p>
                    </Space>
                    <Space>
                      <b>RFC: </b>
                      <p>{outputMessage.rfc}</p>
                    </Space>
                    <Space>
                      <b>Folio: </b>
                      <p>{outputMessage.invoice_number}</p>
                    </Space>
                  </Flex>
                  {outputMessage.products && (
                    <>
                      <DefaultTitle>Listado de productos:</DefaultTitle>
                      <List>
                        {outputMessage.products?.map((item, index) => (
                          <List.Item key={index}>
                            <Flex vertical gap={5}>
                              <h4>{item.description}</h4>
                              <Flex gap={10} wrap>
                                <Space>
                                  <b>SKU: </b>
                                  <p>{item.sku}</p>
                                </Space>
                                <Space>
                                  <b>Cantidad: </b>
                                  <p>{item.quantity}</p>
                                </Space>
                                <Space>
                                  {item.exists ? (
                                    <CheckCircleFilled color="green" />
                                  ) : (
                                    <>
                                      <b style={{ color: "red" }}>No existe</b>
                                    </>
                                  )}
                                </Space>
                              </Flex>
                            </Flex>
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}
                </Flex>
              </div>
            )}
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
