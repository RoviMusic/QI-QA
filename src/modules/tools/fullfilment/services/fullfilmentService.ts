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
        "/full_info"
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
}

export const fullfilmentService = new FullfilmentService();
