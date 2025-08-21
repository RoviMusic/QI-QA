import { mainApi } from "@/lib/api/client";
import { GenericResponseTableType, GenericTableType } from "@/shared/types/tableTypes";

export class CreatedListingsService {
  async getCreatedListings(): Promise<GenericTableType> {
    try {
      const response = await mainApi.get<GenericResponseTableType>("/createdListings");
      console.log("data fetched:", response);

      if (!response.success) {
        console.error("Error fetching:", response.message);
        throw new Error(response.message || "Failed to fetch data");
      }

      return {
        data: response.data || [],
        columns: response.columns || [],
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}

export const createdListingsService = new CreatedListingsService();
