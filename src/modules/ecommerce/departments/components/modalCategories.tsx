"use client";
import { Modal, App, Transfer, Tree } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CategoriesType } from "../types/departmentsType";
import { UpdateCategories } from "../services/departmentsService";
import { useCategoriesModalStore } from "../stores/categoriesModalStore";
import type { TransferProps } from "antd";
import { FolderOutlined, TagOutlined } from "@ant-design/icons";

interface ModalProps {
  categories: CategoriesType[];
  relationships: RelationsType[];
}

interface RelationsType {
  fk_department: number;
  fk_categorie: number;
}

interface RecordType {
  key: string;
  title: string;
  disabled?: boolean;
  isParent?: boolean;
}

export default function ModalCategories({
  categories,
  relationships,
}: ModalProps) {
  const { message } = App.useApp();
  const { isOpen, selectedDepartment, isLoading, closeModal, setLoading } =
    useCategoriesModalStore();

  const [targetKeys, setTargetKeys] = useState<string[]>(
    selectedDepartment
      ? selectedDepartment!.categories!.map((cat) => cat.id.toString())
      : []
  );

  const router = useRouter();

  useEffect(() => {
    if (isOpen && selectedDepartment?.categories) {
      console.log("selectedDepartment", selectedDepartment);
      setTargetKeys(
        selectedDepartment.categories.map((cat) => cat.id.toString())
      );
    }
  }, [isOpen, selectedDepartment]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("actualizando categorias ", targetKeys);

      // Lógica para actualizar una categoria
      const result = await UpdateCategories(
        selectedDepartment!.id,
        targetKeys.map((key) => Number(key))
      );

      if (result.success) {
        message.open({
          type: "success",
          content: "Categorías actualizadas correctamente",
        });
        closeModal();

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
    closeModal();
  };

  const flattenCategories = useMemo(() => {
    const flatten = (
      categories: CategoriesType[],
      level: number = 0
    ): RecordType[] => {
      let result: RecordType[] = [];

      categories.forEach((cat) => {
        const isDisabled = relationships
          .filter(
            (assignment) => assignment.fk_department !== selectedDepartment?.id
          )
          .some((assignment) => assignment.fk_categorie === cat.id);

        const hasChildren = cat.children && cat.children.length > 0;
        const indent = "  ".repeat(level);

        result.push({
          key: cat.id.toString(),
          title: `${indent}${hasChildren ? "📁" : "🏷️"} ${cat.name}${isDisabled ? " (Asignada a otro depto)" : ""}`,
          disabled: isDisabled,
          isParent: hasChildren,
        });

        if (cat.children) {
          result = result.concat(flatten(cat.children, level + 1));
        }
      });

      return result;
    };

    return flatten(categories);
  }, [categories, relationships, selectedDepartment?.id]);

  const renderItem = (item: RecordType) => {
    const customLabel = (
      <span
        style={{
          color: item.disabled ? "#bbb" : "inherit",
          fontWeight: item.isParent ? "bold" : "normal",
        }}
      >
        {item.title}
      </span>
    );

    return {
      label: customLabel,
      value: item.title,
    };
  };

  const handleChange: TransferProps["onChange"] = (newTargetKeys) => {
    console.log("target keys ", newTargetKeys);
    setTargetKeys(newTargetKeys as string[]);
  };

  // Convertir a formato Tree para el lado izquierdo
  const convertToTreeData = (categories: CategoriesType[]): any => {
    return categories.map((cat) => {
      const isDisabled = relationships
        .filter(
          (assignment) => assignment.fk_department !== selectedDepartment?.id
        )
        .some((assignment) => assignment.fk_categorie === cat.id);

      const isAssigned = targetKeys.includes(cat.id.toString());

      return {
        key: cat.id.toString(),
        title: (
          <span
            style={{
              color: isDisabled ? "#bbb" : isAssigned ? "#1890ff" : "inherit",
              fontWeight: isAssigned ? "bold" : "normal",
            }}
          >
            {cat.children?.length ? <FolderOutlined /> : <TagOutlined />}{" "}
            {cat.name}
            {isDisabled && (
              <span style={{ color: "#bbb", fontSize: "12px" }}>
                {" "}
                (Asignada a otro departamento)
              </span>
            )}
            {isAssigned && (
              <span style={{ color: "#1890ff", fontSize: "12px" }}>
                {" "}
                (Asignada)
              </span>
            )}
          </span>
        ),
        disabled: isDisabled,
        children: cat.children ? convertToTreeData(cat.children) : undefined,
      };
    });
  };

  const treeData = convertToTreeData(categories);

  const flattenForTransfer = (categories: CategoriesType[]): RecordType[] => {
    let result: RecordType[] = [];

    const flatten = (cats: CategoriesType[]) => {
      cats.forEach((cat) => {
        const isDisabled = relationships
          .filter(
            (assignment) => assignment.fk_department !== selectedDepartment?.id
          )
          .some((assignment) => assignment.fk_categorie === cat.id);

        result.push({
          key: cat.id.toString(),
          title: cat.name,
          disabled: isDisabled,
        });

        if (cat.children) {
          flatten(cat.children);
        }
      });
    };

    flatten(categories);
    return result;
  };

  const transferData = flattenForTransfer(categories);

  return (
    <Modal
      title={`Categorias del departamento: ${selectedDepartment?.short_name}`}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText={"Actualizar categorías"}
      cancelText="Cancelar"
      destroyOnHidden
      width={800}
    >
      <Transfer
        dataSource={flattenCategories}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={renderItem}
        titles={["Todas las Categorías", `Asignadas (${targetKeys.length})`]}
        showSearch
        filterOption={(inputValue, item) =>
          item.title!.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        }
        style={{ marginBottom: "16px", height: 500, overflow: "auto" }}
        oneWay
        showSelectAll={true}
      >
        {({ direction, onItemSelect, selectedKeys }) => {
          if (direction === "left") {
            return (
              <div style={{ padding: "10px", overflow: "auto" }}>
                <Tree
                  treeData={treeData}
                  checkable
                  blockNode
                  checkedKeys={targetKeys}
                  onCheck={(checkedKeys) => {
                    // Filtrar las keys deshabilitadas
                    const enabledKeys = (checkedKeys as string[]).filter(
                      (key) => {
                        const item = transferData.find(
                          (item) => item.key === key
                        );
                        return !item?.disabled;
                      }
                    );
                    setTargetKeys(enabledKeys);
                  }}
                  defaultExpandAll={false}
                />
              </div>
            );
          }
        }}
      </Transfer>
    </Modal>
  );
}
