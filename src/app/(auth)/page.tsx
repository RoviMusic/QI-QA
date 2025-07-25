/* 
Main page that renders when entering the '/' route
includes the loginForm component, component for selecting the system language and the particle background
*/

/*
pagina principal que se renderiza al entrar a la ruta '/'
incluye el componente del loginForm, componente para seleccionar el lenguaje del sistema y el fondo de particulas 
*/
import LoginForm from "@/modules/auth/components/loginForm";
import { Particles } from "@/components/magicui/particles";
import LocaleSelect from "@/components/LocaleSelect";
import GlassCard from "@/components/core/GlassCard";

import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  // if (!session) {
  //   const checkSession = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.AUTH_API_URL}api/check-dolibarr-session`,
  //         {
  //           // credentials: 'include' es crucial para enviar las cookies al backend
  //           credentials: "include",
  //         }
  //       );

  //       const data = await response.json();
  //       console.warn(data)

  //       if (data.isAuthenticated) {
  //         console.log("AUTH EN DOL ", data);
  //         await signIn("credentials", {
  //           user: JSON.stringify(data.user),
  //         });
  //         //redirect("/dashboard");
  //       } else {
  //         console.warn("NOT AUTH");
  //       }
  //     } catch (error) {
  //       console.error("Failed to check session:", error);
  //     }
  //   };
  //   checkSession();
  // } else {
  //   console.log("ALREADY AUTH");
  // }

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <GlassCard style={{ maxWidth: "24rem", width: "100%" }}>
          <div className="flex justify-end mb-3 flex-wrap">
            <LocaleSelect />
          </div>
          <LoginForm />
        </GlassCard>
      </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={"#000"}
        refresh
      />
    </>
  );
}
