import { Resend } from "resend";

export async function sendEmailsAlerts({
  message,
  level,
  where,
}: {
  message: string;
  level: "CRITICAL" | "WARNING" | "ERROR";
  where: "Procesador" | "Sync";
}) {
  const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

  try {
    //const htmlEmail = await render(AlertsEmail({ message, level, where }));
    const { data, error } = await resend.emails.send({
      from: "noreply@rovimusic.com",
      to: [
        "ruben.ibarra@rovimusic.com",
        "jorge.culebro@rovimusic.com",
        "daniela.munoz@rovimusic.com",
        "e.moran@rovimusic.com",
        "emilia@rovimusic.com",
        "ric@rovimusic.com",
        "market.places@rovimusic.com",
      ],
      subject: `${where} - Alerta nivel: ${level}`,
      text: `${message}`,
      //react: AlertsEmail(payload),
    });

    if (error) {
      console.log("error from sendEmailAlerts", error);
      return Response.json({ error }, { status: 500 });
    }

    console.log(`📧 Alerta enviada: ${level} - ${message}`);
    return Response.json({ data });
  } catch (error) {
    console.log("Error enviando email de alerta", error);
    return Response.json({ error }, { status: 500 });
  }
}
