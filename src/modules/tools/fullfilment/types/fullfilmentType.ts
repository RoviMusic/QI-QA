import { DinamicColumnsType } from "@/shared/types/tableTypes";

export type FullfilmentResponseType = {
  success: boolean;
  data?: any[];
  columns?: any[];
  message?: string;
  authToken: string;
};

export type FullfilmentType = {
  data: any[];
  columns: DinamicColumnsType[];
  authToken: string;
};

export type FullfilmentData = {
  rowid: number;
  item: string;
  ref: string;
  marca?: string;
  v30: number;
  min: number;
  max: number;
  stock: number;
  abastecer?: number;
  final?: number;
  sales?: number;
};
