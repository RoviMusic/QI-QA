// app/api/readxmladdenda/route.ts
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import {
  checkRFCExist,
  checkExist,
  checkLog,
  createDraft,
  createLog,
  createDraftDet,
} from "@/modules/reports/helpers/xmlProcess";

export const runtime = "nodejs";

type Detalle = {
  Cantidad?: string | number;
  Descripcion?: string;
  Descuento?: string | number;
  ValorUnitario?: string | number;
  Importe?: string | number;
  NoParte?: string;
  ClaveProdServ?: string;
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file || !file.name.toLowerCase().endsWith(".xml")) {
      return NextResponse.json(
        { error: "Solo se permiten archivos XML" },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      removeNSPrefix: true,
    });
    const xml: any = parser.parse(buf.toString("utf8"));

    const comp = xml?.Comprobante;
    if (!comp)
      return NextResponse.json("Error: XML inválido o sin nodo Comprobante");

    const emisor = comp?.Emisor || {};
    const provider: string = (emisor?.Nombre ?? "").toString().trim();
    console.log("provider: ", provider);
    const rfc: string = (emisor?.Rfc ?? "").toString().trim();
    console.log("rfc: ", rfc);

    if (!rfc)
      return NextResponse.json(
        "Error: No se encontró RFC del Emisor en el XML"
      );

    const invoice_number: string = (comp?.Folio ?? "").toString().trim();
    console.log("Folio: ", invoice_number);
    const invoice_date: string = (comp?.Fecha ?? "").toString().trim();
    console.log("Fecha: ", invoice_date);
    const total: number = Number(comp?.Total ?? 0);
    console.log("total: ", total);


    // Esta versión REQUIERE Addenda
    const addenda = comp?.Addenda;
    if (!addenda) {
      return NextResponse.json(
        "<br><br><label>Este archivo no usa Addenda, use otro importador.</label><br>"
      );
    }

    // Validación del RFC proveedor
    const rfcExists = await checkRFCExist(rfc);
    if ((rfcExists.total ?? 0) <= 0) {
      return NextResponse.json(
        "<br><br><label>Resultados del proceso: RFC no existe.</label><br>"
      );
    }

    // Los detalles viven dentro de Addenda.Detalles.Detalle
    const detallesRaw = addenda?.Detalles?.Detalle;
    const detalles: Detalle[] = Array.isArray(detallesRaw)
      ? detallesRaw
      : detallesRaw
        ? [detallesRaw]
        : [];
    let i = 0;
    let exist = 0;

    // Contar válidos y verificar existencia (quitando vacíos cantidad<=0)
    for (const d of detalles) {
      const cantidad = Number(d?.Cantidad ?? 0);
      if (cantidad > 0) {
        i += 1;
        const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
          .toString()
          .trim();
        if (ref_producto) {
          const chk = await checkExist(ref_producto, rfc);
          if ((chk.total ?? 0) > 0) exist += 1;
        }
      }
    }

    // Si no todos existen, responder listado con ✓ / No existe
    if (i !== exist) {
      let output =
        '<br><br><label>Resultados del proceso: <span style="color:red">Error, no todos los productos existen en Dolibarr, revise listado.</span></label><br>';
      output += `<b>Proveedor:</b> ${provider} <b>RFC:</b> ${rfc}<br>`;
      output += `<b>Folio:</b> ${invoice_number}<br>`;
      output += "<br><b>Lista de Productos</b><br>";

      for (const d of detalles) {
        const cantidad = Number(d?.Cantidad ?? 0);
        if (cantidad > 0) {
          const desc = (d?.Descripcion ?? "").toString().trim();
          const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
            .toString()
            .trim();
          if (ref_producto) {
            const valid = await checkExist(ref_producto, rfc);
            if ((valid.total ?? 0) > 0) {
              output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref_producto} <span style="color:green">✓</span><br>`;
            } else {
              output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref_producto} <b style="color:red">No existe</b><br>`;
            }
          }
        }
      }
      return NextResponse.json(output);
    }

    // Si ya existe log, avisar
    const prevLog = await checkLog(provider, invoice_number);
    if ((prevLog.total ?? 0) > 0) {
      return NextResponse.json(
        "<br><br><label>Resultados del proceso: Borrador ya existe.</label><br>"
      );
    }

    // Crear log y draft + detalles
    await createLog(provider, invoice_number, invoice_date, i);

    let x = 0;
    for (const d of detalles) {
      const cantidad = Number(d?.Cantidad ?? 0);
      if (cantidad > 0) {
        const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
          .toString()
          .trim();
        if (ref_producto) {
          if (x === 0) {
            await createDraft(ref_producto, invoice_number, total, rfc);
          }

          const descuento = Number(d?.Descuento ?? 0);
          const valor_unitario = Number(d?.ValorUnitario ?? 0);
          const importe = Number(d?.Importe ?? 0);
          await createDraftDet(
            ref_producto,
            cantidad,
            valor_unitario,
            descuento,
            importe
          );
          x += 1;
        }
      }
    }

    // Salida final exitosa
    let output =
      "<br><br><label>Resultados del proceso: Borrador creado con éxito.</label><br>";
    output += `<b>Proveedor:</b> ${provider} <b>RFC:</b> ${rfc}<br>`;
    output += `<b>Folio:</b> ${invoice_number}<br>`;
    output += "<br><b>Lista de Productos</b><br>";
    for (const d of detalles) {
      const cantidad = Number(d?.Cantidad ?? 0);
      if (cantidad > 0) {
        const desc = (d?.Descripcion ?? "").toString().trim();
        const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
          .toString()
          .trim();
        if (ref_producto) {
          output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref_producto} <span style="color:green">✓</span><br>`;
        }
      }
    }
    return NextResponse.json(output);
  } catch (e: any) {
    return NextResponse.json(`Error inesperado: ${e?.message ?? e}`, {
      status: 500,
    });
  }
}
