export type ProcessorType = {
    pending: DataProcessorType[];
    processed: DataProcessorType[];
    errors: DataProcessorType[];
}

export type DataProcessorType = {
    sale_id: string;
    market: string;
    sale_date: Date | null;
    message: string;
}