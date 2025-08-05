"use client";
import { GlassCard } from "@/components/core/GlassCard";
import {
  DefaultTitle,
  LabelTitle,
  MainTitle,
  MutedSubtitle,
} from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import ItemsList from "@/modules/tools/shared/components/ItemsList";
import { ErrorType } from "@/shared/types/sharedTypes";
import { Badge, Col, Flex, List, Modal, Row, Space, Statistic } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { IErrors } from "../models/ErrorsModel";
import { ISummary } from "../models/SummaryModel";
import VirtualList from "rc-virtual-list";

interface SyncProps {
  syncErrors: IErrors[];
  syncSummary: ISummary[];
}

export default function Sync({ syncErrors, syncSummary }: SyncProps) {
  const [errors, setErrors] = useState<ErrorType[]>();
  const [openModalErrors, setOpenModalErrors] = useState<boolean>(false);
  //const [dataSync, setDataSync] = useState<any[]>([]);

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
        <Flex align="center" wrap>
          <MainTitle>Sincronizador de publicaciones</MainTitle>
        </Flex>
        <Row gutter={[20, 20]}>
          <Col xl={8}>
            <GlassCard>
              <Flex gap={15} justify="space-between">
                <DefaultTitle level={3}>Meli</DefaultTitle>
                <Badge
                  status="success"
                  text="Sincronizador en funcionamiento"
                />
              </Flex>

              <List>
                <VirtualList
                  data={syncSummary}
                  itemKey="_id"
                  height={450}
                  itemHeight={20}
                >
                  {(item: ISummary) => (
                    <List.Item>
                      <Flex vertical gap={10} style={{ width: "100%" }}>
                        <Flex justify="space-between" wrap>
                          <DefaultTitle>
                            Última sincronización:{" "}
                            {dayjs(item.start_time).format(
                              "DD/MM/YYYY [a las] HH:mm:ss"
                            )}
                          </DefaultTitle>

                          <MutedSubtitle>
                            Duración: {item.duration_minutes.toFixed(2)} minutos
                          </MutedSubtitle>
                        </Flex>

                        <Flex justify="center" align="center">
                          <Statistic
                            title="Elementos sincronizados"
                            value={item.success_rate_percent.toFixed(2)}
                            style={{ textAlign: "center" }}
                            valueStyle={{
                              textAlign: "center",
                              color: "green",
                              fontWeight: "bold",
                            }}
                            suffix="%"
                          />

                          {/* <Flex gap={10}>
                            <MutedSubtitle>
                              Sincronizados: {item.total_processed} elementos
                            </MutedSubtitle>
                            <MutedSubtitle>
                              De: {item.success_count}
                            </MutedSubtitle>
                          </Flex> */}
                        </Flex>
                      </Flex>
                    </List.Item>
                  )}
                </VirtualList>
              </List>

              <Space
                //onClick={() => openError(item.errors)}
                className="hover:underline hover:cursor-pointer"
              >
                <DefaultTitle
                  level={5}
                  style={{ color: "#FF5652", fontWeight: "bold" }}
                >
                  Se encontraron {syncErrors.length} errores durante los ciclos
                </DefaultTitle>
              </Space>
            </GlassCard>
          </Col>
          {/* {syncSummary.map((item) => (
            <Col key={item._id} xl={6} lg={6} md={12} sm={24} xs={24}>
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
          ))} */}
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
