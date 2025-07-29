import localFont from "next/font/local";
import "./globals.css";
// ******FontAwesome configuration*****
import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { fas } from "@fortawesome/free-solid-svg-icons";
config.autoAddCss = false;
library.add(fas);
// **** end *****
//********* Internationalization configuration *******/
import { getLocale, getMessages } from "next-intl/server";
//********* end  ******/
import LoadingAnimation from "@/components/core/LoadingAnimation";
import AppProviders from "@/providers/AppProviders";

// Official Neue Haas Display font import
export const NeueFont = localFont({
  src: [
    {
      path: "../styles/fonts/NeueHaasDisplayLight.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../styles/fonts/NeueHaasDisplayRoman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../styles/fonts/NeueHaasDisplayMedium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-Neue",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch locale and messages for internationalization
  // This is done on the server side to ensure the correct locale is used for rendering
  // and to avoid hydration issues on the client side.
  const locale = await getLocale();
  const messages = await getMessages();
  // The `suppressHydrationWarning` prop is used to prevent React from warning about
  // mismatches between server-rendered and client-rendered content.
  return (
    <html lang={locale} suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning className="h-full">
        <AppProviders IntlLocale={locale} messages={messages}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
