export type DinamicColumnsType = {
    column_id: string;
    type: "string" | "int" | "price" | "date" | "float";
    title: string;
    decimals?: number; // Para precios y flotantes
}

export type ColumnsWithActionsType = {
    column_id: string;
    type: "string" | "int" | "float" | "price" | "date" | "actions";
    title: string;
    decimals?: number; // Para precios y flotantes
    actions?: {
        icon: string;
        onPress: (record: any) => void;
        tooltip?: string;
    }[];
}