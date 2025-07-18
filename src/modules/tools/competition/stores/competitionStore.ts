import {create} from "zustand";

const useCompetenciaStore = create((set) => ({
    filtros: {
        estatus: "active",
    },
    datosTable: [],

    actualizarFiltros: (nuevosFiltros: any) => set((state: any) => ({
        filtros: {...state.filtros, ...nuevosFiltros}
    })),

    actualizarDatos: (datos: any) => set({datosTable: datos}),

    limpiarFiltros: () => set({
        filtros: {
            estatus: 'active'
        }
    })
}))

export default useCompetenciaStore;