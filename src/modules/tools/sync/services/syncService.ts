import dbConnect from "@/lib/mongodb";
import ErrorsModel, { ErrorsSchema, IErrors } from "../models/ErrorsModel";
import { ISummary, SummarySchema } from "../models/SummaryModel";

export async function GetSyncErrors(){
    try{
        const conn = await dbConnect();

        const db = conn.connection.useDb('RM_stock_sync', { useCache: true });
        console.log('Usando la base de datos:', db.name);

        const DB_ErrorsModel = db.models.Errors || db.model<IErrors>('Errors', ErrorsSchema);

        const errors = await DB_ErrorsModel.find({}).lean();

        return JSON.parse(JSON.stringify(errors))
    }catch (error){
        console.error(error);
        throw new Error('No se pudo obtener la lista de errores.')
    }
}

export async function GetSyncSummary(){
    try{
        const conn = await dbConnect();

        const db = conn.connection.useDb('RM_stock_sync', { useCache: true})

        const DB_SummaryModel = db.models.Summary || db.model<ISummary>('Summary', SummarySchema);
        const summary = await DB_SummaryModel.find({}).limit(3).lean();
        console.log('summary from dbconnect ', summary)

        return JSON.parse(JSON.stringify(summary))

    }catch (error){
        console.error(error);
        throw new Error('No se pudieron obtener los datos del sincronizador.')
    }
}