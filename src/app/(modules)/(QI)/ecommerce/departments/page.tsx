import Container from "@/components/layout/Container";
import DepartmentsList from "@/modules/ecommerce/departments/components/departmentsList";
import ModalCategories from "@/modules/ecommerce/departments/components/modalCategories";
import ModalDepartments from "@/modules/ecommerce/departments/components/modalDepartments";
import {
  GetAllCategories,
  GetAllRelationships,
  GetDepartments,
} from "@/modules/ecommerce/departments/services/departmentsService";

export default async function DepartmentsPage() {
  const deptos = await GetDepartments();
  const categories = await GetAllCategories();
  const relations = await GetAllRelationships();

  return (
    <>
      <Container>
        <DepartmentsList departmentsData={deptos.data} />
        <ModalDepartments categories={categories.treeData} />
        <ModalCategories
          categories={categories.treeData}
          relationships={relations.data}
        />
      </Container>
    </>
  );
}
