export type DinamicColumnsType = {
    column_id: string;
    type: "string" | "int" | "float" | "price" | "date" | "actions" | "link";
    title: string;
    decimals?: number; // Para precios y flotantes
    actions?: {
        icon?: string;
        onPress: (record: any) => void;
        tooltip?: string;
    }[];
    align?: "left" | "center" | "right"; // Para alinear el contenido de la columna
}

export type GenericTableType = {
    data: any[];
    columns: DinamicColumnsType[]
}

export type GenericResponseTableType = {
    success: boolean;
    data?: any[];
    columns?: DinamicColumnsType[];
    message?: string;
}