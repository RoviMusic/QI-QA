//Type definitions file for the menu
//AreaType encompasses modules, modules in turn encompass pages
//Ejem: Area Ecommerce -> modulo Catalogo -> pagina Alta (de producto de catalogo)
//Ejem: Area Ecommerce -> modulo Servicios -> pagina Registro
export type AreaType = {
  id: number;
  label: string;
  icon: string;
  children: MenuType[];
};

export type MenuType = {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuType[];
};

export const MenuDummy: AreaType[] = [
  {
    id: 0,
    label: "Dashboard",
    icon: "Gauge",
    children: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "Gauge",
        path: "/dashboard",
      },
    ],
  },
  {
    id: 1,
    label: "ECommerce",
    icon: "Store",
    children: [
      {
        id: "catalog",
        label: "Catálogo",
        icon: "Folder",
        children: [
          {
            id: 'products',
            label: "Productos",
            children: [
              {
                id: "p-read",
                label: "Consulta",
                path: "ecommerce/catalog",
              },
              {
                id: "p-create",
                label: "Alta",
                path: "ecommerce/catalog/product/create",
              },
              // {
              //   id: "p-edit",
              //   label: "Editar",
              //   path: "ecommerce/catalog/product/[sku]",
              // },
            ]
          },
          {
            id: 'suppliers',
            label: "Proveedores",
            children: [
              {
                id: 's-read',
                label: "Consulta",
                path: "ecommerce/catalog/supplier",
              },
              {
                id: 's-create',
                label: "Alta",
                path: "ecommerce/catalog/supplier/create",
              }
            ]
          }
        ],
      },

      {
        id: "servicios",
        label: "Servicios",
        icon: "Screwdriver-Wrench",
        children: [
          {
            id: "reparaciones",
            label: "Reparaciones",
            path: "ecommerce/services/repairs",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Rovi Music Tools",
    icon: "Toolbox",
    children: [
      {
        id: "competencia",
        label: "Competencia",
        icon: "People-Arrows",
        children: [
          {
            id: "precioMkt",
            label: "Precios Market",
            path: "tools/competition/marketPrices",
          },
          {
            id: "policia",
            label: "Policía",
            path: "tools/competition/police",
          },
        ],
      },
      {
        id: "promociones",
        label: "Promociones",
        icon: "Tags",
        children: [
          {
            id: "clavos",
            label: "Por clavos",
            path: "tools/promotions",
          },
          {
            id: "seassons",
            label: "Por temporada",
            path: "tools/promotions",
          },
          {
            id: "stock",
            label: "Por stock",
            path: "tools/promotions",
          },
          {
            id: "layover",
            label: "Por layovers",
            path: "tools/promotions",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Analytics",
    icon: "ChartSimple",
    children: [
      {
        id: "marketReports",
        label: "Reportes",
        icon: "ChartSimple",
        path: "/analytics/marketReports"
      },
    ],
  },
];
