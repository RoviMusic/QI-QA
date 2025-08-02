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
import { GlassCard } from "@/components/core/GlassCard";


export default async function LoginPage() {
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
