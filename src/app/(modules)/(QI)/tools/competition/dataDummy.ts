import { DinamicColumnsType } from "@/shared/types/tableTypes";

export interface DataType {
    key: React.Key;
    sku: string;
    label: string;
    estatus: 'Activo' | 'Inactivo';
    ventas: number;
    description?: string; // Optional field for additional information
}

export interface DetallesType {
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

export interface ComparisionType {
    id: string;
    title: string;
    data: DetallesType[]
} 

export interface CompetenciaType {
    precio: number;
    vendedor: string;
    id: string;
    titulo: string;
    cantidadVentas: number;
}

export const data: DataType[] = [
    {
        key: '1',
        sku: '0377008583',
        label: 'GUITARRA ELÉCTRICA SQUIER TELECASTER LIMITED LE OFF TELE SJ LRL PPG MH IBM SQUIER',
        estatus: 'Activo',
        ventas: 100,
        description: 'Descripción del Producto 1', // Optional field
    },
    {
        key: '2',
        sku: '3012FAN1HG',
        label: 'ACORDEON BOTONES FA NEGRO 3012 BN FARINELLI PREMIUM',
        estatus: 'Inactivo',
        ventas: 50,
        description: 'Descripción del Producto 2', // Optional field
    },
    {
        key: '3',
        sku: 'BLX24R/B58-J11',
        label: 'SISTEMA SHURE INALAMBRICO C/MICROFONO DE MANO PARA VOZ RECEPTOR RACK',
        estatus: 'Activo',
        ventas: 75,
        description: 'Descripción del Producto 3', // Optional field
    },
    {
        key: '4',
        sku: 'GC-36-RAINBOW',
        label: 'GUITARRA ACÚSTICA CLÁSICA BAMBOO GC-36-RAINBOW CON FUNDA',
        estatus: 'Inactivo',
        ventas: 30,
        description: 'Descripción del Producto 4', // Optional field
    },
    {
        key: '5',
        sku: 'RADIMDP158FSPWHI',
        label: 'PASTILLA HUMBUCKER P/BRAZO EVOLUTION',
        estatus: 'Activo',
        ventas: 200,
        description: 'Descripción del Producto 5', // Optional field
    },
]

export const dataDetalles: DetallesType[] = [
    {
        precio: 1000,
        margen: 20,
        ganancia: 200,
        ingreso: 1200,
        actual: 1500,
        minimo: 800,
        ideal: 1000,
        cantidad: 10,
        stock: 50,
        id: 'MLM123456789',
    },
    {
        precio: 800,
        margen: 15,
        ganancia: 120,
        ingreso: 920,
        actual: 1000,
        minimo: 600,
        ideal: 800,
        cantidad: 5,
        stock: 30,
        id: 'MLM987654321',
    }
];

export const dataComparision: ComparisionType[] = [
    {
        id: '1',
        title: 'Full clasica gratis',
        data: dataDetalles
    },
    {
        id: '2',
        title: 'dropoff clasica gratis',
        data: dataDetalles
    },
    {
        id: '3',
        title: 'full premium gratis',
        data: dataDetalles
    },
    {
        id: '4',
        title: 'dropoff premium gratis',
        data: dataDetalles
    },
    {
        id: '5',
        title: 'Full clasica gratis',
        data: dataDetalles
    },
    {
        id: '6',
        title: 'Full clasica gratis',
        data: dataDetalles
    }
]

export const dataCompetencia: CompetenciaType[] = [
    {
        precio: 950,
        vendedor: 'Vendedor A',
        id: 'COMP123',
        titulo: 'GUITARRA ELÉCTRICA SQUIER TELECASTER LIMITED LE OFF TELE SJ LRL PPG MH IBM SQUIER',
        cantidadVentas: 120,
    },
    {
        precio: 900,
        vendedor: 'Vendedor B',
        id: 'COMP456',
        titulo: 'ACORDEON BOTONES FA NEGRO 3012 BN FARINELLI PREMIUM',
        cantidadVentas: 150
    }
]

export interface FiltrosType {
    id: string;
    in: boolean;
    ex: boolean;
    price: number;
    title: string;
    idImage: number;
}

export const dataFiltros: FiltrosType[] = [
    {
        id: 'MLM1456133041',
        in: false,
        ex: false,
        price: 1206,
        title: 'Amadeus Cellini AMVL001',
        idImage: 200
    },
    {
        id: 'MLM2164033679',
        in: false,
        ex: true,
        price: 2903,
        title: 'Amadeus Cellini AMVL001',
        idImage: 230
    },
    {
        id: 'MLM832171117',
        in: true,
        ex: false,
        price: 2903,
        title: 'Amadeus Cellini AMVL001',
        idImage: 430
    },
    {
        id: 'MLM1982663113',
        in: false,
        ex: false,
        price: 1206,
        title: 'Amadeus Cellini AMVL001',
        idImage: 12
    },
    {
        id: 'MLM3179368312',
        in: false,
        ex: false,
        price: 1206,
        title: 'Amadeus Cellini AMVL001',
        idImage: 20
    },
    {
        id: 'MLM1991136261',
        in: false,
        ex: false,
        price: 1206,
        title: 'Amadeus Cellini AMVL001',
        idImage: 230
    },
]