"use server";

import dbConnect from "@/lib/mongodb";
import { ProcessorSchema } from "@/modules/tools/process/models/MeliProcessedModel";
import { IProcessor } from "@/modules/tools/process/types/processorMongoInterfaces";

export async function validateShipment(
  shipmentId: number,
  document_id: string,
  actual_shipment_ref: string
) {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("DOLAPIKEY", process.env.DOLAPIKEY!);
    console.log("validate shipment id ", shipmentId);
    console.log("validate document id ", document_id);
    console.log("validate shipment ref ", actual_shipment_ref);

    const conn = await dbConnect();
    const db = conn.connection.useDb("dolibarr_processor", {
      useCache: true,
    });

    const DB_PrModel =
      db.models.Processor || db.model<IProcessor>("Processor", ProcessorSchema);

    const response = await fetch(
      `${process.env.DOLIBARR_VALILDATE_SHIPMENT_URL}/${shipmentId}/validate`,
      {
        method: "POST",
        headers: headers,
      }
    );

    if (response.status == 200) {
      const result = await response.json();

      await DB_PrModel.updateOne(
        { _id: document_id },
        { $set: { shipment_reference: result.ref } }
      );

      return true;
    } else {
      const resultError = await response.json();
      console.log(
        `Error for ${document_id} && shipment ref: ${actual_shipment_ref} `
      );
      console.log(`--- ${resultError.error.message} ----`);
      // await DB_PrModel.updateOne(
      //   { _id: document_id },
      //   {
      //     $set: {
      //       shipment_reference: `(Err) ${actual_shipment_ref}`,
      //       warning: `API Validate Shipment Error ${response.status}: ${resultError.error.message}`,
      //     },
      //   }
      // );
      throw new Error("Failed to validate shipment");
    }
  } catch (error: any) {
    console.error("Error validando shipment:", error.message);
    throw new Error("Failed to validate shipment");
  }
}

export async function UpdatedMongo(data: any[]) {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("DOLAPIKEY", process.env.DOLAPIKEY!);

    const conn = await dbConnect();
    const db = conn.connection.useDb("dolibarr_processor", {
      useCache: true,
    });

    const DB_PrModel =
      db.models.Processor || db.model<IProcessor>("Processor", ProcessorSchema);

    console.log("Empezando...");
    for (const item of data) {
      const response = await fetch(
        `${process.env.DOLIBARR_VALILDATE_SHIPMENT_URL}/${item.shipment_id}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (response.status == 200) {
        const result = await response.json();
        //console.log(`response ${result} for item ${item}`);

        if (result.ref.startsWith("NE-")) {
          console.log(
            `updated ${item._id} with ${result.ref} ---> sale id ${item.sale_id}`
          );
          await DB_PrModel.updateOne(
            { _id: item._id },
            { $set: { shipment_reference: result.ref } }
          );
        } else {
          console.log(
            `no tiene NE: ${item._id} #ref ${result.ref} ---> sale id ${item.sale_id}`
          );
        }
      } else {
        const resultError = await response.json();
        console.log(
          `Error for ${item._id} && sale id: ${item.sale_id} && shipment ref: ${item.shipment_reference} `
        );
        console.log(`--- ${resultError.error.message} ----`);
        await DB_PrModel.updateOne(
          { _id: item._id },
          {
            $set: {
              shipment_reference: `(Err) ${item.shipment_reference}`,
              warning: `API Validate Shipment Error ${response.status}: ${resultError.error.message}`,
            },
          }
        );
      }
    }
    console.log("-------termino---------");

    return true;
  } catch (error: any) {
    console.error("Error actualizando mongo:", error.message);
    throw new Error("Failed to update");
  }
}

export async function MassiveValidate(data: any[]) {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("DOLAPIKEY", process.env.DOLAPIKEY!);

    const conn = await dbConnect();
    const db = conn.connection.useDb("dolibarr_processor", {
      useCache: true,
    });

    const DB_PrModel =
      db.models.Processor || db.model<IProcessor>("Processor", ProcessorSchema);

    console.log("Empezando....");
    for (const item of data) {
      const response = await fetch(
        `${process.env.DOLIBARR_VALILDATE_SHIPMENT_URL}/${item.shipment_id}/validate`,
        {
          method: "POST",
          headers: headers,
        }
      );

      if (response.status == 200) {
        const result = await response.json();
        console.log(`updated ${item._id} with ${result.ref}`);
        await DB_PrModel.updateOne(
          { _id: item._id },
          { $set: { shipment_reference: result.ref } }
        );
      } else {
        const errorData = await response.json();
        console.log(`Error for ${item._id}: ${errorData}`);

        await DB_PrModel.updateOne(
          { _id: item._id },
          {
            $set: {
              warning: `API Validate Shipment Error ${response.status}: ${errorData.message || errorData.error.message}`,
            },
          }
        );
      }
    }

    console.log("-------termino---------");
    return true;
  } catch (error: any) {
    console.error("Error actualizando mongo:", error.message);
    throw new Error("Failed to update");
  }
}
