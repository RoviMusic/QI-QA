// app/api/check_proveedor/route.ts
import { queryOne } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const proveedor = searchParams.get("proveedor") ?? "";
  const row = await queryOne<{ total: number }>(
    `
    SELECT COUNT(*) AS total
    FROM llx_product_extrafields
    WHERE catproveedor = ?
  `,
    [proveedor]
  );
  return NextResponse.json(row?.total ?? 0);
}
