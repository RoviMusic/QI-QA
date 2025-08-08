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
  syncTotalErrors: IErrors[];
  syncSummary: ISummary;
  syncCicleErrors: IErrors[];
}

export default function Sync({ syncTotalErrors, syncSummary, syncCicleErrors }: SyncProps) {
  const [errors, setErrors] = useState<IErrors[]>();
  const [openModalErrors, setOpenModalErrors] = useState<boolean>(false);
  //const [dataSync, setDataSync] = useState<any[]>([]);

  const openError = (errors: IErrors[]) => {
    setErrors(errors);
    setOpenModalErrors(true);
  };

  const onCloseErrors = () => {
    setErrors([]);
    setOpenModalErrors(false);
  };

  return (
    <>
      <Flex gap={20} vertical>
        <Flex align="center" wrap>
          <MainTitle>Sincronizador de publicaciones</MainTitle>
        </Flex>
        <Row gutter={[20, 20]}>
          <Col xl={8} lg={8} md={12} sm={24} xs={24}>
            <GlassCard>
              <Flex gap={15} justify="space-between">
                <DefaultTitle level={3}>Meli</DefaultTitle>
                <Badge
                  status="success"
                  text="Sincronizador en funcionamiento"
                />
              </Flex>

              <Flex vertical gap={5} style={{ width: "100%" }}>
                <DefaultTitle>
                  Última sincronización:{" "}
                  {dayjs(syncSummary.start_time).format("DD/MM/YYYY [a las] HH:mm:ss")}
                </DefaultTitle>
                <Flex justify="space-between" wrap align="center">
                  <MutedSubtitle>
                    Duración: {syncSummary.duration_minutes.toFixed(2)} minutos
                  </MutedSubtitle>
                  <DefaultTitle
                    level={4}
                    style={{ color: "#FF5652", fontWeight: "bold" }}
                  >
                    {syncCicleErrors.length} errores
                  </DefaultTitle>
                </Flex>

                <Flex justify="center" align="center" vertical>
                  <Statistic
                    title="Elementos sincronizados"
                    value={syncSummary.success_rate_percent.toFixed(2)}
                    style={{ textAlign: "center" }}
                    valueStyle={{
                      textAlign: "center",
                      color: "green",
                      fontWeight: "bold",
                    }}
                    suffix="%"
                  />

                  <LabelTitle>
                    Sincronizados: {syncSummary.success_count}/{syncSummary.total_processed}
                  </LabelTitle>
                </Flex>
              </Flex>

              {/* <List>
                <VirtualList data={syncSummary} itemKey="_id" itemHeight={20}>
                  {(item: ISummary) => (
                    <List.Item>
                      <Flex vertical gap={5} style={{ width: "100%" }}>
                        <DefaultTitle>
                          Última sincronización:{" "}
                          {dayjs(item.start_time).format(
                            "DD/MM/YYYY [a las] HH:mm:ss"
                          )}
                        </DefaultTitle>
                        <Flex justify="space-between" wrap align="center">
                          <MutedSubtitle>
                            Duración: {item.duration_minutes.toFixed(2)} minutos
                          </MutedSubtitle>
                          <DefaultTitle
                            level={4}
                            style={{ color: "#FF5652", fontWeight: "bold" }}
                          >
                            {syncErrors.length} errores
                          </DefaultTitle>
                        </Flex>

                        <Flex justify="center" align="center" vertical>
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

                          <LabelTitle>
                            Sincronizados: {item.total_processed}/
                            {item.success_count}
                          </LabelTitle>
                        </Flex>
                      </Flex>
                    </List.Item>
                  )}
                </VirtualList>
              </List> */}

              {/* <Space
                onClick={() => openError(syncTotalErrors)}
                className="hover:underline hover:cursor-pointer"
                align="center"
                style={{ textAlign: "center" }}
              >
                <DefaultTitle
                  level={4}
                  style={{ color: "#FF5652", fontWeight: "bold" }}
                >
                  {syncTotalErrors.length} errores en 48 hrs
                </DefaultTitle>
              </Space>
              <MutedSubtitle>Promedio: 30:06 minutos</MutedSubtitle> */}
            </GlassCard>
          </Col>
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
                <LabelTitle>
                  MLM: {String(err.metadata.publication_id)}
                </LabelTitle>
                <MutedSubtitle>
                  {dayjs(err.timestamp).toDate().toISOString()}
                </MutedSubtitle>
                <p>{err.error}</p>
              </Flex>
            </List.Item>
          ))}
        </List>
      </Modal>
    </>
  );
}
