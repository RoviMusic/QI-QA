import { create } from "zustand";

interface AlertsModalState {
  isOpen: boolean;
  type: "error" | "sure" | "warning" | null;
  message?: string;
  onOkCallback?: () => void;

  // Actions
  openAlert: (
    type: "error" | "sure" | "warning",
    message?: string,
    onOk?: () => void
  ) => void;
  closeAlert: () => void;
  reset: () => void;
}

export const useAlertsModalStore = create<AlertsModalState>((set) => ({
  isOpen: false,
  message: "",
  type: null,
  onOkCallback: undefined,

  openAlert: (type, message, onOk) =>
    set({
      isOpen: true,
      type: type,
      message: message,
      onOkCallback: onOk,
    }),

  closeAlert: () =>
    set({
      isOpen: false,
      type: null,
      message: "",
      onOkCallback: undefined,
    }),

  reset: () =>
    set({
      isOpen: false,
      type: null,
      message: "",
      onOkCallback: undefined,
    }),
}));
