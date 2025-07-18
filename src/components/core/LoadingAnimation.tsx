"use client";
import LoadingOverlay from "@achmadk/react-loading-overlay/nextjs";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { PropsWithChildren } from "react";

export default function LoadingAnimation({ children }: PropsWithChildren) {
  return (
    <LoadingOverlay
      active={false}
      text="Cargando..."
      spinner={
        <DotLottieReact
          renderConfig={{ autoResize: true }}
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
