import { create } from "zustand";
import { DepartmentsType } from "../types/departmentsType";

interface DepartmentModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  selectedDepartment: DepartmentsType | null;
  isLoading: boolean;

  // Actions
  openCreateModal: () => void;
  openEditModal: (department: DepartmentsType) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useDepartmentModalStore = create<DepartmentModalState>((set) => ({
  isOpen: false,
  mode: "create",
  selectedDepartment: null,
  isLoading: false,

  openCreateModal: () =>
    set({
      isOpen: true,
      mode: "create",
      selectedDepartment: null,
    }),

  openEditModal: (department) =>
    set({
      isOpen: true,
      mode: "edit",
      selectedDepartment: department,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      selectedDepartment: null,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () =>
    set({
      isOpen: false,
      mode: "create",
      selectedDepartment: null,
      isLoading: false,
    }),
}));
