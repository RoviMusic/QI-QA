import { mainApi, processApi } from "@/lib/api/client";
import { ProcessorType } from "../types/processorTypes";
import dbConnect from "@/lib/mongodb";
import { ProcessorSchema } from "../models/MeliProcessedModel";
import { MeliErrorsSchema } from "../models/MeliErrorsModel";
import { MeliPendingSchema } from "../models/MeliPendingModel";
import { AmazonErrorsSchema } from "../models/AmazonErrorsModel";
import { AmazonPendingSchema } from "../models/AmazonPendingModel";

// export class ProcessService {
//   async getProcesser(): Promise<ProcessorType> {
//     try {
//       const response = await processApi.get<any>("");

//       // if (!response.success) {
//       //   console.error("Error fetching data:", response.message);
//       //   throw new Error(response.message || "Failed to fetch data");
//       // }

//       return response;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       throw error;
//     }
//   }
// }

// export const processService = new ProcessService();

async function getProcessorCollection<T>(modelName: string, schema: any): Promise<T[]> {
  try{
    const conn = await dbConnect();
    const db = conn.connection.useDb("dolibarr_processor", {useCache: true});
    const Model = db.models[modelName] || db.model<T>(modelName, schema);
    const data = await Model.find({}).sort({_id: -1}).lean();
    return JSON.parse(JSON.stringify(data));
  }catch(error){
    console.error(error);
    throw new Error("No se pudieron obtener los datos del sincronizador.")
  }
}

export async function GetProcesserMeli(): Promise<any> {
  return getProcessorCollection("Processor", ProcessorSchema);
}

export async function GetErrorsMeli(): Promise<any> {
  return getProcessorCollection("MeliErrors", MeliErrorsSchema)
}

export async function GetPendingMeli(): Promise<any> {
  return getProcessorCollection("MeliPending", MeliPendingSchema)
}

export async function GetAllMeliData(): Promise<any>{
  const [processor, errors, pending] = await Promise.all([GetProcesserMeli(), GetErrorsMeli(), GetPendingMeli()]);
  const addDetails = (items: any[] | undefined, market: string, type: string) => (items || []).map((item) => ({...item, market, type}));

  return [
    ...addDetails(processor, "Mercado Libre", "processed"),
    ...addDetails(errors, "Mercado Libre", "errors"),
    ...addDetails(pending, "Mercado Libre", "pending")
  ]
}

export async function GetErrorAmazon(): Promise<any> {
  return getProcessorCollection("AmazonErrors", AmazonErrorsSchema)
}

export async function GetPendingAmazon(): Promise<any>{
  return getProcessorCollection("AmazonPending", AmazonPendingSchema)
}

export async function GetAllAmazonData(): Promise<any>{
  const [errors, pending] = await Promise.all([GetErrorAmazon(), GetPendingAmazon()]);
  const addDetails = (items: any[] | undefined, market: string, type: string) => (items || []).map((item) => ({...item, market, type}));

  return [
    ...addDetails(errors, "Amazon", "errors"),
    ...addDetails(pending, "Amazon", "pending")
  ]
}