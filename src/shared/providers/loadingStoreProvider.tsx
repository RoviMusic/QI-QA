'use client';

import { createContext, useContext, useRef } from "react";
import { type LoadingStore, createLoadingStore, initLoadingStore } from "../stores/loadingStore";
import { useStore } from "zustand";

export type LoadingStoreApi = ReturnType<typeof createLoadingStore>;

export const LoadingStoreContext = createContext<LoadingStoreApi | undefined>(undefined)

export interface LoadingStoreProviderProps {
    children: React.ReactNode;
}

export const LoadingStoreProvider = ({
    children
}: LoadingStoreProviderProps) => {
    const storeRef = useRef<LoadingStoreApi | null>(null);
    if(storeRef.current === null){
        storeRef.current = createLoadingStore(initLoadingStore());
    }

    return (
        <LoadingStoreContext.Provider value={storeRef.current}>
            {children}
        </LoadingStoreContext.Provider>
    );
}

export const useLoadingStore = <T,>(
  selector: (store: LoadingStore) => T,
): T => {
  const loadingStoreContext = useContext(LoadingStoreContext)

  if (!loadingStoreContext) {
    throw new Error(`useLoadingStore must be used within LoadingStoreProvider`)
  }

  return useStore(loadingStoreContext, selector)
}