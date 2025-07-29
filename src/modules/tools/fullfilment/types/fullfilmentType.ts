import { DinamicColumnsType } from "@/shared/types/tableTypes";

export type FullfilmentResponseType = {
    success: boolean;
    data?: any[];
    columns?: any[];
    message?: string;
}

export type FullfilmentType = {
    data: any[];
    columns: DinamicColumnsType[];
}