import { Resend } from "resend";
//import AlertsEmail from "@/emails/AlertsEmail";

type Body = {
  message: string;
  level: "CRITICAL" | "WARNING" | "ERROR";
  where: "Procesador" | "Sync";
};

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  let { message, level, where } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@rovimusic.com",
      to: ["daniela.munoz@rovimusic.com", "e.moran@rovimusic.com"],
      subject: `Alerta en ${where} - Nivel: ${level}`,
      text: "hola prueba solo texto",
      //react: AlertsEmail({ message, level, where }),
    });

    if (error) {
      console.log("error ", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.log("error 2", error);
    return Response.json({ error }, { status: 500 });
  }
}
