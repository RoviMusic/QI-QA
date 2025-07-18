/*
Main page for marketplace reports
includes components for 'gross sales', 'units sold', 'average price', etc
selected by time periods, with extension to other types of filters
*/

/*
pagina principal de los reportes para los marketplaces
incluye los componentes de 'ventas brutas' 'unidades vendidas' 'precio promedio', etc
seleccionados por periodos de tiempo, con extension a otros tipos de filtros
*/
"use client";
import {
  DefaultTitle,
  LabelTitle,
  MutedSubtitle,
} from "@/components/core/Titulo";
import AveragePriceCard from "@/modules/analytics/marketReports/components/AveragePriceCard";
import DowntrendingProductsCard from "@/modules/analytics/marketReports/components/DowntrendingProductsCard";
import GrossSalesCard from "@/modules/analytics/marketReports/components/GrossSalesCard";
import SoldUnitsCard from "@/modules/analytics/marketReports/components/SoldUnitsCard";
import TopProductsCard from "@/modules/analytics/marketReports/components/TopProductsCard";
import { ValueType } from "@/shared/types/sharedTypes";
import { Col, DatePicker, Flex, Row, Segmented, Space } from "antd";
import { useTranslations } from "next-intl";
import type { TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

export default function MarketReportsPage() {
  const t = useTranslations("Analytics");

  //provisional, database should be consulted for the markets we handle
  //provisional, se debera consultar a base de datos los markets que manejamos
  const markets: ValueType[] = [
    { value: "all", label: "Todos" },
    { value: "meli", label: "Mercado Libre" },
    { value: "ama", label: "Amazon" },
    { value: "cop", label: "Coppel" },
    { value: "wal", label: "Walmart" },
  ];

  //provisional, database should be consulted (or enum, pending validation of where this information will be stored) for the shipping types we handle
  //provisional, se debera consultar a base de datos (o enum, pendiente validar donde se guardara esta informacion) los tipos de envios que manejamos
  const shippingMode: ValueType[] = [
    { value: "all", label: "General" },
    { value: "f", label: "Full" },
    { value: "ds", label: "DropShipping" },
  ];

  //provisional, these date ranges were used to test the component, the periods should be defined
  //provisional, se utilizaron estos rangos de fechas para probar el componente, se deben definir los periodos a consultar
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  return (
    <>
      <Flex vertical gap={20}>
        <Flex justify="space-between">
          <Space direction="vertical">
            <DefaultTitle level={3} style={{ fontWeight: 400 }}>
              {t("marketReports.title")}
            </DefaultTitle>
            <MutedSubtitle>{t("marketReports.subtitle")}</MutedSubtitle>
          </Space>

          {/* date ranges selector ------- selector de rango de fechas */}
          <Space direction="vertical">
            <LabelTitle>{t("marketReports.reportingPeriod")}</LabelTitle>
            <RangePicker presets={rangePresets} />
          </Space>

          {/* shipping types selector ------- selector de tipos de envio */}
          <Space direction="vertical">
            <Segmented options={markets} />
            <Flex justify="end">
              <Segmented options={shippingMode} />
            </Flex>
          </Space>
        </Flex>

        <Row gutter={[16, 16]}>
          <Col xxl={8}>
            <GrossSalesCard />
          </Col>
          <Col xxl={8}>
            <SoldUnitsCard />
          </Col>
          <Col xxl={8}>
            <AveragePriceCard />
          </Col>
          <Col xxl={24}>
            <TopProductsCard />
          </Col>
          <Col xxl={24}>
            <DowntrendingProductsCard />
          </Col>
        </Row>
      </Flex>
    </>
  );
}
