import { create } from "zustand";
import { DepartmentsType } from "../types/departmentsType";

interface CategoriesModalState {
  isOpen: boolean;
  selectedDepartment: DepartmentsType | null;
  isLoading: boolean;

  // Actions
  openModal: (department: DepartmentsType) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useCategoriesModalStore = create<CategoriesModalState>((set) => ({
  isOpen: false,
  selectedDepartment: null,
  isLoading: false,

  openModal: (department) =>
    set({
      isOpen: true,
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
      selectedDepartment: null,
      isLoading: false,
    }),
}));
