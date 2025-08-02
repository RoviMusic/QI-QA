"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MainTitle } from "../../../components/core/Titulo";
import { Button, Divider, Input, Form, App } from "antd";
import { useTranslations } from "next-intl";
import { redirect, useRouter } from "next/navigation";
import { authService } from "../services/authService";

import FormItem from "antd/es/form/FormItem";
import Password from "antd/es/input/Password";
import { LoginType } from "../types/loginTypes";
import { useEffect } from "react";
import { localStorageService } from "@/shared/services/localStorageService";

const SIGNIN_ERROR_URL = "/error";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations("LoginPage");
  const router = useRouter()
  const { notification } = App.useApp();

  // TEMPORAL ANTES DEL HTTPS
  const [form] = Form.useForm<LoginType>();

  const onFinish = (values: LoginType) => {
    authService
      .dolibarAuth(values)
      .then((res) => {

        console.warn("response auth ", res);
        if(res){
          router.push('/dolibarr')
          console.log('ok')
        }
      })
      .catch((e) => {
        console.error("Error en auth ", e);
        notification.open({
          type: "error",
          message: "Error al iniciar sesión",
          description: `No se pudo iniciar sesión.`,
        });
      });
  };

  const onFinishFailed = (error: any) => {
    console.error(error);
  };

  // useEffect(() => {
  //   localStorageService.clear();
  // },)

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
        <Form
          name="form-login"
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <FormItem<LoginType> label={t("user")} name="user">
                  <Input name="username" id="username" required />
                </FormItem>
              </div>

              <div>
                <FormItem<LoginType> label={t("pass")} name="pass">
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    required
                  />
                </FormItem>
              </div>
            </div>
            <FormItem>
              <Button htmlType="submit" type="primary" style={{width: '100%'}}>
                {t("login")}
              </Button>
            </FormItem>
          </div>
        </Form>
        {/* <form
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
        </form> */}
        {/* <Divider>{t("or")}</Divider>
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
        ))} */}
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t("terms")}
      </div>
    </div>
  );
}
