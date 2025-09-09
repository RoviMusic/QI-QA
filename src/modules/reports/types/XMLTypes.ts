export type OutputMessage = {
  message: string;
  type: "success" | "error" | "warning";
  supplier?: string;
  rfc?: string;
  invoice_number?: string;
  products?: {
    description: string;
    sku: string;
    quantity: number;
    exists: boolean;
  }[];
};
