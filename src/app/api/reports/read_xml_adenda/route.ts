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
import { OutputMessage } from "@/modules/reports/types/XMLTypes";

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
      const output: OutputMessage = {
        message: "Solo se permiten archivos XML",
        type: "error",
      };
      return NextResponse.json(output);
    }

    const buf = Buffer.from(await file.arrayBuffer());
    // // Filtrar caracteres nulos (0x00) y otros caracteres de control problemáticos
    // const filteredBuffer = buf.filter((byte) => byte !== 0);
    // buf = Buffer.from(filteredBuffer);

    // // Convertir a string con encoding UTF-8 y limpiar caracteres restantes
    // let xmlContent = buf.toString("utf8");
    // // Remover caracteres nulos adicionales que pudieran quedar
    // xmlContent = xmlContent.replace(/\0/g, "");

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      removeNSPrefix: true,
    });
    const xml: any = parser.parse(buf.toString("utf8"));

    const comp = xml?.Comprobante;
    if (!comp) {
      const output: OutputMessage = {
        message: "Error: XML inválido o sin nodo Comprobante",
        type: "error",
      };
      return NextResponse.json(output);
    }

    const emisor = comp?.Emisor || {};
    const provider: string = (emisor?.Nombre).toString().trim();
    console.log("provider: ", provider);
    const rfc: string = (emisor?.Rfc).toString().trim();
    console.log("rfc: ", rfc);

    if (!rfc) {
      const output: OutputMessage = {
        message: "Error: No se encontró RFC del Emisor en el XML",
        type: "error",
      };
      return NextResponse.json(output);
    }

    const invoice_number: string = (comp?.Folio).toString().trim();
    console.log("Folio: ", invoice_number);
    const invoice_date: string = (comp?.Fecha).toString().trim();
    console.log("Fecha: ", invoice_date);
    const total: number = Number(comp?.Total);
    console.log("total: ", total);

    // Esta versión REQUIERE Addenda
    const addenda = comp?.Addenda;
    if (!addenda) {
      const output: OutputMessage = {
        message: "Este archivo no usa Addenda, use otro importador.",
        type: "warning",
      };
      return NextResponse.json(output);
    }

    // Validación del RFC proveedor
    const rfcExists = await checkRFCExist(rfc);
    if (rfcExists.total <= 0) {
      const output: OutputMessage = {
        message: "RFC no existe.",
        type: "error",
      };
      return NextResponse.json(output);
    }

    // Los detalles viven dentro de Addenda.Detalles.Detalle
    //const detallesRaw = addenda?.Detalles?.Detalle;
    const detallesRaw = addenda?.Datos?.AddendaComercial?.Detalles?.Detalle;
    if (!detallesRaw) {
      const output: OutputMessage = {
        message: "No se encontraron detalles.",
        type: "error",
      };
      return NextResponse.json(output);
    }

    const detalles: Detalle[] = Array.isArray(detallesRaw)
      ? detallesRaw
      : detallesRaw
      ? [detallesRaw]
      : [];
    let i = 0;
    let exist = 0;

    // Contar válidos y verificar existencia (quitando vacíos cantidad<=0)
    for (const d of detalles) {
      const cantidad = Number(d?.Cantidad);
      if (cantidad > 0) {
        i += 1;
        const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
          .toString()
          .trim();
        if (ref_producto) {
          const chk = await checkExist(ref_producto, rfc);
          if (chk.total > 0) exist += 1;
        }
      }
    }

    // Si no todos existen, responder listado con ✓ / No existe
    if (i !== exist) {
      // let output = `<label>Resultados del proceso: <span style="color:red">Error, no todos los productos existen en Dolibarr, revise listado.</span></label><br>`;
      // output += `<b>Proveedor:</b> ${provider} <b>RFC:</b> ${rfc}<br>`;
      // output += `<b>Folio:</b> ${invoice_number}<br>`;
      // output += `<br><b>Lista de Productos</b><br>`;
      const output: OutputMessage = {
        message:
          "Error, no todos los productos existen en Dolibarr, revise listado.",
        type: "error",
        supplier: provider,
        rfc: rfc,
        invoice_number: invoice_number,
        products: [],
      };

      for (const d of detalles) {
        const cantidad = Number(d?.Cantidad);
        if (cantidad > 0) {
          const desc = d?.Descripcion!.toString().trim();
          const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
            .toString()
            .trim();
          if (ref_producto) {
            const valid = await checkExist(ref_producto, rfc);
            if (valid.total > 0) {
              //output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref_producto} <span style="color:green">✓</span><br>`;
              output.products?.push({
                description: desc,
                sku: ref_producto,
                quantity: cantidad,
                exists: true,
              });
            } else {
              //output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref_producto} <b style="color:red">No existe</b><br>`;
              output.products?.push({
                description: desc,
                sku: ref_producto,
                quantity: cantidad,
                exists: false,
              });
            }
          }
        }
      }
      return NextResponse.json(output);
    }

    // Si ya existe log, avisar
    const prevLog = await checkLog(provider, invoice_number);
    if (prevLog.total > 0) {
      const output: OutputMessage = {
        message: "Borrador ya existe.",
        type: "warning",
        supplier: provider,
        rfc: rfc,
        invoice_number: invoice_number,
      };
      return NextResponse.json(output);
    }

    // Crear log y draft + detalles
    await createLog(provider, invoice_number, invoice_date, i);

    let x = 0;
    for (const d of detalles) {
      const cantidad = Number(d?.Cantidad);
      if (cantidad > 0) {
        const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
          .toString()
          .trim();
        if (ref_producto) {
          if (x === 0) {
            await createDraft(ref_producto, invoice_number, total, rfc);
          }

          const descuento = Number(d?.Descuento);
          const valor_unitario = Number(d?.ValorUnitario);
          const importe = Number(d?.Importe);
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
    const output: OutputMessage = {
      message: "Borrador creado con éxito.",
      type: "success",
      supplier: provider,
      rfc: rfc,
      invoice_number: invoice_number,
      products: [],
    };
    for (const d of detalles) {
      const cantidad = Number(d?.Cantidad);
      if (cantidad > 0) {
        const desc = d?.Descripcion!.toString().trim();
        const ref_producto = (d?.NoParte || d?.ClaveProdServ || "")
          .toString()
          .trim();
        if (ref_producto) {
          output.products?.push({
            description: desc,
            sku: ref_producto,
            quantity: cantidad,
            exists: true,
          });
        }
      }
    }
    return NextResponse.json(output);
  } catch (e: any) {
    const error: OutputMessage = {
      message: `Error inesperado al subir archivo: ${e?.message ?? e}`,
      type: "error",
    };
    return NextResponse.json(error);
  }
}
