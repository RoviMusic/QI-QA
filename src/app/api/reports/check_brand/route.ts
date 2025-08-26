// app/api/check_marca/route.ts
import { queryOne } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const marca = searchParams.get("marca") ?? "";
  const row = await queryOne<{ total: number }>(`
    SELECT COUNT(*) AS total
    FROM llx_product_extrafields
    WHERE marcaproducto = ?
  `, [marca]);
  return NextResponse.json(row?.total ?? 0);
}
