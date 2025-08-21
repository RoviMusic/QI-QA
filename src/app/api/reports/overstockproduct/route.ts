import { dolibarrPool } from "@/lib/mysqldb";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        let sql = "";

        sql = "SELECT p.rowid, p.ref, p.label, p.price_ttc, ps.reel as stock, e.ref as entrepot, (SELECT pw.desiredstock FROM llx_product_warehouse_properties pw WHERE pw.fk_product=p.rowid AND pw.fk_entrepot=ps.fk_entrepot LIMIT 1) as desiredstock, (SELECT pw.seuil_stock_alerte FROM llx_product_warehouse_properties pw WHERE pw.fk_product=p.rowid AND pw.fk_entrepot=ps.fk_entrepot LIMIT 1) as seuil_stock_alerte FROM llx_product p, llx_product_stock ps, llx_entrepot e WHERE p.rowid=ps.fk_product AND ps.fk_entrepot=e.rowid AND ps.fk_entrepot > 1 AND IF((SELECT COUNT(*) FROM llx_product_warehouse_properties pw WHERE pw.fk_product=p.rowid AND pw.fk_entrepot=ps.fk_entrepot) > 0, (SELECT pw.desiredstock FROM llx_product_warehouse_properties pw WHERE pw.fk_product=p.rowid AND pw.fk_entrepot=ps.fk_entrepot LIMIT 1), 0) < ps.reel"

        const [rows] = await dolibarrPool.execute(sql);

        return Response.json({
            data: rows,
        });
    } catch (err) {
        return Response.json({ error: err }, { status: 500 });
    }
}