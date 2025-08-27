import { queryOne, query } from "./db";

// Mantengo constantes “hard-coded” como en tu Python (fk_user_author=67)
const FK_USER_AUTHOR = 67;

// Funcion para verificar que si existe un RFC de proveedor, se busca en la tabla llx_societe
// Se utiliza la variable siren (rfc en python) para revisar el RFC
export async function checkRFCExist(siren: string): Promise<{ total: number }> {
  // SELECT COUNT(*) FROM llx_societe WHERE siren=<siren> AND fournisseur=1
  const row = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM llx_societe WHERE siren=? AND fournisseur=1 LIMIT 1`,
    [siren]
  );
  return { total: row?.total ?? 0 };
}

// Funcion para verificar si existe un registro con ref y rfc datos, se busca en la tabla
// llx_product_fournisseur_price
export async function checkExist(
  ref: string,
  rfc: string
): Promise<{ total: number }> {
  /* En Python:
     - Busca rowid de llx_societe por siren=rfc
     - Cuenta en llx_product_fournisseur_price por REPLACE(ref_fourn,'|','')=ref y fk_soc=societe
  */
  const soc = await queryOne<{ rowid: number }>(
    `SELECT rowid FROM llx_societe WHERE siren=? LIMIT 1`,
    [rfc]
  );
  if (!soc?.rowid) return { total: 0 };

  const row = await queryOne<{ total: number }>(
    `SELECT COUNT(*) as total
     FROM llx_product_fournisseur_price
     WHERE REPLACE(ref_fourn,'|','')=? AND fk_soc=?`,
    [ref, soc.rowid]
  );
  return { total: row?.total ?? 0 };
}

// Funcion para verificar que ya exista un log para esta factura
export async function checkLog(
  provider: string,
  invoice_number: string
): Promise<{ total: number }> {
  const row = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total
     FROM llx_process_invoice_xml
     WHERE provider=? AND invoice_number=?`,
    [provider, invoice_number]
  );
  return { total: row?.total ?? 0 };
}

// Funcion para registrar un log en el proceso de la factura XML
export async function createLog(
  provider: string,
  invoice_number: string,
  invoice_date: string,
  total_products: number
) {
  await query(
    `INSERT INTO llx_process_invoice_xml
       (provider, invoice_number, invoice_date, total_products, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [provider, invoice_number, invoice_date, total_products]
  );
  return true;
}

// Funcion para crear un borrador de orden de compra
export async function createDraft(
  ref: string,
  invoice: string,
  total: number,
  rfc: string
) {
  // Obtener fk_soc por ref_fourn y rfc (igual a Python)
  const soc = await queryOne<{ fk_soc: number }>(
    `SELECT fp.fk_soc
     FROM llx_product_fournisseur_price fp
     JOIN llx_societe s ON fp.fk_soc=s.rowid
     WHERE REPLACE(fp.ref_fourn,'|','')=? AND s.siren=? AND fp.fk_soc IS NOT NULL
     ORDER BY fp.rowid DESC LIMIT 1`,
    [ref, rfc]
  );
  if (!soc?.fk_soc) return false;

  const total_ht = total / 1.16;
  const tva = total - total_ht;

  // Insertar orden
  //
  await query(
    `INSERT INTO llx_commande_fournisseur
       (entity, ref_supplier, fk_soc, tms, date_creation, fk_user_author, total_tva, total_ht, total_ttc, model_pdf, fk_cond_reglement, fk_mode_reglement)
     VALUES (1, ?, ?, NOW(), NOW(), ?, ?, ?, ?, 'muscadet', 2, 67)`,
    [invoice, soc.fk_soc, FK_USER_AUTHOR, tva, total_ht, total]
  );

  // Obtener último id por fk_user_author
  const last = await queryOne<{ rowid: number }>(
    `SELECT rowid FROM llx_commande_fournisseur
     WHERE fk_user_author=?
     ORDER BY rowid DESC LIMIT 1`,
    [FK_USER_AUTHOR]
  );
  if (!last?.rowid) return false;

  // Actualizar ref
  await query(
    `UPDATE llx_commande_fournisseur SET ref='(PROV${last.rowid})' WHERE rowid=? LIMIT 1`,
    [last.rowid]
  );
  return true;
}

// Funcion para crear detalles de borrador
export async function createDraftDet(
  ref: string,
  qtyIn: number,
  value: number,
  descuento: number,
  importe: number
) {
  // Obtener fk_product/fk_soc/ref_fourn/refp
  const prod = await queryOne<{
    fk_product: number;
    fk_soc: number;
    ref_fourn: string;
    ref: string;
  }>(
    `SELECT pf.fk_product, pf.fk_soc, pf.ref_fourn, p.ref
     FROM llx_product_fournisseur_price pf
     JOIN llx_product p ON p.rowid=pf.fk_product
     WHERE REPLACE(pf.ref_fourn,'|','')=?
       AND pf.fk_soc IS NOT NULL
     ORDER BY pf.rowid DESC LIMIT 1`,
    [ref]
  );
  if (!prod?.fk_product) return false;

  // Última orden del autor (Obtiene ultimo ID de orden)
  const last = await queryOne<{ rowid: number }>(
    `SELECT rowid FROM llx_commande_fournisseur
     WHERE fk_user_author=?
     ORDER BY rowid DESC LIMIT 1`,
    [FK_USER_AUTHOR]
  );
  if (!last?.rowid) return false;

  // Contenido por extrafields (Verifica el contenido)
  const extr = await queryOne<{ contenido: number | null }>(
    `SELECT contenido FROM llx_product_extrafields WHERE fk_object=? LIMIT 1`,
    [prod.fk_product]
  );
  const contenido = extr?.contenido ? Number(extr.contenido) : 1;

  let qty = Number(qtyIn);
  let unitNoIVA = Number(value); // “subprice” por unidad sin IVA (ajustado por contenido si >1)

  if (contenido > 1) {
    qty = qty * contenido;
    unitNoIVA = unitNoIVA / contenido;
  }

  // Manejo de descuentos (igual a Python)
  let remise_percent = 0;
  let subtotal = Number(importe);
  if (Number(descuento) > 0) {
    remise_percent = (Number(descuento) / subtotal) * 100;
    subtotal = subtotal - Number(descuento);
  }
  const totalconiva = subtotal * 1.16;
  const iva = totalconiva - subtotal;

  // Insertardetalles
  await query(
    `INSERT INTO llx_commande_fournisseurdet
       (fk_commande, fk_product, ref, tva_tx, qty, remise_percent, subprice, total_ht, total_tva, total_ttc)
     VALUES (?, ?, ?, 16, ?, ?, ?, ?, ?, ?)`,
    [
      last.rowid,
      prod.fk_product,
      ref,
      qty,
      remise_percent,
      unitNoIVA,
      subtotal,
      iva,
      totalconiva,
    ]
  );

  return true;
}
