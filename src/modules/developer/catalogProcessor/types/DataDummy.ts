export type DataDummyType = {        // Estructura base de productos de Dolibarr
  sku: string;
  productName: string;
  categories: string;
  upc: string;
  model: string;
  brand: string;
  supplier: string;
};

export type PendingProductType = {   // Productos que necesitan revision manual
  sku: string;
  dolibarr: DataDummyType;
  excel: any;
  flags: string[];
}

export type FieldsUpdatedType = {      // Campos actualizados con sus valores nuevos
  sku: string;
  updatedValues: UpdatedValuesType[];
}

export type UpdatedValuesType = {   // Par que contiene clave-valor para las actualizaciones
  key: string;
  value: string;
}

export type SendingRowType = {     // Estructura completa para enviar datos a Dollibar
  CATEGORY: string;
  SKU: string;
  NAME: string;
  BRAND: string;
  MODEL: string;
  SUPPLIER: string;
  SAT_CODE: string;
  SERIAL_NUMBER: string;
  UPC: string;
  LENGTH: number;
  WIDTH: number;
  HEIGHT: number;
  MEASUREMENTS_UNIT: string;
  WEIGHT: number;
  WEIGHT_UNIT: string;
  SEO_NAME: string;
  SHORT_DESCRIPTION: string;
  DESCRIPTION: string;
  TECH_SPECS: string;
  IMAGES: string[];
  CAT_ML: string;
  CAT_AMAZON: string;
  CAT_COPPEL: string;
  CAT_WALMART: string;
  RM_MEASUREMENTS: string;
  RM_WEIGHT: string;
  COUNTRY: string;
  STOCK: number;
  LOCATION_IN_STORES: string[];
  EQUIVALENT_ITEMS: string[];
  RELATED_ITEMS: string[];
  REPLACEMENT_ITEMS: string[];
  VARIANTS_ITEMS: string[];
}

export type SendingRowType2 = {
  CODIGO: string;
  DIVISION: string;
  CLAVEDIV: string;
  MARCA: string;
  ESTADO: string;
  EXISTENCIA: string;
  NOMBRE: string;
  MODELO: string;
  MULTIPLO: number;
  PRECIOSINIVA: number;
  PRECIOSUGIVA: number;
  PRECIOMINIVA: number;
  MARKETPLACEIVA: number;
  DESC: number;
  PROMDISTSINIVA: number;
  PROMSGCONIVA: number;
  PROMMINCONIVA: number;
  MARKETPLACESUGCONIVA: number;
}


export const dataDummy: DataDummyType[] = [          // Datos simulados de dollibar (Incluye distintos casos de prueba)
    //deberia salir pendiente
  {
    sku: "GC-36-INDIE",
    productName: "Producto A",
    categories: "INSTRUMENTOS/CUERDA/PULSADA/GUITARRA/ACUSTICA/CLASICA",
    upc: "0123456789012",
    model: "Model A",
    brand: "Brand A",
    supplier: "Supplier A",
  },
  //deberia hacer un update
  {
    sku: "U-21-GALACTICA",
    productName: "",
    categories: "",
    upc: "",
    model: "",
    brand: "",
    supplier: "",
  },
  //no debe hacer nada
  {
    sku: "GC-39-MAHOGANY-Q",
    productName: "GUITARRA CLÁSICA 4/4 CON CORTE Y ECUALIZADOR DE 4 BANDAS + AFINADOR. TAPA, ARO Y FONDO: MAHOGANY. TENSOR METÁLICO. CUERDAS: SAVAREZ. INCLUYE FUNDA ACOLCHADA.",
    categories: "INSTRUMENTOS/CUERDA/PULSADA/GUITARRA/ACUSTICA/CLASICA",
    upc: "",
    model: "GC-39-MAHOGANY-Q",
    brand: "BAMBOO",
    supplier: "BAMBOO"
  },
  //productos pendientes de revisar
  {
    sku: "GC-36-NORDICWOLF",
    productName: "Producto A",
    categories: "INSTRUMENTOS/CUERDA/PULSADA/GUITARRA/ACUSTICA/CLASICA",
    upc: "0123456789012",
    model: "Model A",
    brand: "Brand A",
    supplier: "Supplier A",
  },
  {
    sku: "GC-39-GREEN",
    productName: "GUITARRA ACÚSTICA CLÁSICA BAMBOO GE-39-GREEN 39 CON FUNDA",
    categories: "INSTRUMENTOS/CUERDA/PULSADA/GUITARRA/ACUSTICA/CLASICA",
    upc: "0123456789012",
    model: "Model A",
    brand: "Brand A",
    supplier: "Supplier A",
  },
  {
    sku: "U-21-AURORA",
    productName: "UKELELE SOPRANO AURORA BAMBOO INCLUYE FUNDA",
    categories: "INSTRUMENTOS/CUERDA/PULSADA/GUITARRA/ACUSTICA/CLASICA",
    upc: "0123456789012",
    model: "Model A",
    brand: "Brand A",
    supplier: "Supplier A",
  },
  {
    sku: "GC-39-NAT-Q-AR",
    productName: "Guitarra Clásica Natural con Ecualizador y Corte 39 BAMBOO",
    categories: "INSTRUMENTOS/CUERDA/PULSADA/GUITARRA/ACUSTICA/CLASICA",
    upc: "0123456789012",
    model: "Model A",
    brand: "Brand A",
    supplier: "Supplier A",
  },
];