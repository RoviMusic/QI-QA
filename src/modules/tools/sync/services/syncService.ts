import dbConnect from "@/lib/mongodb";
import ErrorsModel, { ErrorsSchema, IErrors } from "../models/ErrorsModel";
import { ISummary, SummarySchema } from "../models/SummaryModel";
import { ActivitySchema, IActivity } from "../models/ActivityModel";

export async function GetSync48hErrors() {
  try {
    const conn = await dbConnect();

    const db = conn.connection.useDb("RM_stock_sync", { useCache: true });

    const DB_ErrorsModel =
      db.models.Errors || db.model<IErrors>("Errors", ErrorsSchema);

    const errors = await DB_ErrorsModel.find({
      timestamp: { $gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    })
      .sort({ _id: -1 })
      .lean();

    return JSON.parse(JSON.stringify(errors));
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo obtener la lista de errores.");
  }
}

export async function GetSyncSummary() {
  try {
    const conn = await dbConnect();

    const db = conn.connection.useDb("RM_stock_sync", { useCache: true });

    const DB_SummaryModel =
      db.models.Summary || db.model<ISummary>("Summary", SummarySchema);
    const summary = await DB_SummaryModel.find({})
      .sort({ _id: -1 })
      .limit(1)
      .lean();

    return JSON.parse(JSON.stringify(summary));
  } catch (error) {
    console.error(error);
    throw new Error("No se pudieron obtener los datos del sincronizador.");
  }
}

export async function GetCicleError(start_date: any, end_date: any) {
  try {
    const conn = await dbConnect();

    const db = conn.connection.useDb("RM_stock_sync", { useCache: true });

    const DB_ErrorsModel =
      db.models.Errors || db.model<IErrors>("Errors", ErrorsSchema);

    const errors = await DB_ErrorsModel.find({
      timestamp: { $gte: start_date, $lte: end_date },
    })
      .sort({ _id: -1 })
      .lean();

    return JSON.parse(JSON.stringify(errors));
  } catch (error) {
    console.error(error);
    throw new Error("No se pudieron obtener los datos del sincronizador.");
  }
}

export async function GetSyncActivity(): Promise<IActivity[]> {
  try {
    const conn = await dbConnect();

    const db = conn.connection.useDb("RM_stock_sync", { useCache: true });

    const DB_ActivityModel =
      db.models.Activity || db.model<IActivity>("Activity", ActivitySchema);
    const activity = await DB_ActivityModel.find({})
      .sort({ _id: -1 })
      .limit(1)
      .lean();

    return JSON.parse(JSON.stringify(activity));
  } catch (error) {
    console.error(error);
    throw new Error("No se pudieron obtener los datos del sincronizador.");
  }
}
