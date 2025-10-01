import { CategoriesType } from "@/modules/ecommerce/departments/types/departmentsType";
import { TreeSelect } from "antd";

// Función recursiva para transformar el árbol de categorías al formato de TreeSelect
function transformToTreeSelectData(categories: CategoriesType[]): any[] {
  return categories.map((category) => ({
    value: category.id,
    title: category.name,
    // Recursivamente transformar los hijos si existen
    children:
      category.children && category.children.length > 0
        ? transformToTreeSelectData(category.children)
        : [],
  }));
}

interface CategoryTreeSelectProps {
  categories: CategoriesType[];
  value?: number[];
  onChange?: (value: number[]) => void;
  placeholder?: string;
  multiple?: boolean;
}

const CategoryTreeSelect: React.FC<CategoryTreeSelectProps> = ({
  categories,
  value,
  onChange,
  placeholder = "Selecciona categorías",
  multiple = true,
}) => {
  // Transformar los datos al formato correcto
  const treeData = transformToTreeSelectData(categories);

  return (
    <TreeSelect
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
      treeData={treeData}
      placeholder={placeholder}
      multiple={multiple}
      allowClear
      showSearch
      treeDefaultExpandAll={false}
      treeNodeFilterProp="title"
      maxTagCount="responsive"
      treeCheckable
    />
  );
};

export { CategoryTreeSelect };
