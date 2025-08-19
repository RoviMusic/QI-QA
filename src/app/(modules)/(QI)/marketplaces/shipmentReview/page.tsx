"use client";
import { MainButton } from "@/components/core/Buttons";
import { GlassCard } from "@/components/core/GlassCard";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { Button, Col, Flex, Input, Row, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";

export default function ShipmentReview() {
  const [saleId, setSaleId] = useState<string | null>(null);
  const [iframeRef, setIframeRef] = useState<string | null>(null);
  const meliUrl = process.env.NEXT_PUBLIC_MELI_ORDERS_URL;
  const inputRef = useRef<InputRef>(null);
  const scanBuffer = useRef("");

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
  }, []);

  const review = () => {};

  const clear = () => {
    setIframeRef(null);
    setSaleId(null);
  };

  return (
    <>
      <Container>
        <Flex vertical gap={20} style={{ height: "100%" }}>
          <MainTitle>Envios revisar</MainTitle>
          <Row style={{ height: "100%" }} gutter={[20, 20]}>
            <Col xxl={8} xl={8} lg={12} md={18} sm={24} xs={24}>
              <GlassCard>
                <Flex vertical gap={20} align="flex-end">
                  <Input value={saleId!} ref={inputRef} readOnly />

                  <Space>
                    <Button
                      onClick={() => clear()}
                      disabled={saleId == null}
                    >
                      Limpiar
                    </Button>
                    <MainButton
                      onPress={() => review()}
                      disabled={saleId == null}
                    >
                      Revisar
                    </MainButton>
                  </Space>
                </Flex>
              </GlassCard>
            </Col>
            
            {iframeRef != null && (
              <Col xxl={16}>
                <div style={{ height: "100%" }}>
                  <iframe src={iframeRef} height="100%" width="100%" />
                </div>
              </Col>
            )}
          </Row>
        </Flex>
      </Container>
    </>
  );
}
