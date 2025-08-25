"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { LabelTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import {
  App,
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { dataFiltros } from "../../../dataDummy";
import { authMLToken } from "@/modules/tools/competition/services/competitionService";
import ml from "@/modules/tools/competition/utils/mercadolibre";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  link: string;
  picture: string;
}

interface FilterState {
  query: string;
  include: string;
  exclude: string;
  include_list: string[];
  exclude_list: string[];
  check?: boolean;
}

interface StoredData extends FilterState {
  _id: string;
  check?: boolean;
}

const { Link } = Typography;

export default function FilterPage({
  params,
}: {
  params: Promise<{ sku: string; brand: string }>;
}) {
  const { sku, brand } = use(params);
  const [form] = Form.useForm();
  const [urlImage, setUrlImage] = useState<string>("");
  const loremImage = "https://picsum.photos/id";

  const { notification } = App.useApp();

  const hoverRow = (data: any) => {
    setUrlImage(`${loremImage}/${data.idImage}/400?random=1`);
  };

  useEffect(() => {
    getFilters();
  }, []);

  // **********************************
  const expandTildes = (expr: string): string => {
    const expand = (terms: string[]): string[][] => {
      if (terms.length === 1) return [terms];
      const first = terms.shift()!;
      const result: string[][] = [];
      for (const e of expand(terms)) {
        result.push([first, "-", ...e]);
        result.push([first, "\\s", ...e]);
        result.push([first, ...e]);
      }
      return result;
    };

    return expand(expr.split("~"))
      .map((e) => e.join(""))
      .join("|");
  };

  const buildRegExp = (expr: string): RegExp => {
    let processedExpr = expr.replace(/[.*+()]/g, "\\$&");
    processedExpr = processedExpr
      .split("|")
      .map((e) => expandTildes(e))
      .join("|");
    processedExpr = processedExpr
      .split("|")
      .map((e) => `(?<![^ ,("])${e}(?![^ ,)"])`)
      .join("|");
    return new RegExp(processedExpr, "i");
  };

  const [filterState, setFilterState] = useState<FilterState>({
    query: "",
    include: "",
    exclude: "",
    include_list: [],
    exclude_list: [],
    check: false,
  });

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [currentItem, setCurrentItem] = useState<ProductItem | null>(null);
  const [stored, setStored] = useState<StoredData | any>({
    _id: "",
    ...filterState,
  });
  const [loading, setLoading] = useState(false);

  const includeIds = useMemo(
    () => filterState.include_list.join("|"),
    [filterState.include_list]
  );

  const excludeIds = useMemo(
    () => filterState.exclude_list.join("|"),
    [filterState.exclude_list]
  );

  const customSearch = useMemo(() => {
    if (!filterState.include) return "";
    const first = filterState.include.split("|")[0];
    const model = first.replaceAll("~", "");
    return `${filterState.query} intitle:"${model}"`;
  }, [filterState.include, filterState.query]);

  const matches = useMemo(() => {
    return products.filter((item) => getItemClass(item) === "good").length;
  }, [products, filterState]);

  const getItemClass = useCallback(
    (item: ProductItem): "good" | "bad" | "none" => {
      if (filterState.exclude_list.includes(item?.id)) return "bad";
      if (filterState.include_list.includes(item?.id)) return "good";

      if (
        filterState.exclude &&
        item.title?.match(buildRegExp(filterState.exclude))
      )
        return "bad";
      if (
        filterState.include &&
        item.title?.match(buildRegExp(filterState.include))
      )
        return "good";

      return "none";
    },
    [filterState]
  );

  const highlightText = useCallback(
    (text: string): string => {
      if (!text) return "";
      let highlighted = text;

      if (filterState.include) {
        highlighted = highlighted.replace(
          buildRegExp(filterState.include),
          '<span style="background-color: hsl(120, 100%, 50%)">$&</span>'
        );
      }

      if (filterState.exclude) {
        highlighted = highlighted.replace(
          buildRegExp(filterState.exclude),
          '<span style="background-color: hsl(0, 100%, 50%)">$&</span>'
        );
      }

      return highlighted;
    },
    [filterState.include, filterState.exclude]
  );

  // API functions
  const search = async () => {
    if (!filterState.query) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: filterState.query,
        pages: "1",
        delay: "1",
      });

      const response = await fetch(`/api/searchFilter?${params}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setCurrentItem(data[0]);
      } else {
        setProducts([]);
        notification.open({
          type: "info",
          message: "No se encontraron productos",
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.open({
        type: "error",
        message: "Error al buscar productos",
      });
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const dataToSave = {
        ...stored,
        ...filterState,
        check: filterState.check
          ? new Date().toISOString().substring(0, 10)
          : stored.check,
      };

      const escId = encodeURIComponent(sku as string);
      await fetch(`/api/couch.php?url=/ml_competition/${escId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      setStored(dataToSave);
      notification.open({
        type: "success",
        message: "Datos guardados correctamente",
      });
    } catch (error) {
      console.error("Error saving:", error);
      notification.open({
        type: "error",
        message: "Error al guardar",
      });
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (!sku) return;

      try {
        // Get auth token
        const authResponse = await fetch("/api/token");
        const authData = await authResponse.json();

        // Load stored data
        const escId = encodeURIComponent(sku as string);
        const response = await fetch(
          `/api/couch.php?url=/ml_competition/${escId}`,
          {
            headers: { "cache-control": "no-cache" },
          }
        );
        const storedData = await response.json();

        if (!storedData.error) {
          setStored(storedData);
          setFilterState((prev) => ({ ...prev, ...storedData }));
        } else {
          setStored({ _id: sku as string, ...filterState });
        }

        // Set default values
        setFilterState((prev) => ({
          ...prev,
          query: prev.query || `${brand || ""} ${sku}`.trim(),
          include: prev.include || (sku as string).replaceAll("-", "~"),
        }));

        // Auto search
        setTimeout(search, 100);
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initializeData();
  }, [sku, brand]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!products.length) return;

      const currentIndex = currentItem
        ? products.findIndex((p) => p.id === currentItem.id)
        : 0;
      let newIndex = currentIndex;

      if (e.key === "j") {
        newIndex = Math.min(currentIndex + 1, products.length - 1);
      } else if (e.key === "k") {
        newIndex = Math.max(currentIndex - 1, 0);
      } else {
        return;
      }

      setCurrentItem(products[newIndex]);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [products, currentItem]);

  const getFilters = async () => {
    const auth_data = await authMLToken();
    ml.init((url: any, init: any) =>
      url.searchParams.set("access_token", auth_data.access_token)
    );

    const esc_id = encodeURIComponent(sku);

    //cambiar el fetch
    const data = await (
      await fetch(`/api/couch.php?url=/ml_competition/${esc_id}`, {
        headers: { "cache-control": "no-cache" },
      })
    ).json();

    if (!data.error) {
      setStored(data);
      //Object.assign(input, stored); //asignarlo a un input
    } else {
      //setStored({ _id: sku });
    }
  };

  const columnsFilter: DinamicColumnsType[] = [
    {
      column_id: "id",
      title: "ID",
      type: "string",
    },
    {
      column_id: "in",
      title: "IN",
      type: "custom",
      render: (value, record) => (
        <>
          <Checkbox
            checked={filterState.include_list.includes(record.id)}
            onChange={(e) => {
              const newList = e.target.checked
                ? [...filterState.include_list, record.id]
                : filterState.include_list.filter((id) => id !== record.id);
              setFilterState((prev) => ({ ...prev, include_list: newList }));
            }}
          />
        </>
      ),
    },
    {
      column_id: "ex",
      title: "EX",
      type: "custom",
      render: (value, record) => (
        <>
          <Checkbox
            checked={filterState.exclude_list.includes(record.id)}
            onChange={(e) => {
              const newList = e.target.checked
                ? [...filterState.exclude_list, record.id]
                : filterState.exclude_list.filter((id) => id !== record.id);
              setFilterState((prev) => ({ ...prev, exclude_list: newList }));
            }}
          />
        </>
      ),
    },
    {
      column_id: "price",
      title: "Precio",
      type: "price",
    },
    {
      column_id: "title",
      title: "Título",
      type: "custom",
      width: "50%",
      render: (value, record) => (
        <>
          <Link
            href={record.link}
            target="_blank"
            //dangerouslySetInnerHTML={{ __html: highlightText(value) }}
          />
        </>
      ),
    },
  ];

  const getRowClassName = (record: ProductItem) => {
    const itemClass = getItemClass(record);
    const isSelected = currentItem?.id === record?.id;

    let className = "";
    if (itemClass === "good") className += "ant-table-row-good ";
    if (itemClass === "bad") className += "ant-table-row-bad ";
    if (isSelected) className += "ant-table-row-selected ";

    return className.trim();
  };

  return (
    <Container>
      <Flex vertical gap={20}>
        <GlassCard>
          <Form layout="vertical" form={form}>
            <Row gutter={[20, 20]}>
              <Col xxl={4}>
                <Form.Item label="Búsqueda" style={{ fontWeight: "bold" }}>
                  <Input
                    value={filterState.query}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        query: e.target.value,
                      }))
                    }
                    onPressEnter={search}
                  />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item
                  label="Filtro incluir"
                  style={{ fontWeight: "bold" }}
                >
                  <Input
                    value={filterState.include}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        include: e.target.value,
                      }))
                    }
                  />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item
                  label="Filtro excluir"
                  style={{ fontWeight: "bold" }}
                >
                  <Input
                    value={filterState.exclude}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        exclude: e.target.value,
                      }))
                    }
                  />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="IDs incluir" style={{ fontWeight: "bold" }}>
                  <Input
                    value={includeIds}
                    onChange={(e) => {
                      const ids = e.target.value
                        ? e.target.value.split("|")
                        : [];
                      setFilterState((prev) => ({
                        ...prev,
                        include_list: ids,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="IDs excluir" style={{ fontWeight: "bold" }}>
                  <Input
                    value={excludeIds}
                    onChange={(e) => {
                      const ids = e.target.value
                        ? e.target.value.split("|")
                        : [];
                      setFilterState((prev) => ({
                        ...prev,
                        exclude_list: ids,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Revisado" style={{ fontWeight: "bold" }}>
                  <Checkbox
                    checked={filterState.check}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        check: e.target.checked,
                      }))
                    }
                  />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                  <LabelTitle>Búsqueda ML</LabelTitle>
                  <Link
                    href={`https://listado.mercadolibre.com.mx/${filterState.query}`}
                    target="_blank"
                  >
                    {filterState.query}
                  </Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                  <LabelTitle>Imagen Google</LabelTitle>
                  <Link
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
                      customSearch
                    )}`}
                    target="_blank"
                  >
                    {customSearch}
                  </Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                  <LabelTitle>Comparador</LabelTitle>
                  <Link href={`/item?id=${sku}`} target="_blank">
                    {sku}
                  </Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Matches" style={{ fontWeight: "bold" }}>
                  <Input value={matches} readOnly />
                </Form.Item>
              </Col>

              <Col xxl={4} style={{ alignContent: "end" }}>
                <Form.Item>
                  <Button type="primary" onClick={save}>
                    Guardar
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </GlassCard>

        <Row gutter={[20, 20]}>
          <Col xxl={18} xl={18}>
            <GlassCard>
              <DinamicTable
                columns={columnsFilter}
                dataSource={dataFiltros}
                rowActions={{ onRowHover: setCurrentItem }}
                rowStyle
                getRowClass={getRowClassName}
              />
            </GlassCard>
          </Col>

          {currentItem && (
            <Col xxl={6} xl={6}>
              <GlassCard>
                <Image
                  src={`http://mlm-s2-p.mlstatic.com/${currentItem.picture}-O.jpg`}
                  fallback="/Logo.jpg"
                />
              </GlassCard>
            </Col>
          )}
        </Row>
      </Flex>
    </Container>
  );
}
