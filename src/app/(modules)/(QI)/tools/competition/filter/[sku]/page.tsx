"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { LabelTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Button, Checkbox, Col, Flex, Form, Image, Input, InputNumber, Row, Space, Table, Typography } from "antd";
import { use, useState } from "react";
import { dataFiltros } from "../../dataDummy";

const { Link } = Typography;
const columnsFilter: DinamicColumnsType[] = [
    {
        column_id: 'id',
        title: 'ID',
        type: 'string'
    },
    {
        column_id: 'in',
        title: 'IN',
        type: 'custom',
        render: (value, record) => (
            <>
            <Checkbox checked={value}/>
            </>
        )
    },
    {
        column_id: 'ex',
        title: 'EX',
        type: 'custom',
        render: () => (
            <>
            <Checkbox />
            </>
        )
    },
    {
        column_id: 'price',
        title: 'Precio',
        type: 'price'
    },
    {
        column_id: 'title',
        title: 'Título',
        type: 'string',
        width: '50%'
    }
]

export default function FilterPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = use(params);
  const [form] = Form.useForm();
  const [urlImage, setUrlImage] = useState<string>('')
  const loremImage = 'https://picsum.photos/id'

  const hoverRow = (data: any) => {
    setUrlImage(`${loremImage}/${data.idImage}/400?random=1`)
  }

  return (
    <Container>
      <Flex vertical gap={20}>
        <GlassCard>
          <Form layout="vertical" form={form}>
            <Row gutter={[20,20]} >
              <Col xxl={4}>
                <Form.Item label="Búsqueda" style={{fontWeight: 'bold'}}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Filtro incluir" style={{fontWeight: 'bold'}}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Filtro excluir" style={{fontWeight: 'bold'}}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="IDs incluir" style={{fontWeight: 'bold'}}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="IDs excluir" style={{fontWeight: 'bold'}}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Revisado" style={{fontWeight: 'bold'}}>
                  <Checkbox />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                    <LabelTitle>Búsqueda ML</LabelTitle>
                    <Link>something</Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                    <LabelTitle>Imagen Google</LabelTitle>
                    <Link>something</Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                    <LabelTitle>Comparador</LabelTitle>
                    <Link>something</Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Matches" style={{fontWeight: 'bold'}}>
                  <InputNumber controls={false} style={{width: '100%'}}/>
                </Form.Item>
              </Col>

              <Col xxl={4} style={{alignContent: 'end'}}>
                <Form.Item>
                  <Button type="primary">Guardar</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </GlassCard>

        <Row gutter={[20,20]}>
            <Col xxl={18}>
                <GlassCard>
                    <DinamicTable columns={columnsFilter} dataSource={dataFiltros} rowActions={{onRowHover: hoverRow}}/>
                </GlassCard>
            </Col>

            <Col xxl={6}>
                <GlassCard>
                    <Image src={urlImage} fallback="/Logo.jpg"/>
                </GlassCard>
            </Col>
        </Row>
      </Flex>
    </Container>
  );
}
