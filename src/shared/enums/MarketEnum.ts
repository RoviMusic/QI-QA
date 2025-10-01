export enum MarketsEnmu {
  Amazon = "Amazon",
  Coppel = "Coppel",
  Meli = "Mercado Libre",
  Walmart = "Walmart",
}

export enum MarketsIDEnum {
  Meli = 12,
  Full = 16,
  FBA = 22,
  Amazon = 26,
  Liverpool = 28,
  Coppel = 30,
  Walmart = 45,
}

//12 = mercado libre, 16 = full, 22 = fba, 26 = amazon, 28 = liverpool, 30 = coppel, 45 = walmart

export type MarketsType = keyof typeof MarketsEnmu;
