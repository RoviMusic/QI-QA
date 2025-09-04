"use client";
import {
  BarcodeData,
  BarcodeFullData,
  GetBarcodeData,
  GetBarcodeFull,
  UpdatePicking,
} from "@/modules/barcodes/services/barcodeService";
import Barcode from "react-barcode";
import { use, useEffect, useState } from "react";
import { Flex, Space } from "antd";
import dayjs from "dayjs";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; fk_product: string }>;
}) {
  const { id, fk_product } = use(params);

  const [barcodeValue, setBarcodeValue] = useState<string>("");
  const [data, setData] = useState<BarcodeFullData | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    const res = await GetBarcodeFull(id, fk_product);
    console.log("res full", res);
    const updates = await UpdatePicking(id, fk_product);
    console.log("updates", updates);
    // if (res && res.length > 0) {
    //   setBarcodeValue(res[0].id);
    //   setData(res[0]);
    // }
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
          </>
        ) : (
          <p>Cargando código de barras...</p>
        )}
      </div>
    </>
  );
}
