"use client";
import { GlassCard } from "@/components/core/GlassCard";
import LoadingAnimation from "@/components/core/LoadingAnimation";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { createdListingsService } from "@/modules/tools/createdListings/services/createdListingsService";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Flex } from "antd";
import { useEffect, useState } from "react";

export default function CreatedListingsPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState<DinamicColumnsType[]>([]);
  const [data, setData] = useState<any[]>([]);
  const { notification } = App.useApp();

  useEffect(() => {
    setLoading(true);
    createdListingsService
      .getCreatedListings()
      .then(async (data) => {
        setColumns(data.columns);
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        notification.open({
          type: "error",
          message: "Hubo un error",
          description: `No se pudo obtener la información: ${error.message}`,
        });
      });
  });

  return (
    <>
      <LoadingAnimation isActive={loading}>
        <Container>
          <Flex vertical gap={20}>
            <MainTitle>Publicaciones Creadas</MainTitle>
            <GlassCard>
              <DinamicTable columns={columns} dataSource={data} />
            </GlassCard>
          </Flex>
        </Container>
      </LoadingAnimation>
    </>
  );
}
