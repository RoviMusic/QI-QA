"use client";
import { CircleButton } from "@/components/core/Buttons";
import { GlassCard } from "@/components/core/GlassCard";
import LoadingAnimation from "@/components/core/LoadingAnimation";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { fullfilmentService } from "@/modules/tools/fullfilment/services/fullfilmentService";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Flex, Input, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function FullfilmentPage() {
  const router = useRouter();
  const [columns, setColumns] = useState<DinamicColumnsType[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { notification } = App.useApp();

  useEffect(() => {
    setLoading(true);
    fullfilmentService
      .getFulfillmentData()
      .then((data) => {
        setColumns(data.columns);
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fullfilment data:", error);
        setLoading(false);
        notification.open({
          type: "error",
          message: "Hubo un error",
          description: `No se pudo obtener la información de fullfilment: ${error.message}`,
        });
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return data; // Return original data if search term is empty
    }

    const searchValue = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue)
      )
    );
  }, [data, searchTerm]);

  return (
    <>
      <LoadingAnimation isActive={loading}>
        <Container>
          <Flex vertical gap={20}>
            <Flex justify="space-between" align="center">
              <MainTitle>Fullfilment</MainTitle>

              <CircleButton
                onPress={() => router.push("/tools/fullfilment/settings")}
                icon="Gear"
                tooltip="Configuración"
              />
            </Flex>
            <GlassCard>
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                style={{marginBottom: 20, width: '50%'}}
              />
              <DinamicTable columns={columns} dataSource={filteredData} />
            </GlassCard>
          </Flex>
        </Container>
      </LoadingAnimation>
    </>
  );
}
