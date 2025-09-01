'use client'
import { Layout } from "antd";
import DBProcessor from "../../../../../modules/developer/catalogProcessor/components/DBProcessor";
const { Content } = Layout;

export default function CatalogProcessorPage() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="m-7">
        <DBProcessor />
      </Content>
    </Layout>
  );
}
