import { DinamicColumnsType } from "@/shared/types/tableTypes";

export type FullfilmentResponseType = {
    success: boolean;
    data?: any[];
    columns?: any[];
    message?: string;
    authToken: string;
}

export type FullfilmentType = {
    data: any[];
    columns: DinamicColumnsType[];
    authToken: string
}