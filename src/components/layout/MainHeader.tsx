"use client";
import { Button, Drawer, Flex, Layout } from "antd";
import { LogoAlt, RoviLogo } from "../RoviLogo";
import AreaMenu from "./AreaMenu";
import LocaleSelect from "../LocaleSelect";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { getIcon } from "@/lib/utils";

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
          {/* {width > 1000 ? <LogoAlt /> : <RoviLogo width={50} height={50}/>} */}

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
          {/* <Button
            icon={<LogoutOutlined />}
            onClick={() => signOut({ redirectTo: "/" })}
          /> */}
        </Flex>
      </Header>
    </>
  );
}
