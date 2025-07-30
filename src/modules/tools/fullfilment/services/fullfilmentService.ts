import { mainApi } from "@/lib/api/client";
import {
  FullfilmentResponseType,
  FullfilmentType,
} from "../types/fullfilmentType";

export class FullfilmentService {
  // Aquí puedes definir métodos específicos para el servicio de Fullfilment
  async getFulfillmentData(): Promise<FullfilmentType> {
    try {
      const response = await mainApi.get<FullfilmentResponseType>(
        "/fulfillment_p1", {timeout: 60000 * 5}
      );

      if (!response.success) {
        console.error("Error fetching fulfillment data:", response.message);
        throw new Error(response.message || "Failed to fetch fulfillment data");
      }

      return {
        data: response.data || [],
        columns: response.columns || [],
      };
    } catch (error) {
      console.error("Error fetching fulfillment data:", error);
      throw error;
    }
  }

  async processFulfillmentItem(inventory_id: string): Promise<void> {
    try {
      const response: any = await mainApi.post(`fulfillment_p2?inventory_id=${inventory_id}`,{timeout: 60000 * 5} );
      //console.warn("Fulfillment item processed:", response);
      if (!response.success) {
        console.error("Error processing fulfillment item:", response.message);
        throw new Error(response.message || "Failed to process fulfillment item");
      }
      return response.data;
    } catch (error) {
      console.error("Error processing fulfillment item:", error);
      throw error;
    }
  }
}

export const fullfilmentService = new FullfilmentService();
