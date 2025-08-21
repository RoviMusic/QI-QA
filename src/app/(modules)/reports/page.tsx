"use client";
import { useRef } from "react";

export default function ReportsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  return (
    <>
      <div className="h-full">
        <div style={{ height: "100%" }}>
          <iframe
            ref={iframeRef}
            src="http://187.189.243.250:3750/index.php"
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
