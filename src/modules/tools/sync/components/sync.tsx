"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DefaultTitle, LabelTitle, MainTitle, MutedSubtitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import ItemsList from "@/modules/tools/shared/components/ItemsList";
import { ErrorType } from "@/shared/types/sharedTypes";
import { Badge, Col, Flex, List, Modal, Row, Space, Statistic } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

export type SyncType = {
  _id: string;
  market: string;
  lastSync: Date;
  errors: ErrorType[];
  totalSyncItems: number;
  totalItems: number;
};

const dataSync: SyncType[] = [
  {
    _id: "1",
    market: "Mercado Libre",
    lastSync: dayjs().toDate(),
    errors: [
      {
        id: "1",
        message:
          "Mensaje del error Mensaje del error Mensaje del errorMensaje del errorMensaje del error",
        key: Math.ceil(Math.random() * 800),
      },
    ],
    totalSyncItems: Math.ceil(Math.random() * 90000),
    totalItems: 90000,
  },
  {
    _id: "2",
    market: "Amazon",
    lastSync: dayjs().toDate(),
    errors: [
      {
        id: "1",
        message:
          "Mensaje del error Mensaje del error Mensaje del errorMensaje del errorMensaje del error",
        key: Math.ceil(Math.random() * 800),
      },
    ],
    totalSyncItems: Math.ceil(Math.random() * 90000),
    totalItems: 90000,
  },
  {
    _id: "3",
    market: "Walmart",
    lastSync: dayjs().toDate(),
    errors: [
      {
        id: "1",
        message:
          "Mensaje del error Mensaje del error Mensaje del errorMensaje del errorMensaje del error",
        key: Math.ceil(Math.random() * 800),
      },
    ],
    totalSyncItems: Math.ceil(Math.random() * 90000),
    totalItems: 90000,
  },
  {
    _id: "4",
    market: "Coppel",
    lastSync: dayjs().toDate(),
    errors: [
      {
        id: "1",
        message:
          "Mensaje del error Mensaje del error Mensaje del errorMensaje del errorMensaje del error",
        key: Math.ceil(Math.random() * 800),
      },
      {
        id: "2",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        key: Math.ceil(Math.random() * 800),
      },
      {
        id: "3",
        message:
          "Aenean et justo in metus tristique varius. Morbi pharetra, diam a consectetur vehicula, tortor urna commodo urna, eget volutpat massa quam ac justo",
        key: Math.ceil(Math.random() * 800),
      },
    ],
    totalSyncItems: Math.ceil(Math.random() * 90000),
    totalItems: 90000,
  },
];

export default function Sync() {
  const [errors, setErrors] = useState<ErrorType[]>();
  const [openModalErrors, setOpenModalErrors] = useState<boolean>(false);

  const openError = (errors: ErrorType[]) => {
    setErrors(errors);
    setOpenModalErrors(true);
  };

  const onCloseErrors = () => {
    setErrors([]);
    setOpenModalErrors(false);
  };

  const getPercentage = (total: number, items: number) => {
    if (total === 0) return 0;
    return ((items / total) * 100).toFixed(2);
  };

  return (
    <>
      <Flex gap={20} vertical>
        <Flex gap={10} align="center">
          <MainTitle>Sincronizador de publicaciones</MainTitle>
          <Badge status="success" text="Sincronizador en funcionamiento" />
        </Flex>
        <Row gutter={[20, 20]}>
          {dataSync.map((item) => (
            <Col key={item._id} xl={6} lg={6} md={3} sm={6} xs={6}>
              <GlassCard>
                <Flex vertical gap={20}>
                  <Space direction="vertical">
                    <DefaultTitle level={3}>{item.market}</DefaultTitle>
                    <DefaultTitle>
                      Última sincronización:{" "}
                      {item.lastSync.toLocaleTimeString()}
                    </DefaultTitle>
                  </Space>

                  <Flex vertical justify="center" align="center">
                    <Statistic
                      title="Elementos sincronizados"
                      value={
                        getPercentage(item.totalItems, item.totalSyncItems) +
                        "%"
                      }
                      style={{ textAlign: "center" }}
                      valueStyle={{
                        textAlign: "center",
                        color: "green",
                        fontWeight: "bold",
                      }}
                    />

                    <LabelTitle>{item.totalSyncItems}/{item.totalItems}</LabelTitle>
                  </Flex>

                  <Space
                    onClick={() => openError(item.errors)}
                    className="hover:underline hover:cursor-pointer"
                  >
                    <DefaultTitle
                      level={5}
                      style={{ color: "#FF5652", fontWeight: "bold" }}
                    >
                      Errores encontrados: {item.errors.length}
                    </DefaultTitle>
                  </Space>
                </Flex>
              </GlassCard>
            </Col>
          ))}
        </Row>
      </Flex>

      <Modal
        title={<DefaultTitle level={4}>Listado de errores</DefaultTitle>}
        open={openModalErrors}
        onCancel={onCloseErrors}
        footer={null}
      >
        <List>
          {errors?.map((err) => (
            <List.Item key={err.id}>
              <Flex vertical gap={5}>
                <LabelTitle>Número de orden: {err.key}</LabelTitle>
                <p>{err.message}</p>
              </Flex>
            </List.Item>
          ))}
        </List>
      </Modal>
    </>
  );
}
