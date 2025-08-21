export type ProcessorType = {
    meli: StatusProcessorType | null;
    amazon: StatusProcessorType | null;
    wl: StatusProcessorType | null;
    cop: StatusProcessorType | null;
}

export type StatusProcessorType = {
    pending: DataProcessorType[];
    processed: DataProcessorType[];
    error: DataProcessorType[];
}

export type DataProcessorType = {
    sale_id: string;
    sale_date: Date | null;
    message: string;
    order_items: [{sku: string; requested_quantity: number}];
    order?: any;
    order_reference?: string[] | string,
    market?: "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";
    order_dolibarr_id?: string;
    invoice_id?: string;
    invoice_reference?: string;
    shipment_reference?: string;
    pack_id?: string;
    shipment_type: string;
}