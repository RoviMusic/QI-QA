"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { getIcon } from "@/lib/utils";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import {
  App,
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
} from "antd";
import type { FormProps } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const { RangePicker } = DatePicker;

type SpecialDatesType = {
  id: string;
  start_date: Date;
  end_date: Date;
  title: string;
};

const rows: SpecialDatesType[] = [
  {
    start_date: dayjs("2023-01-01").toDate(),
    end_date: dayjs("2023-01-31").toDate(),
    title: "Buen fin 2023",
    id: "1",
  },
  {
    start_date: dayjs("2023-02-01").toDate(),
    end_date: dayjs("2023-02-28").toDate(),
    title: "Prime day",
    id: "2",
  },
  {
    start_date: dayjs("2023-01-01").toDate(),
    end_date: dayjs("2023-01-31").toDate(),
    title: "Otra fecha promocional",
    id: "3",
  },
  {
    start_date: dayjs("2023-02-01").toDate(),
    end_date: dayjs("2023-02-28").toDate(),
    title: "Hot sale",
    id: "4",
  },
  {
    start_date: dayjs("2024-01-01").toDate(),
    end_date: dayjs("2024-01-31").toDate(),
    title: "Buen fin 2024",
    id: "5",
  },
  {
    start_date: dayjs("2024-02-01").toDate(),
    end_date: dayjs("2024-02-28").toDate(),
    title: "Prime day 2024",
    id: "6",
  },
  {
    start_date: dayjs("2023-01-01").toDate(),
    end_date: dayjs("2023-01-31").toDate(),
    title: "Otra fecha promocional 2023",
    id: "7",
  },
  {
    start_date: dayjs("2025-02-01").toDate(),
    end_date: dayjs("2025-02-28").toDate(),
    title: "Hot sale 2025",
    id: "8",
  },
];

export default function FullfilmentSettingsPage() {
  const router = useRouter();
  const { notification } = App.useApp();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<SpecialDatesType | null>(null);

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    const rangeValue = values["dateRange"];

    const specialDate: SpecialDatesType = {
      start_date: rangeValue[0].toDate().toDateString(),
      end_date: rangeValue[1].toDate().toDateString(),
      title: values["title"],
      id: `special-${Date.now()}`, // el id vendra del backend
    };

    console.log("Special Date:", specialDate);
    //aca se maneja la lógica para guardar la fecha especial
    const key = `open${Date.now()}`;
    notification.open({
      type: "success",
      message: "Configuración guardada",
      description: `Se ha guardado la configuración para el rango de fechas: ${specialDate.start_date} - ${specialDate.end_date}`,
      key,
    });
    rows.push(specialDate);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return rows; // Return original data if search term is empty
    }

    const searchValue = searchTerm.toLowerCase();
    return rows.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue)
      )
    );
  }, [rows, searchTerm]);

  const columns: DinamicColumnsType[] = [
    { column_id: "start_date", type: "date", title: "Fecha inicial" },
    { column_id: "end_date", type: "date", title: "Fecha final" },
    { column_id: "title", type: "string", title: "Título" },
    {
      column_id: "actions",
      type: "actions",
      title: "Acciones",
      actions: [
        {
          icon: "Pen",
          onPress: (record) => {
            setSelectedRow(record);
            setOpenEditModal(true);
          },
          tooltip: "Editar",
        },
        {
          icon: "Trash",
          onPress: (record) => {
            const newRows = rows.filter((row) => row.id !== record.id);
            notification.open({
              type: "success",
              message: "Configuración eliminada",
              description: `Se ha eliminado la configuración para el rango de fechas: ${record["Fecha inicial"]} - ${record["Fecha final"]}`,
            });
            rows.splice(0, rows.length, ...newRows); // Update the rows array
          },
          tooltip: "Eliminar",
        },
      ],
    },
  ];

  return (
    <Container>
      <Flex vertical gap={30}>
        <Flex gap={10} align="center">
          <Button
            icon={getIcon("Left")}
            type="text"
            onClick={() => router.back()}
          >
            Regresar
          </Button>
          <MainTitle>Configuración de Fullfilment</MainTitle>
        </Flex>

        <GlassCard>
          <Form layout="vertical" onFinish={onFinish}>
            <Row gutter={[20, 20]} align="bottom">
              <Col xl={8}>
                <Form.Item
                  label="Rango de fechas"
                  name="dateRange"
                  required
                  rules={[{ required: true, message: "" }]}
                >
                  <RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xl={8}>
                <Form.Item
                  label="Título"
                  name="title"
                  required
                  rules={[{ required: true, message: "" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xl={8}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Guardar
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </GlassCard>

        <GlassCard>
          <Flex vertical gap={20}>
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: "50%" }}
            />
            <DinamicTable columns={columns} dataSource={filteredData} />
          </Flex>
        </GlassCard>
      </Flex>

      <Modal
        title={"Editar fecha " + selectedRow?.title}
        open={openEditModal}
        footer={null}
        width={1000}
        onCancel={() => {
          setOpenEditModal(false);
          setSelectedRow(null);
        }}
      >
        <Form
          layout="vertical"
          initialValues={{
            dateRange: [
              dayjs(selectedRow?.start_date),
              dayjs(selectedRow?.end_date),
            ],
            title: selectedRow?.title,
          }}
          onFinish={(values) => {
            console.log("Updated values:", values);
            setOpenEditModal(false);
            // Aquí se manejaría la lógica para actualizar la fecha especial
            setSelectedRow(null);
          }}
        >
          <Row gutter={[20, 20]} align="bottom">
            <Col xl={8}>
              <Form.Item
                label="Rango de fechas"
                name="dateRange"
                required
                rules={[{ required: true, message: "" }]}
              >
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xl={8}>
              <Form.Item
                label="Título"
                name="title"
                required
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Actualizar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Container>
  );
}
