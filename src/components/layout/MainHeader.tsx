'use client'
import { Button, Flex, Layout } from "antd";
import { LogoAlt } from "../RoviLogo";
import AreaMenu from "./AreaMenu";
import LocaleSelect from "../LocaleSelect";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";

const { Header } = Layout;

export default function MainHeader() {
  return (
    <>
      <Header>
        <Flex justify="space-between" align="center" style={{ height: "100%" }}>
          <LogoAlt />
          <AreaMenu />
          <LocaleSelect />
          <Button
            icon={<LogoutOutlined />}
            onClick={() => signOut({ redirectTo: "/" })}
          />
        </Flex>
      </Header>
    </>
  );
}
