"use client";
import { MainButton } from "@/components/core/Buttons";
import { GlassCard } from "@/components/core/GlassCard";
import { MainTitle, TableText } from "@/components/core/Titulo";
import { App, Button, Col, Flex, Input, Row, Space } from "antd";
import { DinamicTable } from "@/components/core/Tables";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InputRef } from "antd";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { validateShipment } from "../actions/validateShipments";
import { useRouter } from "next/navigation";

interface Props {
  shipmentData: any;
}

export default function ShipmentReview({ shipmentData }: Props) {
  const [saleId, setSaleId] = useState<string | null>(null);
  const [iframeRef, setIframeRef] = useState<string | null>(null);
  const meliUrl = process.env.NEXT_PUBLIC_MELI_ORDERS_URL;
  const inputRef = useRef<InputRef>(null);
  const scanBuffer = useRef("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { notification } = App.useApp();

  const columns: DinamicColumnsType[] = [
    {
      title: "SKU",
      column_id: "order_items",
      type: "custom",
      render: (value, record) => {
        return (
          <>
            <TableText>
              {value[0].sku} <small>({value[0].requested_quantity})</small>{" "}
            </TableText>
          </>
        );
      },
    },
    {
      title: "# de órden",
      column_id: "sale_id",
      type: "link",
      actions: [
        {
          onPress: (record) => {
            //enviar a numero de orden en market
            if (record.sale_id) {
              window.open(
                `${process.env.NEXT_PUBLIC_MELI_ORDERS_URL}/${record.sale_id}/detalle`,
                "_blank"
              );
            }
          },
        },
      ],
    },
    {
      title: "# de envío",
      column_id: "shipment_reference",
      type: "link",
      align: "center",
      width: 150,
      actions: [
        {
          onPress: (record) => {
            //enviar a número de envío en dolibarr
            if (record.shipment_id) {
              window.open(
                `${process.env.NEXT_PUBLIC_DOLIBARR_SHIPMENT_URL}id=${record.shipment_id}`,
                "_blank"
              );
            }
          },
        },
      ],
    },
    // {
    //   title: "Stock",
    //   column_id: "stock",
    //   type: "string",
    //   width: "15%",
    // },
  ];

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      // Check if the key is 'Enter' or 'Return'
      if (event.key === "Enter" || event.key === "Return") {
        if (scanBuffer.current.length > 0) {
          console.log(scanBuffer.current, "ok");
          setSaleId(scanBuffer.current); // Set the scanned code
          setIframeRef(`${meliUrl}/${scanBuffer.current}/detalle`);
          scanBuffer.current = ""; // Clear the buffer
        }
      } else {
        const isAlphanumeric = /^[a-zA-Z0-9]$/.test(event.key);

        if (isAlphanumeric) {
          scanBuffer.current += event.key;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const review = async () => {
    console.log("review ", saleId);
    try {
      if (!saleId) {
        notification.open({
          message: "Escanea un número de órden",
          type: "error",
        });

        return;
      }

      const dt = shipmentData.find(
        (item: any) => item.sale_id == Number(saleId)
      );

      const result = await validateShipment(
        dt.shipment_id,
        dt._id,
        dt.shipment_reference
      );

      if (result) {
        notification.open({
          message: "Orden validada correctamente",
          type: "success",
        });
        clear();
        router.refresh();
      }
    } catch (error) {
      console.error("Error al validar ", error);
      notification.open({
        message: "Hubo un error al validar la órden",
        type: "error",
      });
    }
  };

  const clear = () => {
    setIframeRef(null);
    setSaleId(null);
  };

  const filterByScan = (items: any[]) =>
    saleId
      ? !saleId.trim()
        ? items
        : items.filter((item) =>
            Object.values(item).some((val) =>
              String(val).toLowerCase().includes(saleId.toLowerCase())
            )
          )
      : items;

  const displayedData = useMemo(
    () => filterByScan(shipmentData),
    [shipmentData, saleId]
  );

  return (
    <>
      <Flex vertical gap={20} style={{ height: "100%" }}>
        <MainTitle>Órdenes a enviar</MainTitle>
        <Row style={{ height: "100%" }} gutter={[20, 20]}>
          <Col xxl={10} xl={10} lg={12} md={24} sm={24} xs={24}>
            <Flex vertical gap={30}>
              <GlassCard>
                <Flex vertical gap={20} align="flex-end">
                  <Input
                    value={saleId!}
                    //onChange={(e) => setSaleId(e.target.value)}
                    ref={inputRef}
                    readOnly
                  />

                  <Space>
                    <Button onClick={() => clear()} disabled={saleId == null}>
                      Limpiar
                    </Button>
                    <MainButton
                      onPress={() => review()}
                      disabled={saleId == null}
                    >
                      Enviar
                    </MainButton>
                  </Space>
                </Flex>
              </GlassCard>

              <GlassCard>
                <DinamicTable columns={columns} dataSource={displayedData} />
              </GlassCard>
            </Flex>
          </Col>

          {iframeRef != null && (
            <Col xxl={14} xl={14} lg={12} md={24} sm={24} xs={24}>
              <div style={{ height: "100%" }}>
                <iframe src={iframeRef} height="100%" width="100%" />
              </div>
            </Col>
          )}
        </Row>
      </Flex>
    </>
  );
}
