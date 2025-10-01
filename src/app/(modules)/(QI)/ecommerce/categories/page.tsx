import Container from "@/components/layout/Container";
import CategoriesList from "@/modules/ecommerce/departments/components/categoriesList";
import {
  GetAllCategories,
  GetDepartments,
  GetLeafCategories,
} from "@/modules/ecommerce/departments/services/departmentsService";

export default async function CategoriesPage() {
  const deptos = await GetDepartments();
  const categories = await GetAllCategories();
  const leafs = await GetLeafCategories(categories.treeData);
  return (
    <>
      <Container>
        <CategoriesList deptos={deptos.data} leafs={leafs} />
      </Container>
    </>
  );
}
