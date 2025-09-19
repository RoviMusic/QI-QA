import { dolibarrPool } from "@/lib/mysqldb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rowid = searchParams.get("rowid");

    if (!rowid) {
      return Response.json(
        { error: "Missing rowid parameter" },
        { status: 400 }
      );
    }

    // Consulta todos los stocks de los almacenes de este producto
    const sql = `
      SELECT fk_entrepot, reel
      FROM llx_product_stock
      WHERE fk_product = ?
    `;

    const [rows] = await dolibarrPool.query(sql, [rowid]);

    // Convertimos el resultado en un mapa: { fk_entrepot: reel }
    const stockMap: Record<number, number> = {};
    (rows as any[]).forEach((row) => {
      stockMap[row.fk_entrepot] = row.reel;
    });

    return Response.json({ data: stockMap });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
