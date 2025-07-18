"use client";
import { Select, Space } from "antd";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/config";
import { useTransition } from "react";
import { getUserLocale, setUserLocale } from "@/shared/services/locale";

import { useEffect, useState } from "react";

export default function LocaleSelect() {
  const [locale, setLocale] = useState<string>("es");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getUserLocale().then((res) => setLocale(res));
  }, []);

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
      setLocale(locale);
    });
  }
  
  return (
    <>
      <Select
        size="small"
        value={locale}
        onChange={onChange}
        options={[
          {
            value: "es",
            label: (
              <Space>
                <Image src="/flags/mx.svg" alt="es" width={10} height={10} />
              </Space>
            ),
          },
          {
            value: "en",
            label: (
              <Space>
                <Image src="/flags/us.svg" alt="es" width={10} height={10} />
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}
