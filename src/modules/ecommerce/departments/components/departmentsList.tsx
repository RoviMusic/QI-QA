"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { DepartmentsType } from "../types/departmentsType";
import { App, Button, Flex, Popconfirm, Space, Tooltip } from "antd";
import { MainTitle } from "@/components/core/Titulo";
import { getIcon } from "@/lib/utils";
import { useDepartmentModalStore } from "../stores/departmentsModalStore";
import { useRouter } from "next/navigation";
import { CircleButton } from "@/components/core/Buttons";
import { DeleteDepartment } from "../services/departmentsService";
import { useCategoriesModalStore } from "../stores/categoriesModalStore";
import { useAlertsModalStore } from "@/shared/stores/alertStore";

interface DepartmentsListProps {
  departmentsData: DepartmentsType[];
}

export default function DepartmentsList({
  departmentsData,
}: DepartmentsListProps) {
  const { openCreateModal, openEditModal } = useDepartmentModalStore();
  const { openModal } = useCategoriesModalStore();
  const { openAlert } = useAlertsModalStore();
  const router = useRouter();
  const { message } = App.useApp();

  const deleteDepartment = (departmentId: number) => {
    openAlert("sure", "Esto eliminará el departamento. ¿Continuar?", () => {
      console.log("Usuario confirmó la acción de eliminar.");
      handleDeleteDepartment(departmentId);
    });
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    // Lógica para eliminar el departamento
    try {
      console.log("Eliminar departamento con ID:", departmentId);
      const result = await DeleteDepartment(departmentId);
      if (result.success) {
        message.open({
          type: "success",
          content: "Departamento eliminado correctamente",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error al eliminar el departamento:", error);
      openAlert("error", "Hubo un error al eliminar el departamento");
      // message.open({
      //   type: "error",
      //   content: "Hubo un error al eliminar el departamento",
      // });
    }
  };

  const columns: DinamicColumnsType[] = [
    {
      title: "ID",
      column_id: "id",
      type: "int",
      width: 80,
    },
    {
      column_id: "short_name",
      title: "Nombre Corto",
      type: "string",
    },
    {
      column_id: "long_name",
      title: "Nombre Largo",
      type: "string",
    },
    {
      column_id: "categoria_count",
      title: "Categorias asignadas",
      type: "custom",
      render: (value: any, record: any) => (
        <Space>
          <span>{record.categoria_count}</span>
          <Button
            type="link"
            style={{ padding: 0, fontSize: 12, color: "#FAB627" }}
            size="small"
            onClick={() => openModal(record)}
          >
            Ver lista
          </Button>
        </Space>
      ),
      width: 180,
      align: "center",
    },
    {
      column_id: "actions",
      title: "Acciones",
      type: "actions",
      width: 120,
      align: "center",
      render: (_: any, record: DepartmentsType) => (
        <Space>
          <CircleButton
            onPress={() => openEditModal(record)}
            icon="Pen"
            tooltip="Editar departamento"
          />

          <CircleButton
            onPress={() => deleteDepartment(record.id)}
            icon="Trash"
            tooltip="Eliminar departamento"
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Flex vertical gap={20}>
        <Flex justify="space-between" align="center">
          <MainTitle>Departamentos</MainTitle>
          <Button
            type="primary"
            icon={getIcon("Plus")}
            onClick={openCreateModal}
          >
            Nuevo departamento
          </Button>
        </Flex>

        <GlassCard>
          <DinamicTable columns={columns} dataSource={departmentsData} />
        </GlassCard>
      </Flex>
    </>
  );
}
