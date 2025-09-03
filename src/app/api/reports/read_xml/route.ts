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
      return NextResponse.json(
        { error: "Solo se permiten archivos XML" },
        { status: 400 }
      );
    }

    // Parse CFDI y remover prefijos de namespace (cfdi:, tfd:)
    let buf = Buffer.from(await file.arrayBuffer());
    // Limpieza de caracteres nulos y caracteres de control
    console.log("Buffer original length:", buf.length);

    // Filtrar caracteres nulos (0x00) y otros caracteres de control problemáticos
    const filteredBuffer = buf.filter((byte) => byte !== 0);
    buf = Buffer.from(filteredBuffer);

    console.log("Buffer después de limpieza:", buf.length);

    // Convertir a string con encoding UTF-8 y limpiar caracteres restantes
    let xmlContent = buf.toString("utf8");
    // Remover caracteres nulos adicionales que pudieran quedar
    xmlContent = xmlContent.replace(/\0/g, "");
    console.log(
      "Contenido XML limpio (primeros 200 chars):",
      xmlContent.substring(0, 200)
    );

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      removeNSPrefix: true,
    });
    const xml: any = parser.parse(xmlContent);
    console.log("XML parseado:", JSON.stringify(xml, null, 2));
    console.log("Raíces XMLL:", Object.keys(xml));

    // Estructura esperada CFDI 4+: root = Comprobante
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

    // Rechazar si tiene Addenda
    if (comp?.Addenda) {
      return NextResponse.json("Error: XML contiene Addenda no soportada");
    }

    // Validación de proveedor (RFC)
    const rfcExists = await checkRFCExist(rfc);
    if ((rfcExists.total ?? 0) <= 0) {
      return NextResponse.json(
        "<br><br><label>Resultados del proceso: RFC no existe.</label><br>"
      );
    }

    // Checar si ya hay log
    const prevLog = await checkLog(provider, invoice_number);
    if ((prevLog.total ?? 0) > 0) {
      return NextResponse.json(
        "<br><br><label>Resultados del proceso: Borrador ya existe.</label><br>"
      );
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
      const ref = (c?.NoIdentificacion ?? "").toString().trim();
      const chk = await checkExist(ref, rfc);
      if ((chk.total ?? 0) > 0) good += 1;
    }

    // Si hay faltantes, responder listado con ✓ / No existe
    if (counter !== good) {
      let output =
        '<br><br><label>Resultados del proceso: <span style="color:red">Error, no todos los productos existen en Dolibarr, revise listado.</span></label><br>';
      output += `<b>Proveedor:</b> ${provider} <b>RFC:</b> ${rfc}<br>`;
      output += `<b>Folio:</b> ${invoice_number}<br>`;
      output += "<br><b>Lista de Productos</b><br>";

      for (const c of conceptos) {
        const ref = (c?.NoIdentificacion ?? "").toString().trim();
        const desc = (c?.Descripcion ?? "").toString().trim();
        const cantidad = (c?.Cantidad ?? "0").toString();
        const valid = await checkExist(ref, rfc);
        if ((valid.total ?? 0) > 0) {
          output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref} <span style="color:green">✓</span><br>`;
        } else {
          output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref} <b style="color:red">No existe</b><br>`;
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
      let output =
        "<br><br><label>Resultados del proceso: Borrador creado con éxito.</label><br>";
      output += `<b>Proveedor:</b> ${provider} <b>RFC:</b> ${rfc}<br>`;
      output += `<b>Folio:</b> ${invoice_number}<br>`;
      output += "<br><b>Lista de Productos</b><br>";
      for (const c of conceptos) {
        const ref = (c?.NoIdentificacion ?? "").toString().trim();
        const desc = (c?.Descripcion ?? "").toString().trim();
        const cantidad = (c?.Cantidad ?? "0").toString();
        output += `<b>Descripción:</b> (${cantidad}) ${desc} <b>SKU:</b> ${ref} <span style="color:green">✓</span><br>`;
      }
      return NextResponse.json(output);
    }

    return NextResponse.json("Error inesperado al generar borrador");
  } catch (e: any) {
    return NextResponse.json(
      `Error inesperado al subir archivo: ${e?.message ?? e}`,
      {
        status: 500,
      }
    );
  }
}
