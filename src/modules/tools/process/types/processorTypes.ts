export type ProcessorType = {
    meli: StatusProcessorType;
    amazon: StatusProcessorType;
    wl: StatusProcessorType;
    cop: StatusProcessorType;
}

export type StatusProcessorType = {
    pending: DataProcessorType[];
    processed: DataProcessorType[];
    errors: DataProcessorType[];
}

export type DataProcessorType = {
    sale_id: string;
    sale_date: Date | null;
    message: string;
    order_items: [{sku: string; requested_quantity: number}];
    market?: "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";
}