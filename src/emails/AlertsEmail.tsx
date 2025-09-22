import {
  Body,
  Button,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Link from "next/link";
import * as React from "react";

const AlertsEmail = ({
  message,
  level,
  where,
}: {
  message: string;
  level: "CRITICAL" | "WARNING" | "ERROR";
  where: "Procesador" | "Sync";
}) => {
  const qiUrl = "http://187.189.243.250:3105";

  return (
    <Html>
      <Tailwind>
        <Head>
          <title>Alertas Rovi</title>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Alerta de sistema - Nivel: {level}</Preview>

        <Body className="bg-[#e5e5e3] font-['Inter',Arial,sans-serif] py-10">
          <Heading className="text-4xl leading-tight font-extrabold text-[#333333] my-8 font-['Inter',Arial,sans-serif] uppercase tracking-tight text-center">
            {level === "CRITICAL" ? "🚨" : "⚠️"}Alerta en {where} - Nivel:{" "}
            {level}
            {level === "CRITICAL" ? "🚨" : "⚠️"}
          </Heading>

          <Section className="my-10 justify-center text-center">
            <Text>
              Se ha detectado una alerta en {where} con el siguiente mensaje:
            </Text>
            <Text className="font-semibold text-lg text-[#333333] my-4">
              {message}
            </Text>
          </Section>

          <Section className="my-10 justify-center text-center">
            <Link
              href={qiUrl!}
              className="bg-[#FAB627] rounded-full text-white text-base font-semibold no-underline uppercase py-2 px-5 inline-block"
            >
              Ir a QI
            </Link>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AlertsEmail;
