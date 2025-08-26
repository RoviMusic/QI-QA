// app/api/check_ref/route.ts
import { queryOne } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref") ?? "";
  const row = await queryOne<{ total: number }>(
    `
    SELECT COUNT(*) AS total
    FROM llx_product
    WHERE ref = ?
  `,
    [ref]
  );
  return NextResponse.json(row?.total ?? 0);
}
