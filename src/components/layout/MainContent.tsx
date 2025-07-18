"use client";

import { Layout } from "antd";
import ModulosMenu from "./ModulosMenu";

const { Content } = Layout;

export default function MainContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Content>{children}</Content>
      <ModulosMenu />
    </>
  );
}
