"use client";
import { Modal, Form, Input, App, ColorPicker } from "antd";
import { useDepartmentModalStore } from "../stores/departmentsModalStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CategoriesType, DepartmentFormData } from "../types/departmentsType";
import {
  CreateDepartment,
  UpdateDepartment,
} from "../services/departmentsService";
import { CategoryTreeSelect } from "@/components/core/CategoriesTree";

interface ModalProps {
  categories: CategoriesType[];
}

export default function ModalDepartments({ categories }: ModalProps) {
  const { message } = App.useApp();
  const {
    isOpen,
    mode,
    selectedDepartment,
    isLoading,
    closeModal,
    setLoading,
  } = useDepartmentModalStore();

  const [form] = Form.useForm<DepartmentFormData>();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && mode === "edit" && selectedDepartment) {
      console.log("selectedDepartment", selectedDepartment);
      form.setFieldsValue({
        short_name: selectedDepartment.short_name,
        long_name: selectedDepartment.long_name,
        color: selectedDepartment.color,
        categories: selectedDepartment.categories
          ? selectedDepartment.categories.map((cat: any) => cat.id)
          : [],
      });
    } else if (isOpen && mode === "create") {
      form.resetFields();
    }
  }, [isOpen, mode, selectedDepartment, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let result;
      if (mode === "create") {
        // Lógica para crear un nuevo departamento
        console.log("Creating department with values:", values);
        result = await CreateDepartment(values);
      } else {
        // Lógica para actualizar un departamento existente
        console.log("Updating department with values:", values);
        result = await UpdateDepartment(selectedDepartment!.id, values);
      }

      if (result!.success) {
        message.open({
          type: "success",
          content:
            mode === "create"
              ? "Departamento creado correctamente"
              : "Departamento actualizado correctamente",
        });
        closeModal();
        form.resetFields();
        router.refresh(); // Refresca la página para actualizar los datos
      } else {
        message.open({
          type: "error",
          content: "Error al procesar la solicitud",
        });
      }
    } catch (error: any) {
      message.open({
        type: "error",
        content: "Error al procesar la solicitud",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <Modal
      title={mode === "create" ? "Nuevo Departamento" : "Editar Departamento"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText={mode === "create" ? "Crear" : "Actualizar"}
      cancelText="Cancelar"
      destroyOnHidden
    >
      <Form<DepartmentFormData>
        form={form}
        layout="vertical"
        name="departmentForm"
      >
        <Form.Item
          label="Nombre largo"
          name="long_name"
          rules={[
            { required: true, message: "Por favor ingresa el nombre largo" },
            { min: 2, message: "El nombre debe tener al menos 2 caracteres" },
            {
              max: 100,
              message: "El nombre no puede tener más de 100 caracteres",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label="Nombre corto"
          name="short_name"
          rules={[
            { required: true, message: "Por favor ingresa el nombre corto" },
            { min: 2, message: "El nombre debe tener al menos 2 caracteres" },
            {
              max: 50,
              message: "El nombre no puede tener más de 50 caracteres",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label="Color"
          name="color"
          rules={[{ required: true, message: "Por favor ingresa un color" }]}
        >
          <ColorPicker
            showText
            onChange={(value) => {
              form.setFieldValue("color", value.toHexString());
            }}
            format="hex"
            disabledFormat
          />
        </Form.Item>

        <Form.Item
          label="Categorías"
          name="categories"
          rules={[
            {
              required: true,
              message: "Por favor selecciona al menos una categoría",
            },
          ]}
        >
          <CategoryTreeSelect categories={categories} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
