export type DepartmentsType = {
  id: number;
  short_name: string;
  long_name: string;
  color: string;
  categories?: CategoriesType[];
};

export interface DepartmentFormData {
  short_name: string;
  long_name: string;
  color: string;
  categories: number[];
}

export type CategoriesType = {
  id: number;
  name: string;
  description?: string | null;
  fk_parent: number | null;
  children?: CategoriesType[];
};

export type LeafCategory = {
  id: number;
  name: string;
  description: string | null;
  path: string[];
  pathString: string;
  pathIds: number[];
  department: {
    departmentId: number;
    color: string;
  } | null;
};
