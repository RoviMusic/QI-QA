"use client";
import { Avatar, Button, Drawer, Flex, Layout, Popover, Space } from "antd";
import { LogoAlt, RoviLogo } from "../RoviLogo";
import AreaMenu from "./AreaMenu";
import LocaleSelect from "../LocaleSelect";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { getIcon } from "@/lib/utils";
import UserCard from "../UserCard";
import { useUserStore } from "@/shared/stores/authStore";
import useStore from "@/shared/hooks/useStore";

const { Header } = Layout;

export default function MainHeader() {
  const getInitialWidth = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  };

  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [width, setWidth] = useState<number>(getInitialWidth);
  const userName = useStore(useUserStore, (state) => state.user?.firstName)

  const handleResize = () => {
    setWidth(window.innerWidth);
    if (window.innerWidth < 820) {
      //setCollapsed(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  return (
    <>
      <Header>
        <Flex justify="space-between" align="center" style={{ height: "100%" }}>
          {width > 1000 ? (
            <>
              <LogoAlt />
              <AreaMenu />
            </>
          ) : (
            <>
              <Button
                icon={getIcon("Bars")}
                onClick={() => setOpenMobileMenu(true)}
              />

              <Drawer
                placement="left"
                closable={true}
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
              >
                <AreaMenu mode="inline"/>
              </Drawer>
            </>
          )}
          <LocaleSelect />
          
          <Popover content={<UserCard />} trigger="click">
            <Button shape="round" icon={<UserOutlined />} type="text">
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <small style={{lineHeight: 'normal'}}>¡Hola!</small>
                <p style={{lineHeight: 'normal'}}>{userName}</p>
              </div>
            </Button>
          </Popover>
        </Flex>
      </Header>
    </>
  );
}
