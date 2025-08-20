"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Button, Col, Flex, Form, Input, Row } from "antd";

export default function ProductsEditionPage() {
  const columns: DinamicColumnsType[] = [
    {
      column_id: "ref",
      title: "Ref.",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "ref_pro",
      title: "Ref Prov",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "prod",
      title: "Etiqueta",
      type: "custom",
      width: 150,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "barcode",
      title: "Cod. Barras",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "minus-ce",
      title: "-CE",
      type: "custom",
      width: 150,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "plus-ce",
      title: "+CE",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "minus-pi",
      title: "-PI",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "plus-pi",
      title: "+PI",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "minus-mj",
      title: "-MJ",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "plus-mj",
      title: "+MJ",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "minus-ji",
      title: "-JI",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "plus-ji",
      title: "+JI",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "minus-tec",
      title: "-TEC",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "plus-tec",
      title: "+TEC",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "minus-ma",
      title: "-MA",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "plus-ma",
      title: "+MA",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "minus-fu",
      title: "-FU",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "plus-fu",
      title: "+FU",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "pc",
      title: "PC",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "pl",
      title: "PL",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "mkp",
      title: "MKP",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "co",
      title: "CO",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "pi",
      title: "PI",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "et",
      title: "ET",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "ar",
      title: "AR",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "pa",
      title: "PA",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "es",
      title: "ES",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "col",
      title: "COL",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "po",
      title: "PO",
      type: "custom",
      width: 50,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "prov",
      title: "PROV",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "marca",
      title: "Marca",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "e-ventas",
      title: "E. Ventas",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
    {
      column_id: "e-compras",
      title: "E. Compras",
      type: "custom",
      width: 100,
      render: (value, record) => (
        <>
          <Input />
        </>
      ),
    },
  ];

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Edición de productos</MainTitle>

          <GlassCard>
            <Form layout="vertical">
              <Row gutter={[20, 20]}>
                <Col xxl={8} xl={6}>
                  <Form.Item label="Referencia producto">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Etiqueta producto">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Proveedor">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Marca">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="add">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Área">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Pasillo">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Estante">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Columna">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={6}>
                  <Form.Item label="Posición">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xxl={8} xl={"auto"}>
                  <Form.Item>
                    <Button type="primary">Filtrar</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </GlassCard>

          <GlassCard>
            <DinamicTable columns={columns} dataSource={[]} />
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
