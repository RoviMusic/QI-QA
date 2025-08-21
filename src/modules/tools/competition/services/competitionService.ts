// export class CompetenciaService {
//   async authMLToken() {
//     const url = "http://187.189.243.250:3500/api/token";
//     const myHeaders = new Headers();
//     myHeaders.append(
//       "Authorization",
//       "Basic SmF6OlB6dlc3NzArKEkmIi1bTzM5bS1gJA=="
//     );
//     myHeaders.append("Cookie", "PHPSESSID=knp29skeuae0ful6abkfuhnshq");

//     const response = await fetch(url, {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     });

//     return response.json();
//   }

//   async couchData() {
//     const myHeaders = new Headers();
//     myHeaders.append(
//       "Authorization",
//       "Basic SmF6OlB6dlc3NzArKEkmIi1bTzM5bS1gJA=="
//     );
//     myHeaders.append("Cookie", "PHPSESSID=knp29skeuae0ful6abkfuhnshq");

//     const response = await fetch("http://187.189.243.250:3500/api/couch.php?url=/ml_competition/_all_docs?include_docs=true", {
//         method: "GET",
//         headers: myHeaders,
//         redirect: "follow"
//     })

//     return response.json();
//   }
// }

// export const competenciaService = new CompetenciaService();

import dbConnect from "@/lib/mongodb";
import {
  IProductsList,
  ProductsListSchema,
} from "../models/CompetitionProdsModel";

export async function GetProductsList() {
  try {
    const conn = await dbConnect();

    const db = conn.connection.useDb("RM_stock_sync", { useCache: true }); //cambiar por db correcta

    const DB_ProductsListModel =
      db.models.ProductsList ||
      db.model<IProductsList>("ProductsList", ProductsListSchema);

    const list = await DB_ProductsListModel.find({
      timestamp: { $gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    })
      .sort({ _id: -1 })
      .lean();

    return JSON.parse(JSON.stringify(list));
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo obtener la lista de productos.");
  }
}

export async function authMLToken() {
  const url = "http://187.189.243.250:3500/api/token";
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Basic SmF6OlB6dlc3NzArKEkmIi1bTzM5bS1gJA=="
  );
  myHeaders.append("Cookie", "PHPSESSID=knp29skeuae0ful6abkfuhnshq");

  const response = await fetch(url, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  });

  return response.json();
}
