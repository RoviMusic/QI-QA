import { NextResponse } from "next/server";
import { query } from "@/modules/reports/helpers/db";

const entrepotMap: Record<string, number> = {
  "maximo-almacen": 1,
  "maximo-piso": 2,
  "maximo-mercado": 3,
  "maximo-jir": 10,
  "maximo-matehuala": 4,
  "maximo-full": 16,
  "maximo-TEC": 49,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref") ?? "";
  const label = searchParams.get("label") ?? "";
  const proveedor = searchParams.get("proveedor") ?? "";
  const marca = searchParams.get("marca") ?? "";
  const tipo = searchParams.get("tipo") ?? "";
  const area = searchParams.get("area") ?? "";
  const pasillo = searchParams.get("pasillo") ?? "";
  const estante = searchParams.get("estante") ?? "";
  const columna = searchParams.get("columna") ?? "";
  const posicion = searchParams.get("posicion") ?? "";

  let sql = `
    SELECT p.rowid, p.ref, p.label, p.barcode, 
           pe.catproveedor, pe.marcaproducto, pe.contenido, pe.etiquetas, pe.area, 
           pe.pasillo, pe.estante, pe.columna, pe.posicion, pe.criteriosinlimite, 
           pe.contenido_picking, pe.prdlinea, pe.high_end, p.tosell, p.tobuy 
    FROM llx_product p 
    INNER JOIN llx_product_extrafields pe ON p.rowid = pe.fk_object 
  `;

  const where: string[] = [];
  const params: any[] = [];

  if (tipo === "stock_cedis") {
    sql += `INNER JOIN llx_product_stock ps ON p.rowid = ps.fk_product AND ps.fk_entrepot=1 AND ps.reel > 0 `;
  }

  if (ref) {
    where.push(`p.ref LIKE '${ref}'`);
  }
  if (label) {
    const words = label.trim().replace(/\s+/g, " ").split(" ");

    const conditions = words.map((word) => {
      params.push(`%${word}%`);
      return `p.label LIKE '${word}'`;
    });

    where.push(`(${conditions.join(" AND ")})`);
    console.log("[/api/products] WHERE", where.join(" AND "), params);
  }
  if (proveedor) {
    where.push(`pe.catproveedor = '${proveedor}'`);
  }
  if (marca) {
    where.push(`pe.marcaproducto = '${marca}'`);
  }
  if (area) {
    where.push(`pe.area = '${area}'`);
  }
  if (pasillo) {
    where.push(`pe.pasillo = '${pasillo}'`);
  }
  if (estante) {
    where.push(`pe.estante = '${estante}'`);
  }
  if (columna) {
    where.push(`pe.columna = '${columna}'`);
  }
  if (posicion) {
    where.push(`pe.posicion = '${posicion}'`);
  }

  if (tipo === "criterio") where.push("pe.criterio = 1");
  else if (tipo === "prdlinea") where.push("pe.prdlinea = 1");
  else if (tipo.startsWith("maximo-")) {
    const entrepot = entrepotMap[tipo];
    if (entrepot) {
      where.push(`
        (SELECT pw.seuil_stock_alerte FROM llx_product_warehouse_properties pw 
         WHERE pw.fk_product = p.rowid AND pw.fk_entrepot = ${entrepot} LIMIT 1) >= 
        (SELECT pw.desiredstock FROM llx_product_warehouse_properties pw 
         WHERE pw.fk_product = p.rowid AND pw.fk_entrepot = ${entrepot} LIMIT 1)
        AND (SELECT pw.desiredstock FROM llx_product_warehouse_properties pw 
         WHERE pw.fk_product = p.rowid AND pw.fk_entrepot = ${entrepot} LIMIT 1) > 0
      `);
      params.push(entrepot, entrepot, entrepot);
    }
  } else if (tipo === "stock_cedis") {
    where.push(`
      ((SELECT pw.desiredstock FROM llx_product_warehouse_properties pw 
        WHERE pw.fk_product = p.rowid AND pw.fk_entrepot = 2 LIMIT 1) IS NULL OR 
       (SELECT pw.desiredstock FROM llx_product_warehouse_properties pw 
        WHERE pw.fk_product = p.rowid AND pw.fk_entrepot = 2 LIMIT 1) = 0)
    `);
  }

  if (where.length) sql += "WHERE " + where.join(" AND ");
  if (ref || label || proveedor || marca) sql += " ORDER BY p.ref ASC";
  else if (tipo.startsWith("maximo-")) sql += " ORDER BY p.ref ASC LIMIT 100";
  else sql += " ORDER BY p.ref ASC LIMIT 200";

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}
