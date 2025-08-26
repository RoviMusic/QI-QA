// app/api/marcas/route.ts
import { query } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

type MarcaRow = { marcaproducto: string | null };

export async function GET() {
  const rows = await query<MarcaRow>(`
    SELECT DISTINCT pe.marcaproducto AS marcaproducto
    FROM llx_product_extrafields pe
    WHERE pe.marcaproducto IS NOT NULL
    ORDER BY pe.marcaproducto ASC
  `);

  const marcas = rows
    .map((r) => r.marcaproducto)
    .filter((v): v is string => !!v);

  return NextResponse.json(marcas);
}
