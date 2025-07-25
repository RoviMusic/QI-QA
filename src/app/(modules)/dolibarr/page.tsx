"use client";
import { useEffect, useRef } from "react";

export default function DolibarrPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Función para extraer parámetros de URL
    const extractMenuParams = (url: any) => {
      const urlObj = new URL(url);
      const mainmenu = urlObj.searchParams.get("mainmenu");
      const leftmenu = urlObj.searchParams.get("leftmenu");
      return { mainmenu, leftmenu };
    };

    // Función para actualizar la URL del iframe
    const updateIframeUrl = (newUrl: any) => {
      if (iframe && iframe.src !== newUrl) {
        console.log("Actualizando iframe URL a:", newUrl);
        iframe.src = newUrl;
      }
    };

    // Escuchar cambios en el iframe
    const handleIframeLoad = () => {
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;
        const currentUrl = iframe.contentWindow?.location.href;

        // Extraer parámetros del menú de la URL actual
        const { mainmenu, leftmenu } = extractMenuParams(currentUrl);

        // Si hay parámetros de menú, actualizar
        if (mainmenu || leftmenu) {
          console.log("Menú detectado:", { mainmenu, leftmenu });

          // Opcional: Almacenar estado del menú actual
          sessionStorage.setItem(
            "dolibarr_current_menu",
            JSON.stringify({ mainmenu, leftmenu })
          );
        }

        // Interceptar clics en enlaces dentro del iframe
        const links = iframeDoc?.querySelectorAll("a[href]");
        links?.forEach((link) => {
          link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href && !href.startsWith("http")) {
              // Prevenir navegación normal
              e.preventDefault();

              let newUrl = href;
              console.log("href original:", href);

              if (!href.startsWith("/")) {
                // URL relativa, agregar prefijo /erp/
                newUrl = "/erp/" + href;
              } else {
                // URL absoluta, reemplazar el primer segmento por /erp/
                // Ejemplo: /rovimusic/product/index.php -> /erp/product/index.php
                const pathParts = href.split("/");
                if (pathParts.length > 1 && pathParts[1]) {
                  // Reemplazar el primer segmento (rovimusic) por erp
                  pathParts[1] = "erp";
                  newUrl = pathParts.join("/");
                } else {
                  // Fallback: simplemente agregar /erp/
                  newUrl = href.replace(/^\//, "/erp/");
                }
              }

              console.log("nueva URL construida:", newUrl);

              // Extraer parámetros del menú de la URL destino
              const fullUrl = new URL(
                href,
                iframe.contentWindow?.location.origin
              );
              const { mainmenu, leftmenu } = extractMenuParams(fullUrl.href);

              if (mainmenu || leftmenu) {
                console.log("Navegando a menú:", { mainmenu, leftmenu });

                // Actualizar la URL del iframe con los nuevos parámetros
                updateIframeUrl(newUrl);
              } else {
                // Si no hay parámetros de menú, navegar normalmente
                updateIframeUrl(newUrl);
              }
            }
          });
        });
      } catch (error) {
        // Error de CORS - el iframe está en diferente dominio
        console.log(
          "No se puede acceder al contenido del iframe debido a CORS"
        );
      }
    };

    // Escuchar cuando el iframe se carga
    iframe.addEventListener("load", handleIframeLoad);

    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, []);

  return (
    <>
      <div className="h-full">
        <div style={{ height: "100%" }}>
          <iframe
            ref={iframeRef}
            src="/erp/index.php?mainmenu=home"
            width="100%"
            height="100%"
            title="Example Website"
            onLoad={() => console.log("Iframe cargado")}
          ></iframe>
        </div>
      </div>
    </>
  );
}
