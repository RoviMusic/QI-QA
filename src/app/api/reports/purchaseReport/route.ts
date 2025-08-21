import { dolibarrPool } from "@/lib/mysqldb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const supplier = searchParams.get("supplier");
    const brand = searchParams.get("brand");
    const stock = searchParams.get("stock");

    const params: any[] = [];
    let sql = "";

    if (supplier != undefined) {
      sql = `select distinct p.pmp, p.rowid, p.ref, p.label, p.barcode, p.tosell,p.tobuy, pe.contenido, pe.modelo, 
        pe.catproveedor, pe.marcaproducto, pe.high_end, pe.prdlinea,pe.unitmeasure, pe.uomvalue, 
        (SELECT price_ttc FROM llx_product_price WHERE fk_product=p.rowid ORDER BY rowid DESC LIMIT 1) as price_ttc, 
        pm.max, pt.in_transit from llx_product as p inner join llx_product_extrafields as pe on pe.fk_object = p.rowid 
        LEFT JOIN (SELECT fk_product id, SUM(desiredstock) max FROM llx_product_warehouse_properties WHERE fk_entrepot in (1,2,3,4,10,49) GROUP BY fk_product) pm 
        ON pm.id = p.rowid 
        LEFT JOIN (SELECT pid.fk_product id, sum(pid.qty) in_transit FROM llx_pickingdet pid LEFT JOIN llx_picking pi ON pi.rowid=pid.picking_id WHERE pid.status=1 AND pi.stock_to IN (1,2,3,4,10) AND pi.date_creation > (NOW() - INTERVAL 1 MONTH) GROUP BY pid.fk_product) pt 
        ON pt.id = p.rowid where pe.catproveedor like '${supplier}'`;
      params.push(supplier);
    } else if (brand != undefined) {
      sql = `select p.pmp, p.rowid, p.ref, p.label, p.barcode, p.tosell,p.tobuy, pe.contenido, pe.modelo, 
        pe.catproveedor, pe.marcaproducto, pe.high_end, pe.prdlinea, pe.unitmeasure, pe.uomvalue,
        (SELECT price_ttc FROM llx_product_price WHERE fk_product=p.rowid ORDER BY rowid DESC LIMIT 1) as price_ttc,
	    (select SUM(desiredstock) from llx_product_warehouse_properties as sa where fk_product=p.rowid AND fk_entrepot in (1,2,3,4,10,49)) as max `;

      if (brand != "*") {
        sql += `from llx_product as p inner join llx_product_extrafields as pe on pe.fk_object = p.rowid where  pe.marcaproducto like '${brand}'`;
      } else {
        sql += `from llx_product as p inner join llx_product_extrafields as pe on pe.fk_object = p.rowid where pe.high_end IS NOT NULL AND pe.marcaproducto IS NOT NULL`;
      }
    } else if (stock != undefined) {
      sql = `select distinct p.pmp, p.rowid, p.ref, p.label, p.barcode, p.tosell,p.tobuy, pe.contenido, pe.modelo, 
        pe.catproveedor, pe.marcaproducto, pe.high_end, pe.prdlinea,pe.unitmeasure, pe.uomvalue,
	    (SELECT price_ttc FROM llx_product_price WHERE fk_product=p.rowid  ORDER BY rowid DESC LIMIT 1) as price_ttc, 
        pm.max, pt.in_transit from llx_product as p 
        inner join llx_product_extrafields as pe on pe.fk_object = p.rowid
        LEFT JOIN (SELECT fk_product id, SUM(desiredstock) max FROM llx_product_warehouse_properties WHERE fk_entrepot in (1,2,3,4,10,49) GROUP BY fk_product) pm 
        ON pm.id = p.rowid
        LEFT JOIN (SELECT pid.fk_product id, sum(pid.qty) in_transit FROM llx_pickingdet pid LEFT JOIN llx_picking pi ON pi.rowid=pid.picking_id WHERE pid.status=1 AND pi.stock_to IN (1,2,3,4,10) AND pi.date_creation > (NOW() - INTERVAL 10 MONTH) GROUP BY pid.fk_product) pt 
        ON pt.id = p.rowid where pe.catproveedor IS NOT NULL `;

      if (stock == "1") {
        sql += `AND (SELECT COALESCE(SUM(ps.reel), 0) FROM llx_product_stock ps WHERE ps.fk_entrepot in (1,2,3,10,49) AND ps.fk_product=p.rowid) > 0`;
      } else if (stock == "2") {
        sql += `AND pe.prdlinea = 1`;
      }
    }

    const [rows] = await dolibarrPool.execute(sql);

    return Response.json({
      data: rows,
    });
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { producto_ids, almacen_ids } = await request.json();

    const productoPlaceholders = producto_ids.map(() => "?").join(",");
    const almacenPlaceholders = almacen_ids.map(() => "?").join(",");
  } catch (e) {}
}
