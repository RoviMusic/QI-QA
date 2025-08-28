"use server";
import { dolibarrPool } from "@/lib/mysqldb";

export async function GetExtraData(sku: string) {
  try {
    let sql = `SELECT p.label as product, pe.modelo as model
    FROM llx_product p 
    INNER JOIN llx_product_extrafields pe ON p.rowid = pe.fk_object WHERE p.ref = '${sku}' LIMIT 1`;

    const [response] = await dolibarrPool.execute(sql);

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudieron obtener los datos adicionales.");
  }
}
