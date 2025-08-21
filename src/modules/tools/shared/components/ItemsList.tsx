"use client";
import {
  DefaultTitle,
  LabelTitle,
  MutedSubtitle,
} from "@/components/core/Titulo";
import {
  Button,
  Flex,
  List,
  Modal,
  Space,
  Steps,
  Tooltip,
  Typography,
} from "antd";
import VirtualList from "rc-virtual-list";
import { useState } from "react";
import { markets } from "../../process/components/processorDev";
import { DataProcessorType } from "../../process/types/processorTypes";
import dayjs from "dayjs";
import { getIcon } from "@/lib/utils";
import { CircleButton } from "@/components/core/Buttons";
import JsonView from "@uiw/react-json-view";
const { Link } = Typography;

type ItemsListProps = {
  title: string;
  type: "Processed" | "Error" | "Pending";
  items: DataProcessorType[];
};

export default function ItemsList({ title, items, type }: ItemsListProps) {
  const [openModalErrors, setOpenModalErrors] = useState<boolean>(false);
  const [dataError, setDataError] = useState<any | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<any | null>(null);

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
    console.warn(data);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDataDetail(null);
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

                        {type === "Pending" && (
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
        width={800}
      >
        <Flex vertical gap={20}>
          <Flex vertical gap={10}>
            <p>Market: {dataError?.market}</p>
            <p>
              Fecha de venta:{" "}
              {dayjs(dataError?.sale_date).format(
                "DD/MM/YYYY [a las] HH:mm:ss a"
              )}
            </p>
            {dataError?.shipment_type ? (
              <>
                <p>Tipo de envío: {dataError?.shipment_type}</p>
              </>
            ) : (
              <>
                <Space>
                  <p>Tipo de envío:</p>
                  <MutedSubtitle>Sin dato</MutedSubtitle>
                </Space>
              </>
            )}
          </Flex>

          <p className="text-red-400 mb-3">{dataError?.message}</p>

          <Steps
            progressDot
            size="small"
            current={-1}
            items={[
              {
                title: "Órden de venta",
                description: (
                  <>
                    {dataError?.order_reference ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_ORDERS_URL}id=${dataError?.order_dolibarr_id}`}
                          target="_blank"
                        >
                          {dataError?.order_reference}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
              {
                title: "Factura",
                description: (
                  <>
                    {dataError?.invoice_reference ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_INVOICE_URL}id=${dataError?.invoice_id}`}
                          target="_blank"
                        >
                          {dataError?.invoice_reference}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
              {
                title: "Picking",
                description: (
                  <>
                    {dataError?.picking_id ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_PICKING_URL}picking_id=${dataError?.picking_id}`}
                          target="_blank"
                        >
                          {dataError?.picking_id}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
              {
                title: "Órden de compra",
                description: (
                  <Link href={``} target="_blank">
                    {}
                  </Link>
                ),
              },
              {
                title: "Número de envío (prov)",
                description: (
                  <>
                    {dataError?.shipment_reference ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_SHIPMENT_URL}id=${dataError?.shipment_id}`}
                          target="_blank"
                        >
                          {dataError?.shipment_reference}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
            ]}
          />
          {dataError?.order && (
            <>
              <DefaultTitle>Detalle técnico:</DefaultTitle>
              <JsonView
                value={dataError?.order}
                collapsed={1}
                displayDataTypes={false}
              />
            </>
          )}
        </Flex>
      </Modal>

      <Modal
        title={<DefaultTitle level={4}>Detalles</DefaultTitle>}
        open={openDetail}
        onCancel={handleCloseDetail}
        width={800}
        footer={null}
      >
        <Flex vertical gap={20}>
          <Flex vertical gap={10}>
            <p>Market: {dataDetail?.market}</p>
            <p>
              Fecha de venta:{" "}
              {dayjs(dataDetail?.sale_date).format(
                "DD/MM/YYYY [a las] HH:mm:ss a"
              )}
            </p>
            {dataDetail?.shipment_type ? (
              <>
                <p>Tipo de envío: {dataDetail?.shipment_type}</p>
              </>
            ) : (
              <>
                <Space>
                  <p>Tipo de envío:</p>
                  <MutedSubtitle>Sin dato</MutedSubtitle>
                </Space>
              </>
            )}
          </Flex>

          <p className="text-red-400 mb-3">{dataDetail?.message}</p>

          <Steps
            progressDot
            size="small"
            current={-1}
            items={[
              {
                title: "Órden de venta",
                description: (
                  <>
                    {dataDetail?.order_reference ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_ORDERS_URL}id=${dataDetail?.order_dolibarr_id}`}
                          target="_blank"
                        >
                          {dataDetail?.order_reference}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
              {
                title: "Factura",
                description: (
                  <>
                    {dataDetail?.invoice_reference ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_INVOICE_URL}id=${dataDetail?.invoice_id}`}
                          target="_blank"
                        >
                          {dataDetail?.invoice_reference}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
              {
                title: "Picking",
                description: (
                  <>
                    {dataDetail?.picking_id ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_PICKING_URL}picking_id=${dataDetail?.picking_id}`}
                          target="_blank"
                        >
                          {dataDetail?.picking_id}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
              {
                title: "Órden de compra",
                description: (
                  <Link href={``} target="_blank">
                    {}
                  </Link>
                ),
              },
              {
                title: "Número de envío (prov)",
                description: (
                  <>
                    {dataDetail?.shipment_reference ? (
                      <>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_DOLIBARR_SHIPMENT_URL}id=${dataDetail?.shipment_id}`}
                          target="_blank"
                        >
                          {dataDetail?.shipment_reference}
                        </Link>
                      </>
                    ) : (
                      <>
                        <MutedSubtitle>Sin dato</MutedSubtitle>
                      </>
                    )}
                  </>
                ),
              },
            ]}
          />
          <DefaultTitle>Detalle técnico:</DefaultTitle>
          <JsonView value={dataDetail} collapsed={1} displayDataTypes={false} />
          {/* {dataDetail?.order && (
            <>
            </>
          )} */}
        </Flex>
      </Modal>
    </>
  );
}
