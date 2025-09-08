"use server";

export type AmazonTicketData = {
  amazonCode: string;
  sku: string;
  quantity: number;
  price: number;
};

export async function createAmazonTicketAction(data: AmazonTicketData) {
  // Lógica para crear un ticket de Amazon
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log("Creating Amazon ticket with data:", data);

    const raw = JSON.stringify({
      api_key: process.env.FBA_API_KEY,
      amazon_code: data.amazonCode,
      sku: data.sku,
      quantity: data.quantity,
      price: data.price,
    });

    const response = await fetch(process.env.FBA_CREATE_TICKET_URL!, {
      method: "POST",
      body: raw,
      headers: myHeaders,
      redirect: "follow",
      mode: "cors",
    });

    const parsedResult = await response.json();
    console.log("Result: ", parsedResult);

    return parsedResult;
  } catch (error: any) {
    console.error("Error creating Amazon ticket:", error.message);
    throw new Error("Failed to create Amazon ticket");
  }
}
