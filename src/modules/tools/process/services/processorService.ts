import { mainApi, processApi } from "@/lib/api/client";

export class ProcessService {
  async getProcesser(): Promise<any> {
    try {
      const response = await processApi.get<any>('');

      // if (!response.success) {
      //   console.error("Error fetching data:", response.message);
      //   throw new Error(response.message || "Failed to fetch data");
      // }

      return response
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}

export const processService = new ProcessService();
