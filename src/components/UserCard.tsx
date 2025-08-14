'use client'
import useStore from "@/shared/hooks/useStore";
import { useUserStore } from "@/shared/stores/authStore";
import { Avatar, Button, Divider, Flex, Space } from "antd";
import { GlassCard } from "./core/GlassCard";
import { UserOutlined } from "@ant-design/icons";
import { DefaultTitle, MutedSubtitle } from "./core/Titulo";
import { getIcon } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { localStorageService } from "@/shared/services/localStorageService";
import { authService } from "@/modules/auth/services/authService";
import { logoutAction } from "@/modules/auth/actions/authActions";

export default function UserCard() {
  const dataUser = useStore(useUserStore, (state) => state.user);
  //const resetUser = useStore(useUserStore, (state) => state.reset)
  const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_DOLIBARR;
  const router = useRouter();
  const dolToken = localStorageService.getItem('dolibarrToken')

  const handleLogout = async () => {
   await logoutAction();
    //resetUser;
    //router.replace(`${logoutUrl}${localStorageService.getItem('dolibarrToken')}`)
  }

  return (
    <>
      <GlassCard>
        <Flex vertical >
          <Flex vertical align="center"> 
            <Avatar icon={<UserOutlined />} size={64} style={{background: '#FAB627'}}/>
            <DefaultTitle>{dataUser?.fullName}</DefaultTitle>
            <MutedSubtitle>{dataUser?.login}</MutedSubtitle>
          </Flex>
            <Divider />
          <Space>
            <Button icon={<UserOutlined />}>Ficha</Button>

            <Button icon={getIcon('Logout')} onClick={handleLogout} href={`${logoutUrl}${dolToken}`}>Cerrar sesión</Button>
          </Space>
        </Flex>
      </GlassCard>
    </>
  );
}
