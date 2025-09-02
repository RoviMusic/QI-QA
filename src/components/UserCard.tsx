"use client";
import useStore from "@/shared/hooks/useStore";
import { useUserStore } from "@/shared/stores/userStore";
import { App, Avatar, Button, Divider, Flex, Space } from "antd";
import { GlassCard } from "./core/GlassCard";
import { UserOutlined } from "@ant-design/icons";
import { DefaultTitle, MutedSubtitle } from "./core/Titulo";
import { getIcon } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { localStorageService } from "@/shared/services/localStorageService";
import { authService } from "@/modules/auth/services/authService";

export default function UserCard() {
  const dataUser = useStore(useUserStore, (state) => state.user);
  const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_DOLIBARR;
  const router = useRouter();
  const dolToken = localStorageService.getItem("dolibarrToken");
  const { message, notification } = App.useApp();

  const handleLogout = async () => {
    message.open({
      type: "loading",
      content: "Cerrando sesión",
      duration: 0,
    });
    const dolibarrWindow = window.open(
      `${logoutUrl}${dolToken}`,
      "_blank",
      "width=600,height=400"
    );
    if (dolibarrWindow) {
      setTimeout(() => {
        dolibarrWindow.close();
      }, 800);
    }
    authService
      .logout()
      .then((res) => {
        if (res) {
          message.destroy();
          router.replace("/");
        }
      })
      .catch((e) => {
        console.error("error al cerrar sesion ", e);
        notification.open({
          type: "error",
          message: "Error al cerrar sesión",
          description: `No se pudo cerrar sesión. ${e.message}`,
        });
      });
  };

  return (
    <>
      <GlassCard>
        <Flex vertical>
          <Flex vertical align="center">
            <Avatar
              icon={<UserOutlined />}
              size={64}
              style={{ background: "#FAB627" }}
            />
            <DefaultTitle>{dataUser?.fullName}</DefaultTitle>
            <MutedSubtitle>{dataUser?.login}</MutedSubtitle>
          </Flex>
          <Divider />
          <Space>
            <Button icon={<UserOutlined />}>Ficha</Button>

            <Button icon={getIcon("Logout")} onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Space>
        </Flex>
      </GlassCard>
    </>
  );
}
