"use client";
// **** Ant Design configuration ****
import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { defaultTheme } from "@/styles/antdConfig";
import locale from "antd/locale/es_ES";
// **** end ****
//****** react query configuration *********
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//***** end *******
//********* Next intl configuration **********
import { NextIntlClientProvider } from "next-intl";
//******** end *************
import { LoadingStoreProvider } from "@/shared/providers/loadingStoreProvider";
import { ReactNode, useState } from "react";

interface ClientLayoutProps {
  children: ReactNode;
  IntlLocale: string;
  messages: any;
}

export default function AppProviders({
  children,
  messages,
  IntlLocale,
}: ClientLayoutProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <NextIntlClientProvider locale={IntlLocale} messages={messages}>
        <ConfigProvider theme={defaultTheme} locale={locale}>
          <QueryClientProvider client={queryClient}>
            <LoadingStoreProvider>
              <AntdRegistry>{children}</AntdRegistry>
            </LoadingStoreProvider>
          </QueryClientProvider>
        </ConfigProvider>
      </NextIntlClientProvider>
    </>
  );
}
