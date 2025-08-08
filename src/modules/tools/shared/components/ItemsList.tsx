"use client";
import {
  DefaultTitle,
  LabelTitle,
  MutedSubtitle,
} from "@/components/core/Titulo";
import { Button, Flex, List, Modal, Space, Steps, Tooltip, Typography } from "antd";
import VirtualList from "rc-virtual-list";
import { useState } from "react";
import { markets } from "../../process/components/processorDev";
import { DataProcessorType } from "../../process/types/processorTypes";
import dayjs from "dayjs";
import { getIcon } from "@/lib/utils";
import { CircleButton } from "@/components/core/Buttons";
const { Link } = Typography;

type ItemsListProps = {
  title: string;
  type: "Processed" | "Error" | "Pending";
  items: DataProcessorType[];
};

export default function ItemsList({ title, items, type }: ItemsListProps) {
  const [openModalErrors, setOpenModalErrors] = useState<boolean>(false);
  const [dataError, setDataError] = useState<DataProcessorType | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<any | null>(null)

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
        window.open(process.env.NEXT_PUBLIC_AMAZON_ORDERS_URL, "_blank");
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

  const handleDetail = (data: DataProcessorType) => {
    setOpenDetail(true);
    setDataDetail(data);
    console.warn(data)
  };

  const handleCloseDetail = () => {
    setOpenDetail(false)
    setDataDetail(null)
  }

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
                <Tooltip>
                  <Flex
                    style={{ width: "100%" }}
                    justify="space-between"
                    align="center"
                    gap={20}
                    //className="hover:cursor-pointer hover:bg-neutral-200"
                  >
                    <Flex vertical>
                      {item.sale_id ? (
                        <>
                          <DefaultTitle
                            style={{ color: getColor(item.market as markets) }}
                          >
                            # órden:{" "}
                            <span
                              onClick={() => handleClickOC(item.market!)}
                              className="hover:cursor-pointer hover:underline"
                            >
                              {item.sale_id}
                            </span>
                          </DefaultTitle>
                        </>
                      ) : (
                        <>
                          <DefaultTitle
                            style={{ color: getColor(item.market as markets) }}
                          >
                            Sin número de órden
                          </DefaultTitle>
                        </>
                      )}

                      {item.shipment_type && (
                        <>
                          <Space>
                            <strong>Tipo de envío:</strong>
                            <p>{item.shipment_type.toUpperCase()}</p>
                          </Space>
                        </>
                      )}

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
                            <CircleButton
                              icon={"Triangle-Exclamation"}
                              onPress={() => handleModalError(item)}
                              color="red"
                              tooltip="Ver detalle del error"
                            />
                          </>
                        )}

                        {type === "Processed" && (
                          <>
                            <CircleButton
                              onPress={() => handleDetail(item)}
                              icon="Eye"
                              tooltip="Ver detalle"
                              color="#FAB627"
                            />
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
                </Tooltip>
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

      <Modal
        title={<DefaultTitle level={4}>Detalles</DefaultTitle>}
        open={openDetail}
        onCancel={handleCloseDetail}
        footer={null}
      >
        <Flex vertical gap={10}>
          <Steps progressDot direction="vertical" items={[
            {
              title: 'Órden de venta'
            },
            {
              title: 'Factura'
            },
            {
              title: 'Picking'
            },
            {
              title: 'Órden de compra'
            },
            {
              title: 'Número de envío (prov)'
            }
          ]}/>
        </Flex>
      </Modal>
    </>
  );
}
