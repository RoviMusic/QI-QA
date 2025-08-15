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
import Link from "next/link";
//import styles from "@/styles/modulos/competencia/Competencia.module.css";
import type { TabsProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { formattedPriceNormalized } from "@/lib/formattedPrice";
import Container from "@/components/layout/Container";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { data } from "./dataDummy";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { useRouter } from "next/navigation";
const { Title, Text } = Typography;

export default function CompetenciaPage() {
  const router = useRouter();

  const columnsCompetition: DinamicColumnsType[] = [
    {
      column_id: "sku",
      title: "ID",
      type: "string",
      //width: 200,
    },
    {
      column_id: "label",
      title: "Título",
      type: "string",
      //width: 500,
    },
    {
      column_id: "estatus",
      title: "Estatus",
      type: "custom",
      align: "center",
      width: 100,
      render: (value, record) => (
        <>
          <Tag color={record.estatus == "Activo" ? "success" : "error"}>
            {value}
          </Tag>
        </>
      ),
    },
    {
      column_id: "ventas",
      title: "Ventas",
      type: "int",
      width: '10%',
    },
    {
      column_id: "filtros",
      title: "Filtros",
      type: "actions",
      align: "center",
      width: 80,
      actions: [
        {
          onPress: (record) => {
            router.push(`/tools/competition/filter/${record.sku}`);
          },
          tooltip: "Filtros",
          icon: "Filter",
        },
      ],
      //width: 80,
    },
    {
      column_id: "comparar",
      title: "Comparar",
      type: "actions",
      align: "center",

      actions: [
        {
          onPress: (record) => {
            router.push(`/tools/competition/comparison/${record.sku}`);
          },
          tooltip: "Comparar",
          icon: "People-Arrows",
        },
      ],
      width: 100,
    },
  ];

  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <Title level={2}>Competencias</Title>

          <Row justify="center">
            <Col xxl={24}>
              <GlassCard>
                <DinamicTable columns={columnsCompetition} dataSource={data} hasPagination={false}/>
              </GlassCard>
            </Col>
          </Row>
        </Flex>
      </Container>
    </>
  );
}
