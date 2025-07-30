"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { DefaultTitle, LabelTitle, MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import ItemsList from "@/modules/tools/shared/components/ItemsList";
import { LogisticTypeEnum } from "@/shared/enums/LogisticTypeEnum";
import { MarketsType } from "@/shared/enums/MarketEnum";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Badge, Col, Flex, Modal, Radio, Row, Space } from "antd";
import dayjs from "dayjs";

type DataProcessorType = {
  order_number: string;
  shipping_type: LogisticTypeEnum;
  marketplace: MarketsType;
  sku: string | string[];
  admin_orders: {
    oc: string;
    invoice: string;
    ov?: string | string[];
  };
  picking_Status: PickingStatusType[];
  tracking_number: string;
};

type PickingStatusType = {
  sku: string;
  merchandise_receipt: string;
  pending_validation: string;
  pending_receipt: string;
  received: string;
};

export default function Processor() {
  const columnsDummy: DinamicColumnsType[] = [
    {
      title: "No. de orden",
      column_id: "order_number",
      type: "link",
      actions: [
        {
          onPress: (record) => {
            //enviar a numero de orden en dolibarr
            console.log("Order details:", record);
          },
        },
      ],
    },
    {
      title: "Tipo de envío",
      column_id: "shipping_type",
      type: "string",
    },
    {
      title: "Marketplace",
      column_id: "marketplace",
      type: "string",
    },
    {
      title: "Orden de venta/Factura",
      column_id: "admin_orders",
      type: "link",
      align: "center",
      // actions: [
      //   {
      //     onPress: (record) => {
      //       //enviar a orden de venta en dolibarr
      //       console.log("Order details:", record);
      //     },
      //   },
      // ],
    },
    {
      title: "Picking",
      column_id: "picking_Status",
      type: "link",
      align: "center",
      // actions: [
      //   {
      //     onPress: (record) => {
      //       //enviar a picking en dolibarr
      //       console.log("Picking details:", record);
      //     },
      //   },
      // ],
    },
    {
      title: "Número de envío",
      column_id: "tracking_number",
      type: "link",
      align: "center",
      actions: [
        {
          onPress: (record) => {
            //enviar a número de envío en dolibarr
            console.log("Tracking details:", record);
          },
        },
      ],
    },
  ];

  const dataDummy: DataProcessorType[] = [
    {
      order_number: "123456",
      shipping_type: LogisticTypeEnum.CS,
      marketplace: "Meli",
      sku: "SKU-123456",
      admin_orders: {
        oc: "OC-123456",
        invoice: "INV-123456",
      },
      picking_Status: [
        {
          sku: "SKU-123456",
          merchandise_receipt: "Pick-123",
          pending_validation: "Pend-123",
          pending_receipt: "Pend-Rec-123",
          received: "Rec-123",
        },
      ],
      tracking_number: "TRACK-123456",
    },
    {
      order_number: "5467596",
      shipping_type: LogisticTypeEnum.CD,
      marketplace: "Meli",
      sku: "SKU-123456",
      admin_orders: {
        oc: "OC-123456",
        invoice: "INV-123456",
        ov: "OV-123456",
      },
      picking_Status: [
        {
          sku: "SKU-123456",
          merchandise_receipt: "Pick-123",
          pending_validation: "Pend-123",
          pending_receipt: "Pend-Rec-123",
          received: "Rec-123",
        },
      ],
      tracking_number: "TRACK-123456",
    },
    {
      order_number: "573392028",
      shipping_type: LogisticTypeEnum.CS,
      marketplace: "Meli",
      sku: ["SKU-123456", "SKU-654321"],
      admin_orders: {
        oc: "OC-123456",
        invoice: "INV-123456",
      },
      picking_Status: [
        {
          sku: "SKU-123456",
          merchandise_receipt: "Pick-123",
          pending_validation: "Pend-123",
          pending_receipt: "Pend-Rec-123",
          received: "Rec-123",
        },
        {
          sku: "SKU-654321",
          merchandise_receipt: "Pick-123",
          pending_validation: "Pend-123",
          pending_receipt: "Pend-Rec-123",
          received: "Rec-123",
        },
      ],
      tracking_number: "TRACK-123456",
    },
  ];

  return (
    <>
      <Flex gap={20} vertical>
        <Flex gap={10} align="center" justify="space-between">
          <Space>
            <MainTitle>Procesador de órdenes</MainTitle>
            <Badge status="success" text="Procesador en funcionamiento" />
          </Space>

          <GlassCard>
            <Flex vertical>
              <LabelTitle>Filtrar por:</LabelTitle>

              <Radio.Group
                options={[
                  { value: "meli", label: "Mercado Libre" },
                  { value: "ama", label: "Amazon" },
                  { value: "wl", label: "Walmart" },
                  { value: "cop", label: "Coppel" },
                ]}
              />
            </Flex>
          </GlassCard>
        </Flex>
        <GlassCard>
          <DinamicTable columns={columnsDummy} dataSource={dataDummy} />
        </GlassCard>
      </Flex>
    </>
  );
}
