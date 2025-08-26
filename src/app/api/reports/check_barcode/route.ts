// app/api/check_barcode/route.ts
import { queryOne } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barcode = searchParams.get("barcode") ?? "";
  const row = await queryOne<{ total: number }>(
    `
    SELECT COUNT(*) AS total
    FROM llx_product
    WHERE barcode = ?
  `,
    [barcode]
  );
  return NextResponse.json(!!row?.total);
}
