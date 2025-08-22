"use client";
import { GlassCard } from "@/components/core/GlassCard";
import { DinamicTable } from "@/components/core/Tables";
import { LabelTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import {
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
import { use, useEffect, useState } from "react";
import { dataFiltros } from "../../dataDummy";
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
        <Checkbox checked={value} />
      </>
    ),
  },
  {
    column_id: "ex",
    title: "EX",
    type: "custom",
    render: () => (
      <>
        <Checkbox />
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
    type: "string",
    width: "50%",
  },
];

export default function FilterPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = use(params);
  const [form] = Form.useForm();
  const [urlImage, setUrlImage] = useState<string>("");
  const loremImage = "https://picsum.photos/id";

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
  const [stored, setStored] = useState<StoredData>({ _id: "", ...filterState });
  const [loading, setLoading] = useState(false);

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

  return (
    <Container>
      <Flex vertical gap={20}>
        <GlassCard>
          <Form layout="vertical" form={form}>
            <Row gutter={[20, 20]}>
              <Col xxl={4}>
                <Form.Item label="Búsqueda" style={{ fontWeight: "bold" }}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item
                  label="Filtro incluir"
                  style={{ fontWeight: "bold" }}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item
                  label="Filtro excluir"
                  style={{ fontWeight: "bold" }}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="IDs incluir" style={{ fontWeight: "bold" }}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="IDs excluir" style={{ fontWeight: "bold" }}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Revisado" style={{ fontWeight: "bold" }}>
                  <Checkbox />
                </Form.Item>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                  <LabelTitle>Búsqueda ML</LabelTitle>
                  <Link>something</Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                  <LabelTitle>Imagen Google</LabelTitle>
                  <Link>something</Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Space direction="vertical">
                  <LabelTitle>Comparador</LabelTitle>
                  <Link>something</Link>
                </Space>
              </Col>

              <Col xxl={4}>
                <Form.Item label="Matches" style={{ fontWeight: "bold" }}>
                  <InputNumber controls={false} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xxl={4} style={{ alignContent: "end" }}>
                <Form.Item>
                  <Button type="primary">Guardar</Button>
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
                rowActions={{ onRowHover: hoverRow }}
              />
            </GlassCard>
          </Col>

          <Col xxl={6} xl={6}>
            <GlassCard>
              <Image src={urlImage} fallback="/Logo.jpg" />
            </GlassCard>
          </Col>
        </Row>
      </Flex>
    </Container>
  );
}
