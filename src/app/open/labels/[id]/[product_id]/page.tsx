"use client";
import {
  BarcodeData,
  GetBarcodeData,
} from "@/modules/barcodes/services/barcodeService";
import Barcode from "react-barcode";
import { use, useEffect, useState } from "react";
import { Flex, Space } from "antd";
import { WarehouseEnum, WarehouseType } from "@/shared/enums/WarehouseEnum";
import dayjs from "dayjs";

const warehouseNames: { [key: number]: { name: string } } = {
  1: { name: "Cedis" },
  12: { name: "ML" },
};

export default function Page({
  params,
}: {
  params: Promise<{ id: string; product_id: string }>;
}) {
  const { id, product_id } = use(params);

  const [barcodeValue, setBarcodeValue] = useState<string>("");
  const [data, setData] = useState<BarcodeData | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    const res = await GetBarcodeData(id, product_id);
    console.log("res ", res);
    if (res && res.length > 0) {
      setBarcodeValue(res[0].id);
      setData(res[0]);
    }
  }

  return (
    <>
      <div
        style={{
          width: "300px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {barcodeValue && data ? (
          <>
            <Barcode value={barcodeValue} lineColor="black" />
            <hr />
            <Flex gap={10} wrap="wrap" justify="center">
              <Space direction="vertical" size="small">
                <span>Origen</span>
                <div
                  style={{ background: "#000", color: "#fff", padding: "5px" }}
                >
                  {warehouseNames[data?.source]?.name}
                </div>
              </Space>

              <Space direction="vertical" size="small">
                <span>Destino</span>
                <div
                  style={{ background: "#000", color: "#fff", padding: "5px" }}
                >
                  {warehouseNames[data?.dest]?.name}
                </div>
              </Space>

              <Space direction="vertical" size="small">
                <span>SKU</span>
                <div
                  style={{ background: "#000", color: "#fff", padding: "5px" }}
                >
                  {data?.sku}
                </div>
              </Space>

              <Space direction="vertical" size="small">
                <span>Cant.</span>
                <div
                  style={{ background: "#000", color: "#fff", padding: "5px" }}
                >
                  {data?.qty}
                </div>
              </Space>
            </Flex>
            <hr />
            <Flex vertical style={{ marginTop: "10px" }}>
              <Space size="large">
                <span>Validado:</span>
                <code>{data?.username}</code>
              </Space>
              <Space size="large">
                <span>Fecha:</span>
                <code>{dayjs().format("DD/MM/YYYY HH:mm")}</code>
              </Space>

              <Space size="large">
                <span>Picking:</span>
                <code>{id}</code>
              </Space>
            </Flex>
          </>
        ) : (
          <p>Cargando código de barras...</p>
        )}
      </div>
    </>
  );
}
