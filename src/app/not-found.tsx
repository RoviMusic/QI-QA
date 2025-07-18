"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const router = useRouter();
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="lg:h-60 md:h-32">
          <DotLottieReact
            src="/animations/not-found.lottie"
            loop
            autoplay
          />
        </div>
        <div className="text-center">
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              type="primary"
              onClick={() => router.back()}
              icon={<ArrowLeftOutlined />}
            >
              {t("buttonLabel")}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
