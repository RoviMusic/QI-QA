'use client'
import { GlassCard } from "@/components/core/GlassCard";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { Button, Col, Flex, Form, Input, Row } from "antd";

export default function PurchaseReportPage() {
    return(
        <>
        <Container>
            <Flex vertical gap={20}>
                <MainTitle>Lista de productos</MainTitle>

                <GlassCard>
                    <Form layout="vertical">
                        <Row gutter={[20,20]}>
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
                                <Form.Item label="Adicional">
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xxl={8} xl={'auto'}>
                                <Form.Item>
                                    <Button type="primary">Procesar</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </GlassCard>
            </Flex>
        </Container>
        </>
    )
}