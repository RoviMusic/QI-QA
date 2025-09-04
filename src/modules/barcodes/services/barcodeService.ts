"use server";
import { dolibarrPool } from "@/lib/mysqldb";
import { query, queryOne } from "@/modules/reports/helpers/db";

export type BarcodeData = {
  dest: number;
  id: string;
  qty: number;
  sku: string;
  source: number;
  username: string;
  ventaml: string;
};

export type BarcodeFullData = {
  rowid: string;
  qty: number;
  ventaml: string;
  qty2: number;
  ref: string;
  label: string;
  inventory: number;
};

export async function GetBarcodeData(id: string, product_id: string) {
  try {
    const sql = `SELECT pd.ventaml id,pd.qty,pd.ventaml,pr.ref sku,p.stock_from source,p.stock_to dest,u.login username
      FROM llx_pickingdet pd
        LEFT JOIN llx_picking p ON p.rowid=pd.picking_id
        LEFT JOIN llx_product pr ON pr.rowid=pd.fk_product
        LEFT JOIN llx_user u ON u.rowid=p.fk_user_validate
      WHERE pd.picking_id=${id} AND pd.fk_product=${product_id}`;

    const response = await query<BarcodeData>(sql);

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudieron obtener los datos adicionales.");
  }
}

export async function GetBarcodeFull(id: string, fk_product: string) {
  try {
    const sql = `SELECT p.rowid, pd.qty, pd.ventaml, pd.qty2, d.ref, d.label, (SELECT inventory FROM llx_pickingfullreport WHERE item=pd.ventaml LIMIT 1) as inventory 
      FROM llx_product d, llx_picking p, llx_pickingdet pd 
      WHERE p.rowid=pd.picking_id AND pd.fk_product=d.rowid AND p.rowid=${id} AND d.rowid=${fk_product} ORDER BY pd.rowid DESC;`;

    const response = await query<BarcodeFullData>(sql);

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Error al consultar base de datos.");
  }
}

export async function UpdatePicking(id: string, fk_product: string) {
  try {
    //set flag
    // const sqlTransfer = `UPDATE llx_pickingdet SET printfull=1, date_print=now() WHERE picking_id=${id} AND fk_product=${fk_product} `;
    // await query(sqlTransfer);

    const sqlProduct = `SELECT count(*) as total FROM llx_pickingdet WHERE picking_id=${id} AND printfull is null AND qty > 0`;
    const totalStatus = await queryOne<{ total: number }>(sqlProduct);
    console.log("totalStatus", totalStatus);
    if (totalStatus && totalStatus.total === 0) {
      console.log("Actualizar a full");
      // const $sqltransfer3 = `UPDATE llx_picking SET printfull=1 WHERE rowid=${id}`;
      // await query($sqltransfer3);
    }

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar picking.");
  }
}
