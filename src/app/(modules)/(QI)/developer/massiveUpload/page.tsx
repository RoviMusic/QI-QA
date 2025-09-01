'use client'
import { Layout } from "antd";
import MassiveUploader from "@/modules/developer/massiveUpload/components/massiveUploader";
const { Content } = Layout;

export default function MassiveUploadPage() {
  return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content className="m-7">
          <MassiveUploader />
        </Content>
      </Layout>
    );
}
