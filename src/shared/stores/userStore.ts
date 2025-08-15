import { create } from "zustand";
import { UserType } from "../types/userTypes";
import { persist } from "zustand/middleware";

interface UserState {
  user: UserType | null;
}

interface UserAction {
  updateUser: (user: UserState["user"]) => void;
  reset: () => void;
}

export const useUserStore = create<UserState & UserAction>()(
  persist(
    (set, get, store) => ({
      user: null,
      updateUser: (user) => set(() => ({ user: user })),
      reset: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: "user-storage",
    }
  )
);
