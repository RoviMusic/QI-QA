import { queryOne } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fk_product = Number(searchParams.get("fk_product") ?? "0");
  const entrepot = Number(searchParams.get("entrepot") ?? "0");
  if (!fk_product || !entrepot) return NextResponse.json("", { status: 200 });

  const sql = `
    SELECT pw.seuil_stock_alerte AS v
    FROM llx_product_warehouse_properties pw
    WHERE pw.fk_product = ${fk_product} AND pw.fk_entrepot = ${entrepot}
    LIMIT 1
  `;
  const row = await queryOne<{ v: number | null }>(sql, [fk_product, entrepot]);
  return NextResponse.json(row?.v ?? "");
}
