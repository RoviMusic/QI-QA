import { cn } from "@/lib/utils";
import Image from "next/image";
import { MainTitle } from "../../../components/core/Titulo";
import { providerMap, signIn } from "@/lib/auth";
import { Button, Divider, Input } from "antd";
import { useTranslations } from "next-intl";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const SIGNIN_ERROR_URL = "/error";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations("LoginPage");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-2 mb-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-20 items-center justify-center rounded-md">
              <Image alt="Logo" src="/Logo.jpg" width={100} height={100} />
            </div>
          </a>
          <MainTitle>{t("welcome")}</MainTitle>
        </div>
        <form
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", formData);
            } catch (error) {
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              }
              throw error;
            }
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <p>{t("user")}</p>
                <Input name="username" id="username" required />
              </div>

              <div>
                <p>{t("pass")}</p>
                <Input type="password" name="password" id="password" required />
              </div>
            </div>
            <Button htmlType="submit" type="primary">
              {t("login")}
            </Button>
          </div>
        </form>
        <Divider>{t("or")}</Divider>
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            style={{ alignSelf: "center" }}
            action={async () => {
              "use server";
              try {
                await signIn(provider.id, {
                  redirectTo: "/dashboard",
                });
              } catch (error) {
                // Signin can fail for a number of reasons, such as the user
                // not existing, or the user not having the correct role.
                // In some cases, you may want to redirect to a custom error
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                }

                // Otherwise if a redirects happens Next.js can handle it
                // so you can just re-thrown the error and let Next.js handle it.
                // Docs:
                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                throw error;
              }
            }}
          >
            <Button htmlType="submit" type="default">
              <span>{t("microsoftLogin")}</span>
            </Button>
          </form>
        ))}
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t("terms")}
      </div>
    </div>
  );
}
