"use client";
import { MenuDummy } from "@/shared/types/menuTypes";
import { Menu, Space, MenuProps } from "antd";
import NavButton from "../core/NavButton";
import { iconComponents } from "@/lib/constants/Icon";
import { MenuType } from "@/shared/types/menuTypes";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

export default function AreaMenu({ mode = "horizontal" }: MenuProps) {
  const areas = MenuDummy;
  const pathname = usePathname();
  const [path, setPath] = useState<string>(pathname);
  const router = useRouter();

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
                  <Link href={child.path} replace>
                    {child.label}
                  </Link>
                ) : (
                  child.label
                ),
                child.id,
                getIcon(child.icon || "Default"),
                child.children
                  ? child.children.map((childest) =>
                      getItemMenu(
                        childest.path ? (
                          <Link href={childest.path} replace>
                            {childest.label}
                          </Link>
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

  const items: MenuItem[] = [
    {
      label: "QI",
      key: "qi",
      icon: getIcon("Gauge"),
      //onClick: () => router.push("/dashboard"),
      children: [
        {
          label: "Dashboard",
          key: "dashboard",
          icon: getIcon("Gauge"),
          onClick: () => router.push("/dashboard"),
        },
        {
          label: "Marketplaces",
          key: "mkp",
          icon: getIcon("Store"),
          children: [
            {
              label: "Sincronizador y Procesador",
              key: "syncprocess",
              onClick: () => router.push("/marketplaces/syncprocess"),
            },
            {
              label: "Envíos Revisar",
              key: "shipRev",
              onClick: () => router.push("/marketplaces/shipmentReview"),
            },
            {
              label: "Procesador FBA",
              key: "fbaProc",
              onClick: () => router.push("/marketplaces/processFBA"),
            },
            {
              label: "Visualizador de stock",
              key: "stockviewer",
              onClick: () => router.push("/marketplaces/stockMarketsViewer"),
            },
          ],
        },
        {
          label: "Tools",
          key: "tools",
          icon: getIcon("Toolbox"),
          children: [
            {
              label: "Fullfilment",
              key: "picking",
              onClick: () => router.push("/tools/fullfilment"),
            },
            {
              label: "Publicaciones Creadas",
              key: "createdL",
              onClick: () => router.push("/tools/createdListings"),
            },
            {
              label: "Pérdidas en publicaciones",
              key: "publicationsLosses",
              onClick: () => router.push("/tools/publicationsLosses"),
            },
            {
              label: "Veerkamp Cart",
              key: "veerkampCart",
              onClick: () => router.push("/tools/veerkampCart"),
            },
            {
              label: "Competencia",
              key: "comp",
              children: [
                {
                  label: "Market prices",
                  key: "mktPrices",
                  onClick: () => router.push("/tools/competition"),
                },
                {
                  label: "Policía",
                  key: "policeman",
                  onClick: () => router.push("/tools/competition/police"),
                },
              ],
            },
          ],
        },
        {
          label: "Developer",
          key: "dev",
          icon: getIcon("Code"),
          children: [
            {
              label: "S&P",
              key: "sip",
              onClick: () => router.push("/developer/syp"),
            },
          ],
        },
      ],
    },
    {
      label: "Dolibarr",
      key: "dol",
      icon: getIcon("Toolbox"),
      onClick: () => {
        window.open(process.env.NEXT_PUBLIC_DOLIBARR_URL, "_blank");
      },
    },
    {
      label: "Ecommerce",
      key: "magento",
      icon: getIcon("Cart"),
      children: [
        {
          label: "Categorías",
          key: "categories",
          onClick: () => router.push("/ecommerce/categories"),
          icon: getIcon("Shop"),
        },
        {
          label: "Departamentos",
          key: "departments",
          onClick: () => router.push("/ecommerce/departments"),
          icon: getIcon("Shop"),
        },
      ],
    },
    {
      label: "Reportes",
      key: "reports",
      icon: getIcon("Folder"),
      children: [
        {
          label: "Análisis",
          key: "analysis",
          icon: getIcon("ChartSimple"),
          children: [
            {
              label: "Reporte para compras",
              key: "purchaseRep",
              onClick: () => router.push("/reports/analysis/purchaseReport"),
            },
          ],
        },
        {
          label: "Productos",
          key: "products",
          icon: getIcon("Cart"),
          children: [
            {
              label: "Edición de productos",
              key: "editingPr",
              onClick: () => router.push("/reports/products/productsEdit"),
            },
            {
              label: "Productos con excedente",
              key: "overstockP",
              onClick: () => router.push("/reports/products/overstockProducts"),
            },
          ],
        },
        {
          label: "Pedidos proveedor",
          key: "supplierOrders",
          icon: getIcon("File-Lines"),
          children: [
            {
              label: "Crear borrador",
              key: "draft",
              onClick: () => router.push("/reports/supplierOrders/createDraft"),
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <div className={mode == "horizontal" ? "w-xl" : ""}>
        {/* <Space>
          {areas.map((item) => (
            <>
              <NavButton area={..item} style={path.includes(`/${item.label.toLocaleLowerCase()}`)  ? 'active' : 'inactive'}>{item.label}</NavButton>
            </>
          ))}
        </Space> */}
        <Menu items={items} mode={mode} />
      </div>
    </>
  );
}
