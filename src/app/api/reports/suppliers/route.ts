// app/api/proveedores/route.ts
import { query } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

type CatRow = { catproveedor: string | null };

export async function GET() {
  const rows = await query<CatRow>(`
    SELECT DISTINCT pe.catproveedor
    FROM llx_product_extrafields pe
    WHERE pe.catproveedor IS NOT NULL
    ORDER BY pe.catproveedor ASC
  `);
  return NextResponse.json(rows.map(r => r.catproveedor).filter(Boolean));
}
