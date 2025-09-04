export enum WarehouseEnum {
  Cedis = 1,
  ML = 12,
}

export type WarehouseType = keyof typeof WarehouseEnum;
