export type CatalogType = {
  sku: string; //id
  categories: string[];
  generalInfo: GeneralInfoType;
  warehouseData: StockType[]; //each warehouse
  businessData: BusinessData; //cost and price
  marketData: MarketDataType;
  tags: TagsType[]; //several seo words, several relationed
};

export type GeneralInfoType = {
  externalSku: string;
  productName: string;
  supplier: string;
  dimensions: DimensionsType; //from supplier
  upc: string;
  model: string;
  brand: string;
  manufacturer: string;
  country: string;
  satCode: string;
};

export type StockType = {
  stock: number;
  warehouse: string;
};

export type BusinessData = {
  cost: number;
  price: number; //without iva
  discount?: number; //percent
  iva: number; //percent
};

export type MarketDataType = {
  shortDesc: string;
  detailedDesc: string;
  dimensions: DimensionsType;
  images: string[]; //base 64 array
  specs: SpecsType[];
};

export type TagsType = {
  type: string; // seo | synonyms | related | replacement | equivalent
  tag: string; // words | skus
};

export type SpecsType = {
  type: string; // specs or attributes
  title: string;
  description?: string;
};

export type DimensionsType = {
  //cm & kg
  length: number;
  width: number;
  height: number;
  weight: number;
};

export const dummyDataProduct: CatalogType[] = [
  {
    sku: "2814304505",
    categories: ['INSTRUMENTOS', 'CUERDA', 'PULSADA', 'BAJO', 'ELECTRICA'],
    generalInfo: {
      externalSku: "2814304505",
      productName:
        "BAJO ELÉCTRICO GRETSCH STREAMLINER JET CLUB BASS SINGLE-CUT, VINTAGE WHITE",
      supplier: "Fender",
      dimensions: {
        height: 113,
        width: 34,
        length: 4.5,
        weight: 3.5,
      },
      upc: "",
      model: "Jet Club Bass",
      brand: "GRETSCH",
      manufacturer: "Fender",
      country: "",
      satCode: "",
    },
    warehouseData: [
      {
        stock: 10,
        warehouse: "RMC",
      },
    ],
    businessData: {
      cost: 7299,
      price: 7299,
      iva: 16,
    },
    marketData: {
      shortDesc:
        "Bajo eléctrico Gretsch Streamliner Jet Club Bass con diseño Single-Cut ",
      detailedDesc:
        "El Gretsch Streamliner Jet Club Bass en Vintage White es un bajo eléctrico de escala corta que fusiona diseño clásico con potencia moderna. Su cuerpo de nato con tapa de arce ofrece un tono cálido y balanceado, ideal para una amplia variedad de géneros, desde jazz y blues hasta rock alternativo.",
      dimensions: {
        height: 113,
        width: 34,
        length: 4.5,
        weight: 3.5,
      },
      images: [""],
      specs: [
        {
          type: "specs",
          title: "Modelo",
          description: "G2220 Streamliner Jet Club Bass",
        },
        {
          type: "attribute",
          title: "Color",
          description: "Vintage White",
        },
        {
          type: "attribute",
          title: "Tipo de cuerpo",
          description: "Solid Body (Cuerpo sólido)",
        },
        {
          type: "attribute",
          title: "Material del cuerpo",
          description: "Nato con tapa de arce",
        },
        {
          type: "attribute",
          title: "Acabado",
          description: "Brillante",
        },
        {
          type: "attribute",
          title: "Mástil",
          description: "Nato",
        },
        {
          type: "attribute",
          title: "Perfil del mástil",
          description: "U delgado",
        },
        {
          type: "specs",
          title: "Escala",
          description: '30.3" (770 mm)',
        },
        {
          type: "specs",
          title: "Diapasón",
          description: 'Laurel',
        },
        {
          type: "specs",
          title: "Radio del diapasón",
          description: '12" (305 mm)',
        },
        {
          type: "specs",
          title: "Trastes",
          description: '20 medium jumbo',
        },
        {
          type: "specs",
          title: "Pastillas",
          description: "2 Broad'Tron™ BT-2S",
        },
      ],
    },
    tags: [
        {
            type: 'SEO',
            tag: 'bajo gretsch'
        },
        {
            type: 'SEO',
            tag: 'gretsch streamliner bass'
        },
        {
            type: 'SEO',
            tag: 'jet club bass'
        },
        {
            type: 'SEO',
            tag: 'bajo eléctrico vintage white'
        },
        {
            type: 'SEO',
            tag: 'bajo escala corta'
        },
        {
            type: 'SEO',
            tag: 'gretsch single cut bass'
        },
        {
            type: 'SEO',
            tag: 'bajo para rock y jazz'
        },
        {
            type: 'SEO',
            tag: 'bajo cómodo y ligero'
        }
    ]
  },
];
