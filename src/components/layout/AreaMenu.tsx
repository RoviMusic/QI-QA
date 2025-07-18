'use client'
import { MenuDummy } from "@/shared/types/menuTypes";
import { Menu, Space, MenuProps } from "antd";
import NavButton from "../core/NavButton";
import { iconComponents } from "@/lib/constants/Icon";
import { MenuType } from "@/shared/types/menuTypes";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

export default function AreaMenu() {
  const areas = MenuDummy;
  const pathname = usePathname();
  const [path, setPath] = useState<string>(pathname);

  useEffect(() => {
    setPath(pathname);
    console.log("Pathname changed:", pathname);
  }, [pathname]);

  //transforma items del menu en tipo MenuItem
  function getItemMenu(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] | null
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  function obtenerMenu(): MenuItem[] {
    return MenuDummy.map((item) =>
      getItemMenu(
        item.label,
        item.id,
        getIcon(item.icon || "Default"),
        item.children
          ? item.children.map((child) =>
              getItemMenu(
                child.path ? (
                  <Link href={child.path} replace>{child.label}</Link>
                ) : (
                  child.label
                ),
                child.id,
                getIcon(child.icon || "Default"),
                child.children
                  ? child.children.map((childest) =>
                      getItemMenu(
                        childest.path ? (
                          <Link href={childest.path} replace>{childest.label}</Link>
                        ) : (
                          childest.label
                        ),
                        childest.id,
                        getIcon(child.icon || "Default"),
                        childest.children
                          ? childest.children.map((ch) =>
                              getItemMenu(
                                ch.path ? (
                                  <Link href={ch.path} replace>
                                    {ch.label}
                                  </Link>
                                ) : (
                                  ch.label
                                ),
                                ch.id
                              )
                            )
                          : null
                      )
                    )
                  : null
              )
            )
          : null
      )
    );
  }

  function getIcon(iconName: string) {
    const IconComponent = iconComponents[iconName];
    return IconComponent();
  }

  return (
    <>
      <div className="px-2">
        {/* <Space>
          {areas.map((item) => (
            <>
              <NavButton area={item} style={path.includes(`/${item.label.toLocaleLowerCase()}`)  ? 'active' : 'inactive'}>{item.label}</NavButton>
            </>
          ))}
        </Space> */}
        <Menu items={obtenerMenu()} mode="horizontal" />
      </div>
    </>
  );
}
