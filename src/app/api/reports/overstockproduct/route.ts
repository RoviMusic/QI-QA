import { query } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = `
    SELECT 
      p.rowid, p.ref, p.label, p.price_ttc, 
      ps.reel as stock, e.ref as entrepot, 
      (SELECT pw.desiredstock 
       FROM llx_product_warehouse_properties pw 
       WHERE pw.fk_product=p.rowid AND pw.fk_entrepot=ps.fk_entrepot 
       LIMIT 1) as desiredstock, 
      (SELECT pw.seuil_stock_alerte 
       FROM llx_product_warehouse_properties pw 
       WHERE pw.fk_product=p.rowid AND pw.fk_entrepot=ps.fk_entrepot 
       LIMIT 1) as seuil_stock_alerte 
    FROM llx_product p, llx_product_stock ps, llx_entrepot e 
    WHERE p.rowid=ps.fk_product 
      AND ps.fk_entrepot=e.rowid 
      AND ps.fk_entrepot > 1 
      AND IF((SELECT COUNT(*) 
              FROM llx_product_warehouse_properties pw 
              WHERE pw.fk_product=p.rowid 
                AND pw.fk_entrepot=ps.fk_entrepot) > 0, 
           (SELECT pw.desiredstock 
            FROM llx_product_warehouse_properties pw 
            WHERE pw.fk_product=p.rowid 
              AND pw.fk_entrepot=ps.fk_entrepot 
            LIMIT 1), 0) < ps.reel
  `;
  const rows = await query(sql);

  return NextResponse.json(rows);
}
