import { queryOne } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rowid = Number(searchParams.get("rowid") ?? "0");
  if (!rowid) return NextResponse.json("NULL");

  const sql = `
    SELECT COUNT(DISTINCT ref_fourn) as total, ref_fourn
    FROM llx_product_fournisseur_price
    WHERE fk_product = ${rowid}
    ORDER BY tms DESC
    LIMIT 1
  `;
  const row = await queryOne<{ total: number; ref_fourn: string | null }>(sql, [
    rowid,
  ]);
  if (!row || row.total === 0) return NextResponse.json("NULL");
  if (row.total === 1) return NextResponse.json(row.ref_fourn ?? "NULL");
  return NextResponse.json("ERROR");
}
