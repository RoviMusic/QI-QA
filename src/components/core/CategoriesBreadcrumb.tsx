import { Breadcrumb, BreadcrumbProps } from "antd";

type Props = {
    categories: string[]
}

export default function CategoriesBreadCrumb({categories} : Props) {
  type BreadcrumbItem = Required<BreadcrumbProps>["items"][number];

  function getBreadCategory(title: string): BreadcrumbItem {
    return {
      title,
    } as BreadcrumbItem;
  }

  return (
    <Breadcrumb
      items={categories.map((cat) => getBreadCategory(cat))} 
    />
  );
}
