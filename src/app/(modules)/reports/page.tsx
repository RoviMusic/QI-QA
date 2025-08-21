"use client";
import { useRef } from "react";

export default function ReportsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Se puede guardar
  return (
    <>
      <div className="h-full">
        <div style={{ height: "100%" }}>
          <iframe
            ref={iframeRef}
            src="http://187.189.243.250:8100/reportes/"
            width="100%"
            height="100%"
            title="Reports iframe"
            onLoad={() => console.log("Iframe cargado")}
          ></iframe>
        </div>
      </div>
    </>
  );
}
