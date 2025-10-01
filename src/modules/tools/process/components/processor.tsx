"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import {
  DefaultTitle,
  LabelTitle,
  MainTitle,
  MutedSubtitle,
  TableText,
} from "@/components/core/Titulo";
import { MarketsEnmu } from "@/shared/enums/MarketEnum";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import {
  Badge,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Input,
  Modal,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
import type { DatePickerProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { GetProp } from "antd";
import dayjs, { Dayjs } from "dayjs";
import JsonView from "@uiw/react-json-view";
import tableStyles from "@/styles/Tables.module.css";
import BadgeStatus from "./badgeStatus";
import { CircleButton } from "@/components/core/Buttons";
const { Link } = Typography;

interface ProcessorProps {
  data: any[];
  activity: any;
}

export default function Processor({ data, activity }: ProcessorProps) {
  const columns: DinamicColumnsType[] = [
    {
      title: "No. de orden",
      column_id: "sale_id",
      type: "custom",
      render: (value, record) => {
        return (
          <>
            <Space>
              <Link
                onClick={() => {
                  if (record.market === MarketsEnmu.Meli && record.sale_id) {
                    window.open(
                      `${process.env.NEXT_PUBLIC_MELI_ORDERS_URL}/${record.sale_id}/detalle`,
                      "_blank"
                    );
                  }
                }}
              >
                {value}
              </Link>

              <CircleButton
                icon="Circle-Info"
                onPress={() => handleDetail(record)}
                color="#FAB627"
                tooltip="Ver información"
              />
            </Space>
          </>
        );
      },
      // type: "link",
      // actions: [
      //   {
      //     onPress: (record) => {
      //       //enviar a numero de orden en market
      //       console.log("Order details:", record);
      //       if (record.market === MarketsEnmu.Meli && record.sale_id) {
      //         window.open(
      //           `${process.env.NEXT_PUBLIC_MELI_ORDERS_URL}/${record.sale_id}/detalle`,
      //           "_blank"
      //         );
      //       }
      //     },
      //   },
      // ],
    },
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
      title: "Fecha de venta",
      column_id: "sale_date",
      type: "date",
    },
    {
      title: "Tipo de envío",
      column_id: "shipment_type",
      type: "string",
      width: 150,
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
      width: 150,
      actions: [
        {
          onPress: (record) => {
            //enviar a orden de venta en dolibarr
            console.log("Order details:", record);
            if (record.order_dolibarr_id) {
              window.open(
                `${process.env.NEXT_PUBLIC_DOLIBARR_ORDERS_URL}id=${record.order_dolibarr_id}`,
                "_blank"
              );
            }
          },
        },
      ],
    },
    {
      title: "Pack ID",
      column_id: "pack_id",
      type: "link",
      align: "center",
      width: 150,
      actions: [
        {
          onPress: (record) => {
            if (record.market === MarketsEnmu.Meli && record.pack_id) {
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
      width: 150,
      actions: [
        {
          onPress: (record) => {
            if (record.invoice_id) {
              window.open(
                `${process.env.NEXT_PUBLIC_DOLIBARR_INVOICE_URL}id=${record.invoice_id}`,
                "_blank"
              );
            }
          },
        },
      ],
    },
    {
      title: "Picking",
      column_id: "picking_ids",
      type: "custom",
      align: "center",
      width: 100,
      render: (value, record) => (
        // <TableText>{value}</TableText>
        <Link
          href={`${process.env.NEXT_PUBLIC_DOLIBARR_PICKING_URL}picking_id=${value}`}
          target="_blank"
        >
          {value}
        </Link>
      ),
      actions: [
        {
          onPress: (record) => {
            if (record.picking_ids) {
              window.open(
                `${process.env.NEXT_PUBLIC_DOLIBARR_PICKING_URL}picking_id=${record.picking_id}`,
                "_blank"
              );
            }
          },
        },
      ],
    },
    {
      title: "Número de envío",
      column_id: "shipment_reference",
      type: "link",
      align: "center",
      width: 150,
      actions: [
        {
          onPress: (record) => {
            //enviar a número de envío en dolibarr
            console.log("Tracking details:", record);
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

  const [selectedShippingTypes, setSelectedShippingTypes] = useState<string[]>(
    []
  );

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const marketMap: Record<string, string> = {
    meli: "Mercado Libre",
    amazon: "Amazon",
    wl: "Walmart",
    cop: "Coppel",
  };

  const shippingTypeMap: Record<string, string> = {
    fulfillment: "fulfillment",
    drop_off: "drop_off",
    cross_docking: "cross_docking",
    no_shipping: "Sin tipo de envío",
  };

  const filterByMarket = (items: any[]) =>
    items.filter((item) => {
      // Busca el valor (meli, amazon, etc) correspondiente al market del item
      return selectedMarkets.some((key) => item.market === marketMap[key]);
    });

  const filterByShippingType = (items: any[]) => {
    // Si no hay tipos de envío seleccionados, mostrar todos los datos
    if (selectedShippingTypes.length === 0) {
      return items;
    }

    return items.filter((item) => {
      // Verificar si "Sin tipo de envío" está seleccionado
      const includeNoShipping = selectedShippingTypes.includes("no_shipping");

      // Si el item no tiene shippingType (vacío, null, undefined)
      if (!item.shipment_type || item.shipment_type.trim() === "") {
        return includeNoShipping; // Solo incluir si "Sin tipo de envío" está seleccionado
      }

      // Para items con shippingType válido, buscar en los tipos normales (excluyendo "no-shipping")
      return selectedShippingTypes
        .filter((key) => key !== "no_shipping") // Excluir la opción especial
        .some((key) => item.shipment_type === shippingTypeMap[key]);
    });
  };

  const filterByDate = (items: any[]) => {
    if (!selectedDate) return items;

    return items.filter((item) =>
      dayjs(item.sale_date).isSame(selectedDate, "day")
    );
  };

  const filterMarket = useMemo(
    () => filterByMarket(data),
    [data, selectedMarkets]
  );

  const filterMarketAndShipping = useMemo(
    () => filterByShippingType(filterMarket),
    [filterMarket, selectedShippingTypes]
  );

  const filterMarketShippingAndDate = useMemo(
    () => filterByDate(filterMarketAndShipping),
    [filterMarketAndShipping, selectedDate]
  );

  const onChangeMarket: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("Selected markets:", checkedValues);
    if ((checkedValues as string[]).length === 0) {
      setSelectedMarkets(Object.keys(marketMap));
    } else {
      setSelectedMarkets(checkedValues as string[]);
    }
  };

  const onChangeShippingType: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    // Si no hay ninguno seleccionado, el array estará vacío y se mostrarán todos los datos
    setSelectedShippingTypes(checkedValues as string[]);
  };

  const onChangeDate: DatePickerProps["onChange"] = (date, dateString) => {
    setSelectedDate(date);
  };

  const filterBySearch = (items: any[]) =>
    !searchTerm.trim()
      ? items
      : items.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

  // Aplica ambos filtros: mercado y búsqueda
  const displayedData = useMemo(
    () => filterBySearch(filterMarketShippingAndDate),
    [filterMarketShippingAndDate, searchTerm]
  );

  const handleDetail = (data: any) => {
    //if (data.type === "errors") {
    setOpenDetail(true);
    setDataDetail(data);
    //}
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDataDetail(null);
  };

  const getRowClass = (record: any) => {
    let classColor = "";
    if (record.shipment_reference?.startsWith("NE-")) {
      return tableStyles.neRow;
    }
    switch (record.type) {
      case "processed":
        classColor = tableStyles.processedRow;
        break;

      case "pending":
        classColor = tableStyles.pendingRow;
        break;

      case "errors":
        classColor = tableStyles.errorRow;
        break;
    }
    return classColor;
  };

  return (
    <>
      <Flex gap={20} vertical>
        <Flex gap={10} align="center" justify="space-between">
          <Space>
            <MainTitle>Procesador de órdenes</MainTitle>
            <BadgeStatus status={activity.status} text={activity.text} />
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

            <Col span={24}>
              <Flex gap={10} justify="space-between">
                <Space direction="vertical">
                  <LabelTitle>Filtrar por market:</LabelTitle>
                  <Checkbox.Group
                    onChange={onChangeMarket}
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
                </Space>

                <Space direction="vertical">
                  <LabelTitle>Filtrar por envío:</LabelTitle>
                  <Checkbox.Group
                    onChange={onChangeShippingType}
                    options={[
                      {
                        value: "fulfillment",
                        label: <span>Fullfilment</span>,
                      },
                      {
                        value: "cross_docking",
                        label: <span>Cross Docking</span>,
                      },
                      {
                        value: "drop_off",
                        label: <span>Drop Off</span>,
                      },
                      {
                        value: "no_shipping",
                        label: "Sin tipo de envío",
                      },
                    ]}
                  />
                </Space>

                <Space direction="vertical">
                  <LabelTitle>Filtrar por fecha:</LabelTitle>
                  <DatePicker
                    style={{ width: "200px" }}
                    onChange={onChangeDate}
                    value={selectedDate}
                  />
                </Space>
              </Flex>
            </Col>
          </Row>
        </GlassCard>
        <GlassCard>
          <DinamicTable
            columns={columns}
            dataSource={displayedData}
            rowStyle
            getRowClass={getRowClass}
            //rowActions={{ onRowClick: handleDetail }}
          />
        </GlassCard>
      </Flex>

      <Modal
        title={
          <DefaultTitle level={4}>
            Detalle de la órden {dataDetail?.sale_id}
          </DefaultTitle>
        }
        open={openDetail}
        onCancel={handleCloseDetail}
        footer={null}
        width={800}
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

          <p className="font-bold mb-3">{dataDetail?.message}</p>

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
        </Flex>
      </Modal>
    </>
  );
}
