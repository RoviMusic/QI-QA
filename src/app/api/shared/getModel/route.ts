import { query } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sku = searchParams.get("sku") ?? "";
  const sql = `SELECT p.label as product, pe.modelo as model
    FROM llx_product p 
    INNER JOIN llx_product_extrafields pe ON p.rowid = pe.fk_object WHERE p.ref = '${sku}' LIMIT 1`;
  const rows = await query(sql);

  return NextResponse.json(rows);
}
