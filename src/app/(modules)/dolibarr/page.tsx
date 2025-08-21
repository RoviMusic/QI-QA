"use client";
import { App } from "antd";
import { useEffect, useRef, useState } from "react";
import { localStorageService } from "@/shared/services/localStorageService";
import { useRouter } from "next/navigation";

export default function DolibarrPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loginStatus, setLoginStatus] = useState("loading"); // loading, login_required, logged_in
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [alreadyLogout, setAlreadyLogout] = useState(false);
  const { notification } = App.useApp();
  const router = useRouter()

  const DOLIBARR_CREDENTIALS = {
    username: localStorageService.getItem('user'),
    password: localStorageService.getItem('pass'),
  };

  // CSS personalizado
  const customCSS = `
    #mainbody, #id-right, .side-nav, .vmenu, #blockvmenusearch, .blockvmenu{
      background: transparent !important;
    }
    
    #id-left{
      background: rgba(255, 255, 255, 0.39);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(11.5px);
      -webkit-backdrop-filter: blur(11.5px);
      border: 1px solid rgba(255, 255, 255, 0.38);
    }

    /* Ocultar formulario de login mientras se procesa */
    .login-form-hidden {
      opacity: 0.5 !important;
      pointer-events: none !important;
    }

    #topmenu-login-dropdown{
      display: none
    }
  `;

  // Función para detectar si estamos en la página de login
  const isLoginPage = (doc: any) => {
    try {
      return !!(
        doc.querySelector('input[name="username"]') ||
        doc.querySelector('input[name="loginfunction"]') ||
        doc.querySelector(".login") ||
        doc.querySelector("#login") ||
        doc.querySelector('form[action*="login"]')
      );
    } catch (error) {
      return false;
    }
  };

  // Función para realizar auto-login
  const performAutoLogin = (iframeDoc: any) => {
    try {
      // Buscar elementos del formulario de login
      const usernameField =
        iframeDoc.querySelector('input[name="username"]') ||
        iframeDoc.querySelector('input[name="loginfunction"]') ||
        iframeDoc.querySelector("#username") ||
        iframeDoc.querySelector("#login");

      const passwordField =
        iframeDoc.querySelector('input[name="password"]') ||
        iframeDoc.querySelector("#password");

      const loginForm =
        iframeDoc.querySelector("form") ||
        iframeDoc.querySelector('form[method="post"]');

      const submitButton =
        iframeDoc.querySelector('input[type="submit"]') ||
        iframeDoc.querySelector('button[type="submit"]') ||
        iframeDoc.querySelector(".button");

      const dolibarrToken = iframeDoc.querySelector('input[name="token"]')

      if(dolibarrToken){
        console.warn(dolibarrToken.value)
        localStorageService.setItem('dolibarrToken', dolibarrToken.value)
      }

      if (usernameField && passwordField && loginForm) {
        // Llenar credenciales
        usernameField.value = DOLIBARR_CREDENTIALS.username;
        passwordField.value = DOLIBARR_CREDENTIALS.password;

        // Disparar eventos de cambio para que Dolibarr detecte los valores
        usernameField.dispatchEvent(new Event("input", { bubbles: true }));
        usernameField.dispatchEvent(new Event("change", { bubbles: true }));
        passwordField.dispatchEvent(new Event("input", { bubbles: true }));
        passwordField.dispatchEvent(new Event("change", { bubbles: true }));

        console.log("Credenciales ingresadas, enviando formulario...");

        // Ocultar visualmente el formulario
        //loginForm.classList.add("login-form-hidden");

        // Enviar formulario
        setTimeout(() => {
          if (submitButton) {
            submitButton.click();
          } else {
            loginForm.submit();
          }
        }, 500);

        setLoginStatus("logging_in");
        setLoginAttempts((prev) => prev + 1);

        return true;
      } else {
        console.log(
          "No se encontraron todos los elementos del formulario de login"
        );
        console.log("Username field:", usernameField);
        console.log("Password field:", passwordField);
        console.log("Form:", loginForm);
        notification.open({
          type: "error",
          message: "Error al iniciar sesión",
          description: `No se pudo obtener la información del formulario de login. Por favor, verifica las credenciales.`,
        });
        return false;
      }
    } catch (error) {
      console.error("Error durante auto-login:", error);
      notification.open({
        type: "error",
        message: "Error al iniciar sesión",
        description: `Error durante auto-login ${error}.`,
      });
      return false;
    }
  };

  // Función para inyectar CSS personalizado
  const injectCustomCSS = (iframeDoc: any) => {
    try {
      let customStyleElement = iframeDoc.getElementById("qi-custom-styles");

      if (!customStyleElement) {
        customStyleElement = iframeDoc.createElement("style");
        customStyleElement.id = "qi-custom-styles";
        customStyleElement.type = "text/css";
        iframeDoc.head.appendChild(customStyleElement);
      }

      customStyleElement.innerHTML = customCSS;
    } catch (error) {
      console.log("No se puede inyectar CSS debido a CORS");
    }
  };

  // Función principal para manejar carga del iframe
  const handleIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      const currentUrl = iframe.contentWindow?.location.href;

      // Inyectar CSS siempre
      setTimeout(() => injectCustomCSS(iframeDoc), 100);
      
      // Verificar si estamos en página de login
      if (isLoginPage(iframeDoc)) {
        console.log("Página de login detectada");
        setLoginStatus("login_required");

        // Intentar auto-login si no hemos intentado muchas veces
        if (loginAttempts < 3) {
          setTimeout(() => {
            const success = performAutoLogin(iframeDoc);
            if (!success) {
              setLoginStatus("login_failed");
            }
          }, 1000);
        } else {
          setLoginStatus("login_failed");
          console.log("Demasiados intentos de login, deteniendo...");
        }
      } else {
        // Ya estamos logueados
        console.log("Usuario ya logueado o página principal");
        setLoginStatus("logged_in");

        // Configurar navegación
        setupNavigation(iframeDoc, iframe);
      }
    } catch (error) {
      console.log("Error accediendo al iframe (posible CORS):", error);
      setLoginStatus("cors_error");
    }
  };

  // Función para configurar navegación
  const setupNavigation = (iframeDoc: any, iframe: any) => {
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
        iframe.src = newUrl;
      }
    };

    // Interceptar clics en enlaces
    const links = iframeDoc.querySelectorAll("a[href]");

    links.forEach((link: any) => {
      if (link.className && link.className.includes("dropdown-toggle")) {
        // Skip dropdown-toggle links
        return;
      }
      link.addEventListener("click", (e: any) => {
        const href = link.getAttribute("href");
        if(href.includes('pos')){
          console.warn('aaaaa', href)
          window.open(href, '_blank')
          router.push('/dolibarr/redirect')
        }
        if (href && !href.startsWith("http")) {
          e.preventDefault();

          let newUrl = href;

          if (!href.startsWith("/")) {
            newUrl = "/erp/" + href;
          } else {
            const pathParts = href.split("/");
            if (pathParts.length > 1 && pathParts[1]) {
              pathParts[1] = "erp";
              newUrl = pathParts.join("/");
            } else {
              newUrl = href.replace(/^\//, "/erp/");
            }
          }
          updateIframeUrl(newUrl);
        }
      });
    });

    // Observer para re-inyectar CSS en navegación
    const observer = new MutationObserver(() => {
      setTimeout(() => injectCustomCSS(iframeDoc), 100);
    });

    observer.observe(iframeDoc.body, {
      childList: true,
      subtree: true,
    });
  };

  // Función para reintentar login manualmente
  const retryLogin = () => {
    setLoginAttempts(0);
    setLoginStatus("loading");
    iframeRef.current!.src = "/erp/index.php?mainmenu=home";
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);

      return () => {
        iframe.removeEventListener("load", handleIframeLoad);
      };
    }
  }, [loginAttempts]);

  // Función para login manual
  // const manualLogin = () => {
  //   try {
  //     const iframe = iframeRef.current;
  //     const iframeDoc =
  //       iframe?.contentDocument || iframe?.contentWindow?.document;
  //     performAutoLogin(iframeDoc);
  //   } catch (error) {
  //     console.error("Error en login manual:", error);
  //   }
  // };

  return (
    <>
      <div className="h-full">
        <div className="absolute top-2 left-2 z-10 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              loginStatus === "logged_in"
                ? "bg-green-500"
                : loginStatus === "logging_in"
                ? "bg-yellow-500"
                : loginStatus === "login_required"
                ? "bg-orange-500"
                : loginStatus === "login_failed"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          ></div>
          <span className="text-xs">
            {loginStatus === "logged_in"
              ? "Conectado"
              : loginStatus === "logging_in"
              ? "Iniciando sesión..."
              : loginStatus === "login_required"
              ? "Login requerido"
              : loginStatus === "login_failed"
              ? "Error de login"
              : "Cargando..."}
          </span>
          {(loginStatus === "login_failed" || loginStatus === "cors_error") && (
            <button
              onClick={retryLogin}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs ml-2"
            >
              Reintentar
            </button>
          )}
        </div>
        <div style={{ height: "100%" }}>
          <iframe
            ref={iframeRef}
            src="/erp/index.php?mainmenu=home"
            width="100%"
            height="100%"
            title="Dolibarr v20 iframe"
            onLoad={() => console.log("Iframe cargado")}
          ></iframe>
        </div>
      </div>
    </>
  );
}
