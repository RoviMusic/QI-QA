// app/api/readxml/route.ts
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

type Concepto = {
  NoIdentificacion?: string;
  Descripcion?: string;
  Cantidad?: string | number;
  ValorUnitario?: string | number;
  Importe?: string | number;
  Descuento?: string | number;
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

    // Parse CFDI y remover prefijos de namespace (cfdi:, tfd:)
    let buf = Buffer.from(await file.arrayBuffer());
    // Limpieza de caracteres nulos y caracteres de control
    // Filtrar caracteres nulos (0x00) y otros caracteres de control problemáticos
    const filteredBuffer = buf.filter((byte) => byte !== 0);
    buf = Buffer.from(filteredBuffer);

    // Convertir a string con encoding UTF-8 y limpiar caracteres restantes
    let xmlContent = buf.toString("utf8");
    // Remover caracteres nulos adicionales que pudieran quedar
    xmlContent = xmlContent.replace(/\0/g, "");

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      removeNSPrefix: true,
    });
    const xml: any = parser.parse(xmlContent);

    // Estructura esperada CFDI 4+: root = Comprobante
    const comp = xml?.Comprobante;
    if (!comp) {
      const output: OutputMessage = {
        message: "Error: XML inválido o sin nodo Comprobante",
        type: "error",
      };
      return NextResponse.json(output);
    }

    const emisor = comp?.Emisor || {};
    const provider: string = (emisor?.Nombre ?? "").toString().trim();
    console.log("provider: ", provider);
    const rfc: string = (emisor?.Rfc ?? "").toString().trim();
    console.log("rfc: ", rfc);
    if (!rfc) {
      const output: OutputMessage = {
        message: "Error: No se encontró RFC del Emisor en el XML",
        type: "error",
      };
      return NextResponse.json(output);
    }

    const invoice_number: string = (comp?.Folio ?? "").toString().trim();
    console.log("Folio: ", invoice_number);
    const invoice_date: string = (comp?.Fecha ?? "").toString().trim();
    console.log("Fecha: ", invoice_date);
    const total: number = Number(comp?.Total ?? 0);
    console.log("total: ", total);

    // Rechazar si tiene Addenda
    if (comp?.Addenda) {
      const output: OutputMessage = {
        message: "XML contiene Addenda no soportada, use otro importador.",
        type: "warning",
      };
      return NextResponse.json(output);
    }

    // Validación de proveedor (RFC)
    const rfcExists = await checkRFCExist(rfc);
    if (rfcExists.total <= 0) {
      const output: OutputMessage = {
        message: "RFC no existe.",
        type: "error",
      };
      return NextResponse.json(output);
    }

    // Checar si ya hay log
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

    // Conceptos
    const conceptosRaw = comp?.Conceptos?.Concepto;
    const conceptos: Concepto[] = Array.isArray(conceptosRaw)
      ? conceptosRaw
      : conceptosRaw
      ? [conceptosRaw]
      : [];

    let counter = 0;
    let good = 0;

    for (const c of conceptos) {
      counter += 1;
      const ref = c?.NoIdentificacion!.toString().trim();
      const chk = await checkExist(ref, rfc);
      if (chk.total > 0) good += 1;
    }

    // Si hay faltantes, responder listado con ✓ / No existe
    if (counter !== good) {
      const output: OutputMessage = {
        message:
          "Error, no todos los productos existen en Dolibarr, revise listado.",
        type: "error",
        supplier: provider,
        rfc: rfc,
        invoice_number: invoice_number,
        products: [],
      };

      for (const c of conceptos) {
        const ref = c?.NoIdentificacion!.toString().trim();
        const desc = c?.Descripcion!.toString().trim();
        const cantidad = c?.Cantidad!.toString();
        const valid = await checkExist(ref, rfc);
        if ((valid.total ?? 0) > 0) {
          output.products?.push({
            description: desc,
            sku: ref,
            quantity: Number(cantidad),
            exists: true,
          });
        } else {
          output.products?.push({
            description: desc,
            sku: ref,
            quantity: Number(cantidad),
            exists: false,
          });
        }
      }
      return NextResponse.json(output);
    }

    // Crear Draft+Log y Detalles
    let i = 0;
    let exist = 0;
    for (const c of conceptos) {
      i += 1;
      const ref = (c?.NoIdentificacion ?? "").toString().trim();
      const chk = await checkExist(ref, rfc);
      if ((chk.total ?? 0) > 0) {
        exist += 1;
        if (exist === 1) {
          await createDraft(ref, invoice_number, total, rfc);
          await createLog(provider, invoice_number, invoice_date, i);
        }
        const descuento = Number(c?.Descuento ?? 0);
        const valor_unitario = Number(c?.ValorUnitario ?? 0);
        const importe = Number(c?.Importe ?? 0);
        const cantidad = Number(c?.Cantidad ?? 0);

        await createDraftDet(ref, cantidad, valor_unitario, descuento, importe);
      }
    }

    if (i === exist && exist > 0) {
      const output: OutputMessage = {
        message: "Borrador creado con éxito.",
        type: "success",
        supplier: provider,
        rfc: rfc,
        invoice_number: invoice_number,
        products: [],
      };
      for (const c of conceptos) {
        const ref = (c?.NoIdentificacion ?? "").toString().trim();
        const desc = (c?.Descripcion ?? "").toString().trim();
        const cantidad = (c?.Cantidad ?? "0").toString();
        output.products?.push({
          description: desc,
          sku: ref,
          quantity: Number(cantidad),
          exists: true,
        });
      }
      return NextResponse.json(output);
    }

    const error: OutputMessage = {
      message: "Error inesperado al generar borrador",
      type: "error",
    };
    return NextResponse.json(error);
  } catch (e: any) {
    const error: OutputMessage = {
      message: `Error inesperado al subir archivo: ${e?.message ?? e}`,
      type: "error",
    };
    return NextResponse.json(error);
  }
}
