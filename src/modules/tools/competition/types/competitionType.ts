export type MainTableType = {
    id: string;
    title: string;
    brand: string;
    price: number;
    status: string;
    sold: number;
}

export type RoviDataType = {
    precio: number;
    margen: number;
    ganancia: number;
    ingreso: number;
    actual: number;
    minimo: number;
    ideal: number;
    cantidad: number;
    stock: number;
    id: string;
}

export type CompetenciaDataType = {
    precio: number;
    vendedor: string;
    id: string;
    titulo: string;
    cantidadVentas: number;
}
