"use server";

import { query } from "@/modules/reports/helpers/db";
import { MarketsIDEnum } from "@/shared/enums/MarketEnum";
import { ActionResult } from "next/dist/server/app-render/types";

export async function GetStocks(): Promise<ActionResult> {
  try {
    // Obtén los valores de MarketsIDEnum como array
    const warehouseIds = Object.values(MarketsIDEnum).filter(
      (v) => typeof v === "number"
    );

    // Convierte el array en una cadena separada por comas
    const warehouseIdsStr = warehouseIds.join(",");

    const sql = `SELECT
            p.rowid AS idProduct,
            p.ref AS sku,
            ps.reel AS stock,
            p.label AS label,
            e.rowid AS idWarehouse,
            e.ref AS warehouse
        FROM llx_product_stock ps
        INNER JOIN llx_product   p ON p.rowid = ps.fk_product
        INNER JOIN llx_entrepot  e ON e.rowid = ps.fk_entrepot
        WHERE ps.fk_entrepot IN (${warehouseIdsStr})
        AND ps.reel > 0
        ORDER BY e.ref, p.ref;`;

    const stocks = await query(sql);

    return {
      success: true,
      data: stocks,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
