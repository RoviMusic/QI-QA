import { dolibarrPool } from "@/lib/mysqldb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rowid = searchParams.get("rowid");
    const entrepot = searchParams.get("entrepot")
    let sql = "";

    if (rowid != undefined && entrepot != undefined) {
      sql = `select reel from llx_product_stock where fk_product=${rowid} and fk_entrepot=${entrepot} LIMIT 1`;
    }

    const [rows] = await dolibarrPool.execute(sql);

    return Response.json({
      data: rows,
    });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}