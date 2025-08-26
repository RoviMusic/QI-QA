// app/api/editproduct/route.ts
import { query, queryOne } from "@/modules/reports/helpers/db";
import { NextResponse } from "next/server";

type Body = {
  type: string;
  rowid: number;
  value: string;
  field: string;
};

const fieldMap: Record<string, { col: string; entrepot: number }> = {
  seuil_stock_alerte_almacen: { col: "seuil_stock_alerte", entrepot: 1 },
  desiredstock_almacen: { col: "desiredstock", entrepot: 1 },
  seuil_stock_alerte_piso: { col: "seuil_stock_alerte", entrepot: 2 },
  desiredstock_piso: { col: "desiredstock", entrepot: 2 },
  seuil_stock_alerte_mercado: { col: "seuil_stock_alerte", entrepot: 3 },
  desiredstock_mercado: { col: "desiredstock", entrepot: 3 },
  seuil_stock_alerte_jir: { col: "seuil_stock_alerte", entrepot: 10 },
  desiredstock_jir: { col: "desiredstock", entrepot: 10 },
  seuil_stock_alerte_TEC: { col: "seuil_stock_alerte", entrepot: 49 },
  desiredstock_TEC: { col: "desiredstock", entrepot: 49 },
  seuil_stock_alerte_matehuala: { col: "seuil_stock_alerte", entrepot: 4 },
  desiredstock_matehuala: { col: "desiredstock", entrepot: 4 },
  seuil_stock_alerte_full: { col: "seuil_stock_alerte", entrepot: 16 },
  desiredstock_full: { col: "desiredstock", entrepot: 16 },
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const { type, rowid, value, field } = body;

  const ok = (data = "ok") => NextResponse.json(data);
  const err = (msg: string) => NextResponse.json(msg);

  // helpers de verificación (como en ProductData.check*)
  async function check(sql: string, param: any) {
    const r = await queryOne<{ total: number }>(sql, [param]);
    return r?.total ?? 0;
  }

  if (
    type === "product" ||
    type === "product_label" ||
    type === "product_status"
  ) {
    // UPDATE llx_product SET <field>=? WHERE rowid=?
    await query(
      `UPDATE llx_product SET ${field} = '${value}' WHERE rowid = ${rowid} LIMIT 1`,
      [value, rowid]
    );
    return ok();
  }

  if (
    type === "product_extra" ||
    type === "product_extrachar" ||
    type === "product_mp"
  ) {
    // UPDATE llx_product_extrafields SET <field>=? WHERE fk_object=?
    await query(
      `UPDATE llx_product_extrafields SET ${field} = '${value}' WHERE fk_object = ${rowid} LIMIT 1`,
      [value, rowid]
    );
    return ok();
  }

  if (type === "product_barcode") {
    const exists = await check(
      `SELECT COUNT(*) AS total FROM llx_product WHERE barcode = '${value}'`,
      value
    );
    if (exists === 0) {
      await query(
        `UPDATE llx_product SET ${field} = '${value}' WHERE rowid = ${rowid} LIMIT 1`,
        [value, rowid]
      );
      return ok("ok_alert");
    }
    return err("Error, Código de barras ya existe.");
  }

  if (type === "product_ref") {
    const exists = await check(
      `SELECT COUNT(*) AS total FROM llx_product WHERE ref = '${value}'`,
      value
    );
    if (exists === 0) {
      await query(
        `UPDATE llx_product SET ${field} = '${value}' WHERE rowid = ${rowid} LIMIT 1`,
        [value, rowid]
      );
      return ok("ok_alert");
    }
    return err("Error, Referencia ya existe.");
  }

  if (type === "product_marca") {
    const exists = await check(
      `SELECT COUNT(*) AS total FROM llx_product_extrafields WHERE marcaproducto = '${value}'`,
      value
    );
    if (exists > 0) {
      await query(
        `UPDATE llx_product_extrafields SET ${field} = '${value}' WHERE fk_object = ${rowid} LIMIT 1`,
        [value, rowid]
      );
      return ok();
    }
    return err("Error, Marca no existe.");
  }

  if (type === "product_proveedor") {
    const exists = await check(
      `SELECT COUNT(*) AS total FROM llx_product_extrafields WHERE catproveedor = '${value}'`,
      value
    );
    if (exists > 0) {
      await query(
        `UPDATE llx_product_extrafields SET ${field} = '${value}' WHERE fk_object = ${rowid} LIMIT 1`,
        [value, rowid]
      );
      return ok();
    }
    return err("Error, Proveedor no existe.");
  }

  if (type === "productw") {
    const map = fieldMap[field];
    if (!map) return err("FIELD_NOT_ALLOWED");
    const { col, entrepot } = map;

    const countRow = await queryOne<{ total: number }>(
      `
      SELECT COUNT(*) as total
      FROM llx_product_warehouse_properties
      WHERE fk_product = ${rowid} AND fk_entrepot = ${entrepot}
      LIMIT 1
    `,
      [rowid, entrepot]
    );

    if ((countRow?.total ?? 0) > 0) {
      await query(
        `
        UPDATE llx_product_warehouse_properties
        SET ${col} = '${value}'
        WHERE fk_product = ${rowid} AND fk_entrepot = ${entrepot}
        LIMIT 1
      `,
        [value, rowid, entrepot]
      );
    } else {
      await query(
        `
        INSERT INTO llx_product_warehouse_properties (${col}, fk_product, fk_entrepot, tms)
        VALUES ('${value}', ${rowid}, ${entrepot}, NOW())
      `,
        [value, rowid, entrepot]
      );
    }
    return ok();
  }

  return ok(); // por compatibilidad con tu API actual
}
