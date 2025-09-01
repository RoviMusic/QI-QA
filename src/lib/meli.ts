import "server-only";
type MeliTokenResponse = {
  access_token: string;
  token_type: "bearer";
  expires_in: number; // en segundos
  scope: string;
  user_id: number;
  refresh_token: string;
};

const TOKEN_URL = process.env.ML_AUTH_TOKEN_URL;

export async function GetTokenMeli(): Promise<MeliTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.MELI_CLIENT_ID!,
    client_secret: process.env.MELI_CLIENT_SECRET!,
  });

  const res = await fetch(TOKEN_URL!, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  console.log("Response meli token:", res);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error intercambiando code: ${res.status} ${err}`);
  }
  return res.json();
}
