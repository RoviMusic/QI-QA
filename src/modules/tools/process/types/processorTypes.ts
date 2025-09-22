export type ProcessorMongoType = {
  sale_id: string;
  sale_date: Date;
  message: string;
  order_items: [{ sku: string; requested_quantity: number }];
  order_reference?: string[] | string;
  market: "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";
  shipment_type: string;
  type: "processed" | "errors" | "pending";
  pack_id: string | null;
};

export type StatusProcessorType = {
  pending: DataProcessorType[];
  processed: DataProcessorType[];
  error: DataProcessorType[];
};

export type DataProcessorType = {
  sale_id: string;
  sale_date: Date | null;
  message: string;
  order_items: [{ sku: string; requested_quantity: number }];
  order?: any;
  order_reference?: string[] | string;
  market?: "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";
  order_dolibarr_id?: string;
  invoice_id?: string;
  invoice_reference?: string;
  shipment_reference?: string;
  pack_id?: string;
  shipment_type: string;
};
