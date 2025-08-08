import { mainApi } from "@/lib/api/client";
import { GenericResponseTableType, GenericTableType } from "@/shared/types/tableTypes";

export class PublicationsLossesService {
  async getPublicationsLosses(): Promise<GenericTableType> {
    try {
      const response = await mainApi.get<GenericResponseTableType>("/publicationsLosses", {timeout: 60000 * 40});
      
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

export const publicationsLossesService = new PublicationsLossesService();
