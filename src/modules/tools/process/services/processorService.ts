import dbConnect from "@/lib/mongodb";
import { ProcessorSchema } from "../models/MeliProcessedModel";
import { MeliErrorsSchema } from "../models/MeliErrorsModel";
import { MeliPendingSchema } from "../models/MeliPendingModel";
import { AmazonErrorsSchema } from "../models/AmazonErrorsModel";
import { AmazonPendingSchema } from "../models/AmazonPendingModel";
import { ProcessorMongoType } from "../types/processorTypes";

async function getProcessorCollection<T>(
  modelName: string,
  schema: any
): Promise<T[]> {
  try {
    const conn = await dbConnect();
    const db = conn.connection.useDb("dolibarr_processor", { useCache: true });
    const Model = db.models[modelName] || db.model<T>(modelName, schema);
    const data = await Model.find({}).sort({ _id: -1 }).lean();
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    throw new Error("No se pudieron obtener los datos del procesador.");
  }
}

export async function GetProcesserMeli(): Promise<any> {
  return getProcessorCollection("Processor", ProcessorSchema);
}

export async function GetErrorsMeli(): Promise<any> {
  return getProcessorCollection("MeliErrors", MeliErrorsSchema);
}

export async function GetPendingMeli(): Promise<any> {
  return getProcessorCollection("MeliPending", MeliPendingSchema);
}

export async function GetAllMeliData(): Promise<any> {
  const [processor, errors, pending] = await Promise.all([
    GetProcesserMeli(),
    GetErrorsMeli(),
    GetPendingMeli(),
  ]);
  const addDetails = (items: any[] | undefined, market: string, type: string) =>
    (items || []).map((item) => ({ ...item, market, type }));

  return [
    ...addDetails(processor, "Mercado Libre", "processed"),
    ...addDetails(errors, "Mercado Libre", "errors"),
    ...addDetails(pending, "Mercado Libre", "pending"),
  ];
}

export async function GetErrorAmazon(): Promise<any> {
  return getProcessorCollection("AmazonErrors", AmazonErrorsSchema);
}

export async function GetPendingAmazon(): Promise<any> {
  return getProcessorCollection("AmazonPending", AmazonPendingSchema);
}

export async function GetAllAmazonData(): Promise<any> {
  const [errors, pending] = await Promise.all([
    GetErrorAmazon(),
    GetPendingAmazon(),
  ]);
  const addDetails = (items: any[] | undefined, market: string, type: string) =>
    (items || []).map((item) => ({ ...item, market, type }));

  return [
    ...addDetails(errors, "Amazon", "errors"),
    ...addDetails(pending, "Amazon", "pending"),
  ];
}

export async function GetAllProcessorData(): Promise<any> {
  const [meliData, amazonData] = await Promise.all([
    GetAllMeliData(),
    GetAllAmazonData(),
  ]);
  const allData = [...meliData, ...amazonData].sort((a, b) => {
    const dateA = new Date(a.sale_date).getTime();
    const dateB = new Date(b.sale_date).getTime();

    // Si alguna fecha es inválida, ponla al final
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateB - dateA;
  });

  return allData;
}

export async function GetProcessorActivity(): Promise<any> {
  try {
    console.log(`🔍 Verificando actividad del procesador - ${new Date()}`);
    const allData: ProcessorMongoType[] = await GetAllProcessorData();
    const now = new Date();
    const lastDate = new Date(allData[0].sale_date);
    const diffMs = now.getTime() - lastDate.getTime();
    const diffMin = Math.floor(diffMs / 1000 / 60);
    if (diffMin > 70) {
      return { status: "error", text: "Procesador sin actividad" };
    }

    const recentData = allData.filter((item: any) => {
      const itemDate = new Date(item.sale_date);
      const diffInMinutes = (now.getTime() - itemDate.getTime()) / (1000 * 60);
      return diffInMinutes <= 60; // Filtrar los datos de los últimos 60 minutos
    });

    let totalErrors = 0;

    recentData.map((item) => {
      if (item.type == "errors") ++totalErrors;
    });

    const getErrorPercentage = (totalErrors * 100) / recentData.length;

    if (getErrorPercentage >= 10 && getErrorPercentage < 30) {
      return {
        status: "warning",
        text: `Procesador con ${getErrorPercentage.toFixed(2)}% de errores`,
      };
    } else if (getErrorPercentage >= 30 && getErrorPercentage < 50) {
      return {
        status: "error",
        text: `Procesador con ${getErrorPercentage.toFixed(2)}% de errores`,
      };
    } else if (getErrorPercentage >= 50) {
      return {
        status: "error",
        text: `Procesador con ${getErrorPercentage.toFixed(2)}% de errores`,
      };
    }
    const pendingData = recentData.filter((item) => item.type == "pending");
    for (const item of pendingData) {
      const itemDate = new Date(item.sale_date);
      const diffInMinutes = (now.getTime() - itemDate.getTime()) / (1000 * 60);
      if (diffInMinutes >= 10) {
        console.log("han pasado mas de 10 min en este item ", item.sale_id);
        return { status: "error", text: `Procesador con órdenes pendientes` };
      }
    }

    return { status: "success", text: `Procesador en funcionamiento` };
  } catch (error) {
    console.error("❌ Error al verificar actividad del procesador:", error);
    return { status: "error", text: `Error desconocido` };
  }
}
