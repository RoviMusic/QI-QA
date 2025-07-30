export enum MarketsEnmu {
    Amazon = "Amazon",
    Coppel = "Coppel",
    Meli = "Mercado Libre",
    Walmart = "Walmart",
}

export type MarketsType = keyof typeof MarketsEnmu;

