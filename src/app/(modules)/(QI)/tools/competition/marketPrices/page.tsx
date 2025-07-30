"use client";
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Flex,
  Grid,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  CompetenciaType,
  data,
  dataCompetencia,
  dataDetalles,
  DataType,
  DetallesType,
} from "./dataDummy";
import Link from "next/link";
//import styles from "@/styles/modulos/competencia/Competencia.module.css";
import type { TabsProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { formattedPriceNormalized } from "@/lib/formattedPrice";
import Container from "@/components/layout/Container";
const { Title, Text } = Typography;

export default function CompetenciaPage() {
  const getInitialWidth = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [width, setWidth] = useState<number>(getInitialWidth);
  const columns: TableColumnsType<DataType> = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 200,
    },
    {
      title: "Producto",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Estatus",
      dataIndex: "estatus",
      key: "estatus",
      width: 100,
      align: "center",
      render: (estatus) => {
        return (
          <Tag color={estatus === "Activo" ? "green" : "red"}>{estatus}</Tag>
        );
      },
    },
    {
      title: "Ventas",
      dataIndex: "ventas",
      key: "ventas",
      width: 100,
      align: "center",
    },
    {
      title: "Filtro",
      width: 80,
      align: "center",
      render: (_, record) => (
        <>
          <Tooltip title="Ver filtro">
            <Link href={`/competencia/filtro/${record.sku}`}>
              <Button
                shape="circle"
                icon={<FontAwesomeIcon icon={faFilter} />}
                type="default"
              />
            </Link>
          </Tooltip>
        </>
      ),
    },
    // {
    //   title: "Ver detalle",
    //   width: 100,
    //   align: "center",
    //   render: (_, record) => (
    //     <>
    //       <Tooltip title="Ver detalle">
    //         <Button
    //           onClick={() => setIsOpenModal(true)}
    //           shape="circle"
    //           icon={<FontAwesomeIcon icon={faEye} />}
    //           type="default"
    //         />
    //       </Tooltip>
    //     </>
    //   ),
    // },
  ];

  const columnsCompetencia: TableColumnsType<CompetenciaType> = [
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      width: 80,
      align: "center",
      render: (precio) => <span>{formattedPriceNormalized(precio)}</span>,
    },
    {
      title: "Vendedor",
      dataIndex: "vendedor",
      key: "vendedor",
      width: width < 768 ? 100 : 200,
      render: (vendedor) => <Link href="#">{vendedor}</Link>,
    },
    {
      title: "Vendidos",
      dataIndex: "cantidadVentas",
      key: "cantidadVentas",
      width: 100,
      align: "center",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
      width: width < 768 ? 200 : 250,
      render: (titulo) => <Link href="#">{titulo}</Link>,
    },
  ];

  const columnsDetalles: TableColumnsType<DetallesType> = [
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      align: "center",
      render: (precio) => (
        <>
          <Input
            type="number"
            defaultValue={precio}
            style={{ width: 100, fontSize: 10 }}
            addonBefore="$"
            size="small"
            variant="underlined"
          />
        </>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (id) => <Link href="#">{id}</Link>,
    },
    {
      title: "Margen",
      dataIndex: "margen",
      key: "margen",
      align: "center",
      render: (margen) => <span>{margen}%</span>,
    },
    {
      title: "Ganancia",
      dataIndex: "ganancia",
      key: "ganancia",
      align: "center",
      render: (ganancia) => <span>{formattedPriceNormalized(ganancia)}</span>,
    },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      align: "center",
      render: (actual) => <span>{formattedPriceNormalized(actual)}</span>,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    
  ];

  const TableDetalle = (
    <Table
      columns={columnsDetalles}
      dataSource={dataDetalles}
      bordered
      pagination={false}
      size="small"
      scroll={{ x: 200 }}
    />
  );

  const TableCompetencia = (
    <Table
      columns={columnsCompetencia}
      dataSource={dataCompetencia}
      bordered
      pagination={false}
      size="small"
      scroll={{ x: 200 }}
    />
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Full clásica cliente",
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              {TableDetalle}
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              {TableCompetencia}
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      label: "Dropoff clásica cliente",
      children: (
        <>
          <Flex vertical gap={20}>
            {TableDetalle}
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={5}>Competencia</Title>
              {TableCompetencia}
            </Space>
          </Flex>
        </>
      ),
    },
    {
      key: "3",
      label: "Full clásica cliente",
      children: (
        <>
          <Flex vertical gap={20}>
            {TableDetalle}
            <Collapse
              items={[
                {
                  id: "1",
                  label: <Title level={5}>Competencia</Title>,
                  children: TableCompetencia,
                  key: "1",
                },
              ]}
              bordered={false}
              defaultActiveKey={["1"]}
              ghost
            />
          </Flex>
        </>
      ),
    },
  ];

  const expandableRowRender = (record: DataType) => {
    return (
      <>
        <Row gutter={[16, 16]}>
          <Col xxl={6} xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="Full clásica cliente"  size="small">
              <Flex vertical gap={20}>
                {TableDetalle}
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5}>Competencia</Title>
                  {TableCompetencia}
                </Space>
              </Flex>
            </Card>
          </Col>
          <Col xxl={6} xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="Dropoff clásica cliente"  size="small">
              <Flex vertical gap={10}>
                {TableDetalle}
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5}>Competencia</Title>
                  {TableCompetencia}
                </Space>
              </Flex>
            </Card>
          </Col>
          <Col xxl={6} xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="Full clásica cliente"  size="small">
              <Flex vertical gap={10}>
                {TableDetalle}
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5}>Competencia</Title>
                  {TableCompetencia}
                </Space>
              </Flex>
            </Card>
          </Col>
          <Col xxl={6} xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="Dropoff clásica cliente"  size="small">
              <Flex vertical gap={10}>
                {TableDetalle}
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5}>Competencia</Title>
                  {TableCompetencia}
                </Space>
              </Flex>
            </Card>
          </Col>
        </Row>
        {/* 
        <Divider />

        <Card style={{ marginTop: "1em" }}>
          <Tabs
            defaultActiveKey="1"
            items={items}
            style={{ marginTop: "1em" }}
          />
        </Card> */}
      </>
    );
  };

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  return (
    <>
    <Container>
      <Title level={2}>Competencias</Title>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => expandableRowRender(record),
          columnWidth: 50,          
        }}
        bordered
        scroll={{ x: 1000 }}
      />

    </Container>
      {/* <Card style={{ marginTop: "1em" }}>
      </Card> */}

      <Modal
        title="Detalles del producto"
        open={isOpenModal}
        footer={null}
        onCancel={() => setIsOpenModal(false)}
        width={width < 768 ? "90%" : "80%"}
      >
        <Tabs defaultActiveKey="1" items={items} style={{ marginTop: "1em" }} />
      </Modal>
    </>
  );
}
