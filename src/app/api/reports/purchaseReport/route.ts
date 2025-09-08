import { dolibarrPool } from "@/lib/mysqldb";
import { query } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prov = (searchParams.get("prov") ?? "").trim();
  const marca = (searchParams.get("marca") ?? "").trim();
  const stock = Number(searchParams.get("stock") ?? "0");

  const where: string[] = [];

  if (prov) {
    where.push(`pe.catproveedor LIKE '${prov}'`);
    //where.push(`%${prov}% `);
  }
  if (marca) {
    where.push(`pe.marcaproducto LIKE '${marca}'`);
    //where.push(`%${marca}% `);
  }
  if (stock === 1) where.push("p.stock > 0 ");
  if (stock === 2) where.push("p.stock <= 0 ");

  const sql = `
      SELECT DISTINCT
        p.pmp, p.rowid, p.ref, p.label, p.barcode, p.tosell, p.tobuy,
        pe.contenido, pe.modelo, pe.catproveedor, pe.marcaproducto,
        pe.high_end, pe.prdlinea, pe.unitmeasure, pe.uomvalue,
        (
          SELECT price_ttc 
          FROM llx_product_price 
          WHERE fk_product=p.rowid 
          ORDER BY rowid DESC 
          LIMIT 1
        ) as price_ttc,
        pm.max, pt.in_transit
      FROM llx_product AS p
      INNER JOIN llx_product_extrafields AS pe ON pe.fk_object = p.rowid
      LEFT JOIN (
        SELECT fk_product AS id, SUM(desiredstock) AS max
        FROM llx_product_warehouse_properties
        WHERE fk_entrepot IN (1,2,3,4,10,49)
        GROUP BY fk_product
      ) pm ON pm.id = p.rowid
      LEFT JOIN (
        SELECT pid.fk_product AS id, SUM(pid.qty) AS in_transit
        FROM llx_pickingdet pid
        LEFT JOIN llx_picking pi ON pi.rowid=pid.picking_id
        WHERE pid.status=1 
          AND pi.stock_to IN (1,2,3,4,10,49)
          AND pi.date_creation > (NOW() - INTERVAL 1 MONTH)
        GROUP BY pid.fk_product
      ) pt ON pt.id = p.rowid
      WHERE ${where.length ? where.join(" AND ") : "1=1"}
      ORDER BY pe.marcaproducto ASC
    `;
  try {
    const [rows] = await dolibarrPool.execute(sql);
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("[/api/reportes] ERROR:", err?.message || err);
    return NextResponse.json(
      { error: "DB_REPORTES_FAIL", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
