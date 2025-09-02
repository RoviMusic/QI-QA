"use server";
import dbConnect from "@/lib/mongodb";
import {
  IProductsList,
  ProductsListSchema,
} from "../models/CompetitionProdsModel";
import { GetTokenMeli } from "@/lib/meli";

export async function GetMainData() {
  try {
    const hash: any = {};
    let stored;
    const products: any = { list: [] };

    const tokenData = await GetTokenMeli();

    console.log("Token data:", tokenData);
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo obtener la data principal.");
  }
}

export async function GetProductsList() {
  try {
    const conn = await dbConnect();

    const db = conn.connection.useDb("couch_migrated", { useCache: true });

    const DB_ProductsListModel =
      db.models.ProductsList ||
      db.model<IProductsList>("ProductsList", ProductsListSchema);

    const list = await DB_ProductsListModel.find().sort({ _id: -1 }).lean();

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
