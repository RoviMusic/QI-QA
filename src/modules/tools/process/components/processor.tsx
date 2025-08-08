"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import {
  DefaultTitle,
  LabelTitle,
  MainTitle,
  MutedSubtitle,
} from "@/components/core/Titulo";
import { MarketsEnmu } from "@/shared/enums/MarketEnum";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import {
  Badge,
  Checkbox,
  Col,
  Flex,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import type { GetProp } from "antd";
const { Link } = Typography;

interface ProcessorProps {
  data: any[];
}

export default function Processor({ data }: ProcessorProps) {
  const columns: DinamicColumnsType[] = [
    {
      title: "No. de orden",
      column_id: "sale_id",
      type: "link",
      actions: [
        {
          onPress: (record) => {
            //enviar a numero de orden en market
            console.log("Order details:", record);
            if (record.market === MarketsEnmu.Meli) {
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
      title: "Fecha de venta",
      column_id: "sale_date",
      type: "date",
    },
    {
      title: "Tipo de envío",
      column_id: "shipment_type",
      type: "string",
    },
    {
      title: "Marketplace",
      column_id: "market",
      type: "string",
    },
    {
      title: "Orden de venta",
      column_id: "order_reference",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            //enviar a orden de venta en dolibarr
            console.log("Order details:", record);
            window.open(
              `${process.env.NEXT_PUBLIC_DOLIBARR_ORDERS_URL}id=${record.order_dolibarr_id}`,
              "_blank"
            );
          },
        },
      ],
    },
    {
      title: "Pack ID",
      column_id: "pack_id",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            if (record.market === MarketsEnmu.Meli) {
              window.open(
                `${process.env.NEXT_PUBLIC_MELI_ORDERS_URL}/${record.pack_id}/detalle`,
                "_blank"
              );
            }
          },
        },
      ],
    },
    {
      title: "Factura",
      column_id: "invoice_reference",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            window.open(
              `${process.env.NEXT_PUBLIC_DOLIBARR_INVOICE_URL}id=${record.invoice_id}`,
              "_blank"
            );
          },
        },
      ],
    },
    {
      title: "Picking",
      column_id: "picking_id",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            window.open(
              `${process.env.NEXT_PUBLIC_DOLIBARR_PICKING_URL}picking_id=${record.picking_id}`,
              "_blank"
            );
          },
        },
      ],
    },
    {
      title: "Número de envío",
      column_id: "shipment_reference",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            //enviar a número de envío en dolibarr
            console.log("Tracking details:", record);
            window.open(
              `${process.env.NEXT_PUBLIC_DOLIBARR_SHIPMENT_URL}id=${record.shipment_id}`,
              "_blank"
            );
          },
        },
      ],
    },
  ];

  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([
    "meli",
    "amazon",
    "wl",
    "cop",
  ]);

  const marketMap: Record<string, string> = {
    meli: "Mercado Libre",
    amazon: "Amazon",
    wl: "Walmart",
    cop: "Coppel",
  };

  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("Selected markets:", checkedValues);
    if ((checkedValues as string[]).length === 0) {
      setSelectedMarkets(Object.keys(marketMap));
    } else {
      setSelectedMarkets(checkedValues as string[]);
    }
  };

  const handleDetail = (data: any) => {
    if (data.type === "errors") {
      setOpenDetail(true);
      setDataDetail(data);
    }
    console.warn(data);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDataDetail(null);
  };

  return (
    <>
      <Flex gap={20} vertical>
        <Flex gap={10} align="center" justify="space-between">
          <Space>
            <MainTitle>Procesador de órdenes</MainTitle>
            <Badge status="success" text="Procesador en funcionamiento" />
          </Space>
        </Flex>
        <GlassCard>
          <Row gutter={[20, 20]} justify="space-between">
            <Col xl={10} lg={12} md={24} sm={24} xs={24}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <LabelTitle>Buscar </LabelTitle>
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
              </Space>
            </Col>

            <Col>
              <Flex vertical>
                <LabelTitle>Filtrar por:</LabelTitle>

                <Checkbox.Group
                  onChange={onChange}
                  options={[
                    {
                      value: "meli",
                      label: (
                        <span className="text-[#F2A516]">Mercado Libre</span>
                      ),
                    },
                    {
                      value: "amazon",
                      label: <span className="text-[#232F3E]">Amazon</span>,
                    },
                    {
                      value: "wl",
                      label: <span className="text-[#0071DC]">Walmart</span>,
                    },
                    {
                      value: "cop",
                      label: <span className="text-[#1C42E8]">Coppel</span>,
                    },
                  ]}
                />
              </Flex>
            </Col>
          </Row>
        </GlassCard>
        <GlassCard>
          <DinamicTable
            columns={columns}
            dataSource={data}
            rowStyle
            onRowClick={handleDetail}
          />
        </GlassCard>
      </Flex>

      <Modal
        title={<DefaultTitle level={4}>Detalle del error</DefaultTitle>}
        open={openDetail}
        onCancel={handleCloseDetail}
        footer={null}
        width={800}
      >
        <Flex vertical gap={15}>
          <Flex justify="space-between">
            <LabelTitle># órden: {dataDetail?.sale_id}</LabelTitle>
            <LabelTitle>Market: {dataDetail?.market}</LabelTitle>
          </Flex>
          <LabelTitle>Tipo de envío: {dataDetail?.shipment_type}</LabelTitle>
          <MutedSubtitle>{dataDetail?.message}</MutedSubtitle>

          <Steps
            progressDot
            size="small"
            items={[
              {
                title: "Órden de venta",
                description: (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOLIBARR_ORDERS_URL}id=${dataDetail?.order_dolibarr_id}`}
                    target="_blank"
                  >
                    {dataDetail?.order_reference}
                  </Link>
                ),
              },
              {
                title: "Factura",
                description: (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOLIBARR_INVOICE_URL}id=${dataDetail?.invoice_id}`}
                    target="_blank"
                  >
                    {dataDetail?.invoice_reference}
                  </Link>
                ),
              },
              {
                title: "Picking",
                description: (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOLIBARR_PICKING_URL}picking_id=${dataDetail?.picking_id}`}
                    target="_blank"
                  >
                    {dataDetail?.picking_id}
                  </Link>
                ),
              },
              {
                title: "Órden de compra",
                description: (
                  <Link
                    href={``}
                    target="_blank"
                  >
                    {}
                  </Link>
                ),
              },
              {
                title: "Número de envío (prov)",
                description: (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOLIBARR_SHIPMENT_URL}id=${dataDetail?.shipment_id}`}
                    target="_blank"
                  >
                    {dataDetail?.shipment_reference}
                  </Link>
                ),
              },
            ]}
          />

          
        </Flex>
      </Modal>
    </>
  );
}
