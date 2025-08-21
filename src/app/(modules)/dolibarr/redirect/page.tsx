'use client'
import { ArrowLeftOutlined } from "@ant-design/icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function RedirectDoliPage() {
    const router = useRouter()
  return (
    <>
      <main className="grid min-h-full place-items-center bg-transparent px-6 py-10 sm:py-16 lg:px-8">
        <div className="lg:h-60 md:h-32">
          <DotLottieReact src="/animations/Redirected.lottie" loop autoplay />
        </div>
        <div className="text-center">
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Te hemos redirigido a la pantalla correspondiente.
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Puedes seguir trabajando desde ahí.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              type="primary"
              onClick={() => router.back()}
              icon={<ArrowLeftOutlined />}
            >
              Regresar
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
