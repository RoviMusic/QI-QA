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
  columnsCompetition,
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
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
const { Title, Text } = Typography;

export default function CompetenciaPage() {
  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <Title level={2}>Competencias</Title>

          <GlassCard>
            <DinamicTable columns={columnsCompetition} dataSource={data}/>
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
