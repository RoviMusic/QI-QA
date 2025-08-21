import { dolibarrPool } from "@/lib/mysqldb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rowid = searchParams.get("rowid");
    let sql = "";

    if (rowid != undefined) {
      sql = `SELECT c.description FROM llx_categorie c, llx_categorie_product cp WHERE c.rowid=cp.fk_categorie AND cp.fk_product = ${rowid}`;
    }

    const [rows] = await dolibarrPool.execute(sql);

    return Response.json({
      data: rows,
    });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}