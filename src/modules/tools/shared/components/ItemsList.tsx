"use client";
import {
  DefaultTitle,
  LabelTitle,
  MutedSubtitle,
  Subtitle,
} from "@/components/core/Titulo";
import { Button, Flex, List, Modal, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import VirtualList from "rc-virtual-list";
import { useState } from "react";
import { markets } from "../../process/components/processorDev";
import { DataProcessorType } from "../../process/types/processorTypes";
import dayjs from "dayjs";
import { getIcon } from "@/lib/utils";
const { Link } = Typography;

type ItemsListProps = {
  title: string;
  type: "Processed" | "Error" | "Pending";
  items: DataProcessorType[];
};

// ml: #FFE600 wl #0071DC copp #1C42E8 ama #F3A847

export default function ItemsList({ title, items, type }: ItemsListProps) {
  const [openModalErrors, setOpenModalErrors] = useState<boolean>(false);
  const [dataError, setDataError] = useState<DataProcessorType | null>(null);

  const handleModalError = (data: DataProcessorType) => {
    setOpenModalErrors(true);
    setDataError(data);
    console.log("data error ", data);
  };

  const handleCloseModal = () => {
    setOpenModalErrors(false);
    setDataError(null);
  };

  const getColor = (market: markets) => {
    let color = "#000";
    switch (market) {
      case "Amazon":
        color = "#232F3E";
        break;
      case "Coppel":
        color = "#1C42E8";
        break;
      case "Mercado Libre":
        color = "#F2A516";
        break;
      case "Walmart":
        color = "#0071DC";
        break;
    }

    return color;
  };

  const handleClickOC = (market: markets) => {
    switch (market) {
      case "Amazon":
        window.open(process.env.NEXT_PUBLIC_AMAZON_ORDERS_URL, '_blank')
        break;
      case "Mercado Libre":
        window.open(process.env.NEXT_PUBLIC_MELI_ORDERS_URL, "_blank");
        break;
      case "Coppel":
        break;
      case "Walmart":
        break;
    }
  };

  return (
    <>
      <Flex vertical gap={12}>
        <Space>
          <DefaultTitle
            level={4}
            style={{
              color:
                type == "Processed"
                  ? "green"
                  : type == "Pending"
                  ? "gray"
                  : "red",
            }}
          >
            {items.length} {title}
          </DefaultTitle>
        </Space>
        <List>
          <VirtualList
            data={items}
            height={450}
            itemHeight={47}
            itemKey={(item: DataProcessorType) => items.indexOf(item)}
          >
            {(item: DataProcessorType, index: number) => (
              <List.Item key={index}>
                <Flex
                  style={{ width: "100%" }}
                  justify="space-between"
                  align="center"
                  gap={20}
                >
                  <Flex vertical>
                    <DefaultTitle
                      style={{ color: getColor(item.market as markets) }}
                    >
                      Número de orden:{" "}
                      <span onClick={() => handleClickOC(item.market!)} className="hover:cursor-pointer hover:underline">
                        {item.sale_id} de {item.market}
                      </span>
                    </DefaultTitle>
                    <Space direction="vertical">
                      {item.order_reference && (
                        <Space>
                          <strong>Órden de venta:</strong>
                          <Link
                            href={process.env.NEXT_PUBLIC_DOLIBARR_ORDERS_URL}
                            target="_blank"
                          >
                            {item.order_reference}
                          </Link>
                        </Space>
                      )}

                      {type === "Error" && (
                        <>
                          <Button
                            icon={getIcon("Circle-Info")}
                            type="text"
                            onClick={() => handleModalError(item)}
                            style={{ color: "red" }}
                          >
                            Ver detalle
                          </Button>
                        </>
                      )}
                    </Space>
                  </Flex>

                  <Flex vertical wrap>
                    <MutedSubtitle>Fecha de venta:</MutedSubtitle>
                    <MutedSubtitle>
                      {dayjs(item.sale_date).format(
                        "HH:mm:ss [del] DD/MM/YYYY"
                      )}
                    </MutedSubtitle>
                  </Flex>
                </Flex>
              </List.Item>
            )}
          </VirtualList>
        </List>
      </Flex>

      <Modal
        title={<DefaultTitle level={4}>🚨Detalle del error🚨</DefaultTitle>}
        open={openModalErrors}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Flex vertical gap={10}>
          <Flex justify="space-between">
            <DefaultTitle>Número de órden: {dataError?.sale_id}</DefaultTitle>
            <DefaultTitle style={{ margin: 0 }}>
              Market: {dataError?.market}
            </DefaultTitle>
          </Flex>
          <MutedSubtitle>
            Fecha de venta:{" "}
            {dayjs(dataError?.sale_date).format("HH:mm:ss [del] DD/MM/YYYY")}
          </MutedSubtitle>

          <Space direction="vertical">
            <LabelTitle>Mensaje del error:</LabelTitle>
            <p>{dataError?.message}</p>
          </Space>

          <LabelTitle>Detalles:</LabelTitle>
        </Flex>
      </Modal>
    </>
  );
}
