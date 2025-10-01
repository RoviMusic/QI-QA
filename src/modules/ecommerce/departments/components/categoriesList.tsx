"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import {
  LabelTitle,
  MainTitle,
  Subtitle,
  TableText,
} from "@/components/core/Titulo";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Checkbox, Col, Flex, Row, Select, Space } from "antd";
import { DepartmentsType, LeafCategory } from "../types/departmentsType";
import { getTextColorForBackground } from "@/lib/utils";
import { useMemo, useState } from "react";
import { AddCategoryToDepto } from "../services/departmentsService";
import { useRouter } from "next/navigation";
import type { CheckboxProps } from "antd";

interface CategoriesProps {
  deptos: DepartmentsType[];
  leafs: LeafCategory[];
}

export default function CategoriesList({ deptos, leafs }: CategoriesProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDepto, setSelectedDepto] = useState<number | null>(null);
  const [checkNoDesc, setCheckNoDesc] = useState<boolean>(false);
  const { message } = App.useApp();
  const router = useRouter();
  const columns: DinamicColumnsType[] = [
    {
      title: "ID",
      column_id: "id",
      type: "int",
      width: 50,
      align: "left",
    },
    {
      column_id: "path",
      title: "Raíz",
      type: "custom",
      render: (value, record) => <TableText>{value[0]}</TableText>,
      width: 80,
    },
    {
      column_id: "pathString",
      title: "Path",
      type: "string",
      width: 350,
    },
    {
      column_id: "name",
      title: "Hoja",
      type: "string",
      width: 100,
    },
    {
      column_id: "description",
      title: "Descripción",
      type: "string",
      width: 200,
    },
    {
      column_id: "department",
      title: "Departamento",
      type: "custom",
      render: (value: any, record: any) => {
        return (
          <>
            <Select
              options={deptos.map((dept) => ({
                label: dept.short_name,
                value: dept.id,
              }))}
              style={{ width: "100%" }}
              value={value ? value.departmentId : null}
              onChange={(val) => assignDepto(record.id, val)}
            />
          </>
        );
      },
      width: 200,
      align: "center",
    },
  ];

  const getRowStyle = (record: any) => {
    if (record.department && record.department.color) {
      const textColor = getTextColorForBackground(record.department.color);
      return { background: record.department.color, color: textColor };
    }
    return {};
  };

  const assignDepto = async (categoryId: number, deptoId: number) => {
    setLoading(true);
    try {
      const result = await AddCategoryToDepto(categoryId, deptoId);
      if (result.success) {
        message.open({
          type: "success",
          content: result.message,
        });
        router.refresh();
      } else {
        message.open({
          type: "warning",
          content: result.message,
        });
      }
    } catch (error) {
      message.open({
        type: "error",
        content: "Hubo un error al asignar el departamento",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDepto = (items: LeafCategory[]) => {
    if (selectedDepto == null || undefined) {
      return items;
    }

    if (selectedDepto == 0) {
      return items.filter((item) => item.department == null);
    }

    return items.filter(
      (item) => item.department?.departmentId == selectedDepto
    );
  };

  const filterByDesc = (items: LeafCategory[]) => {
    if (checkNoDesc) {
      return items.filter(
        (item) => !item.description || item.description.trim() === ""
      );
    }
    return items;
  };

  const filterDepto = useMemo(
    () => filterByDepto(leafs),
    [leafs, selectedDepto]
  );

  const displayedData = useMemo(
    () => filterByDesc(filterDepto),
    [filterDepto, checkNoDesc]
  );

  const onChangeDesc: CheckboxProps["onChange"] = (e) => {
    setCheckNoDesc(e.target.checked);
  };

  return (
    <>
      <Flex vertical gap={20}>
        <MainTitle>Categorías</MainTitle>

        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>Filtrar por:</Subtitle>
            <Row gutter={[20, 20]}>
              <Col xxl={8} xl={6}>
                <Flex gap={10}>
                  <LabelTitle>Departamento:</LabelTitle>
                  <Select
                    options={[
                      { label: "Sin departamento", value: 0 },
                      ...deptos.map((dept) => ({
                        label: dept.short_name,
                        value: dept.id,
                      })),
                    ]}
                    style={{ flex: 1 }}
                    allowClear
                    value={selectedDepto}
                    onChange={(val) => setSelectedDepto(val)}
                  />
                </Flex>
              </Col>

              <Col xxl={8} xl={6}>
                <Flex gap={10}>
                  <LabelTitle>Sin descripción:</LabelTitle>
                  <Checkbox checked={checkNoDesc} onChange={onChangeDesc} />
                </Flex>
              </Col>
            </Row>
          </Flex>
        </GlassCard>

        <GlassCard>
          <DinamicTable
            columns={columns}
            dataSource={displayedData}
            hasPagination={false}
            rowStyle
            getRowStyle={getRowStyle}
            rowHoverable={false}
            loading={loading}
          />
        </GlassCard>
      </Flex>
    </>
  );
}
