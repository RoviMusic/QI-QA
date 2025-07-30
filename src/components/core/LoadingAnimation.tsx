"use client";
import LoadingOverlay from "@achmadk/react-loading-overlay/nextjs";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { PropsWithChildren } from "react";

type Props = {
  children: React.ReactNode;
  isActive: boolean;
}

export default function LoadingAnimation({ children, isActive }: Props) {
  return (
    <LoadingOverlay
      active={isActive}
      text="Cargando..."
      styles={{
        overlay: (base) => ({
          ...base,
          //height: "100vh",
        }),
      }}
      spinner={
        <DotLottieReact
          //renderConfig={{ autoResize: true }}
          src="/animations/loadingG.json"
          loop
          autoplay
        />
      }
    >
      {children}
    </LoadingOverlay>
  );
}
