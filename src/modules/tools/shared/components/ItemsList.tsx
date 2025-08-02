"use client";
import {
  DefaultTitle,
  LabelTitle,
  MutedSubtitle,
  Subtitle,
} from "@/components/core/Titulo";
import { Flex, List, Modal, Space } from "antd";
import { useRouter } from "next/navigation";
import VirtualList from "rc-virtual-list";
import { useState } from "react";
import { markets } from "../../process/components/processorDev";
import { DataProcessorType } from "../../process/types/processorTypes";
import dayjs from "dayjs";

type ItemsListProps = {
  title: string;
  type: "Processed" | "Error" | "Pending";
  items: DataProcessorType[];
};

// ml: #FFE600 wl #0071DC copp #1C42E8 ama #F3A847

export default function ItemsList({ title, items, type }: ItemsListProps) {
  const [openModalErrors, setOpenModalErrors] = useState<boolean>(false);
  const [dataError, setDataError] = useState<DataProcessorType | null>(null);

  const handleClick = (data: DataProcessorType) => {
    switch (type) {
      case "Processed":
        window.open("http://192.168.0.234/rovimusic/", "_blank");
        break;

      case "Error":
        //open modal
        setOpenModalErrors(true);
        setDataError(data);
        console.log('data error ', data)
        break;

      case "Pending":
        //idk
        break;
    }
  };

  const handleCloseModal = () => {
    setOpenModalErrors(false);
    setDataError(null);
  };

  const getColor = (market: markets) => {
    let color = "#000";
    switch (market) {
      case "Amazon":
        color = "#F3A847";
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
            itemKey="sale_id"
          >
            {(item: DataProcessorType) => (
              <List.Item
                key={item.sale_id}
                className="hover:cursor-pointer hover:bg-gray-300"
                onClick={() => handleClick(item)}
              >
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
                      Número de orden: {item.sale_id} de {item.market}
                    </DefaultTitle>
                    <Space direction="vertical">
                      {item.order_reference && (
                        <Space>
                          <strong>Órden de venta:</strong>
                          <p>{item.order_reference}</p>
                        </Space>
                      )}
                      <p>{item.message}</p>
                    </Space>
                  </Flex>

                  <Flex vertical wrap>
                    <MutedSubtitle>Fecha de venta:</MutedSubtitle>
                    <MutedSubtitle>
                      {dayjs(item.sale_date).format("DD/MM/YYYY")}
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
            Intento de procesamiento a las{" "}
            {dayjs(dataError?.sale_date).format("HH:mm:s [del] DD/MM/YYYY")}
          </MutedSubtitle>
          <p>{dataError?.message}</p>
        </Flex>
      </Modal>
    </>
  );
}
