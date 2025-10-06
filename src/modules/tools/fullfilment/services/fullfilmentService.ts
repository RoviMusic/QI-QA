import { mainApi } from "@/lib/api/client";
import {
  FullfilmentData,
  FullfilmentResponseType,
  FullfilmentType,
} from "../types/fullfilmentType";

export class FullfilmentService {
  // Aquí puedes definir métodos específicos para el servicio de Fullfilment
  async getFulfillmentData(): Promise<FullfilmentType> {
    try {
      const response = await mainApi.get<FullfilmentResponseType>(
        "/fulfillment_p1",
        { timeout: 60000 * 5 }
      );
      console.log("Fulfillment data fetched:", response);

      if (!response.success) {
        console.error("Error fetching fulfillment data:", response.message);
        throw new Error(response.message || "Failed to fetch fulfillment data");
      }

      return {
        data: response.data || [],
        columns: response.columns || [],
        authToken: response.authToken || "",
      };
    } catch (error) {
      console.error("Error fetching fulfillment data:", error);
      throw error;
    }
  }

  async processFulfillmentItem(
    inventory_id: string,
    authToken: string
  ): Promise<void> {
    try {
      const response: any = await mainApi.post(
        `fulfillment?inventory_id=${inventory_id}&authToken=${authToken}`,
        { timeout: 60000 * 5 }
      );
      //console.warn("Fulfillment item processed:", response);
      if (!response.success) {
        console.error("Error processing fulfillment item:", response.message);
        throw new Error(
          response.message || "Failed to process fulfillment item"
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error processing fulfillment item:", error);
      throw error;
    }
  }

  async getFulfillmentAllTogether(): Promise<FullfilmentType> {
    try {
      const response = await mainApi.post<FullfilmentResponseType>(
        "/fulfillment",
        { timeout: 60000 * 5 }
      );
      console.log("Fulfillment data fetched:", response);

      if (!response.success) {
        console.error("Error fetching fulfillment data:", response.message);
        throw new Error(response.message || "Failed to fetch fulfillment data");
      }

      return {
        data: response.data || [],
        columns: response.columns || [],
        authToken: response.authToken || "",
      };
    } catch (error) {
      console.error("Error fetching fulfillment data:", error);
      throw error;
    }
  }

  async getFullfilmentV2(): Promise<FullfilmentData[]> {
    try {
      const response = await fetch("http://localhost:11002/picking-reports", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //"Access-Control-Allow-Origin": "*",
        },
      });

      const jsonResponse = await response.json();

      return jsonResponse.data;
    } catch (error) {
      console.error("Error fetching fulfillment data:", error);
      throw error;
    }
  }
}

export const fullfilmentService = new FullfilmentService();
