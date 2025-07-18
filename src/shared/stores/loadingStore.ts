import { createStore } from 'zustand/vanilla'

export type LoadingState = {
    isLoading: boolean;
}

export type LoadingActions = {
    setLoading: (loading: LoadingState['isLoading']) => void;
}

export type LoadingStore = LoadingState & LoadingActions;

export const initLoadingStore = (): LoadingState => {
    return { isLoading: false }
}

export const defaultInitState: LoadingState = {
    isLoading: false
}

export const createLoadingStore = (initState: LoadingState = defaultInitState) => {
    return createStore<LoadingStore>()((set) => ({
        ...initState,
        setLoading: () => set((state) => ({ isLoading: !state.isLoading}))
    }))
}