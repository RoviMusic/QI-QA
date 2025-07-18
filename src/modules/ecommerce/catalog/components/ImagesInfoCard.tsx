import GlassCard from "@/components/core/GlassCard";
import { Subtitle } from "@/components/core/Titulo";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Flex, Form, Input, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useTranslations } from "next-intl";
const { Dragger } = Upload;

export default function ImagesInfoCard() {
  const t = useTranslations("Ecommerce.catalog.product.images");
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      <Form layout="vertical">
        <GlassCard>
          <Flex vertical gap={10}>
            <Subtitle>{t('title')}</Subtitle>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <FontAwesomeIcon icon={faUpload} size="2xl" color="#FEB81C" />
              </p>
              <p className="ant-upload-text">
                {t('titleDrag')}
              </p>
            </Dragger>
            <Divider>{t('divider')}</Divider>
            <Form.Item label={t('addUrl')}>
              <Input />
            </Form.Item>
          </Flex>
        </GlassCard>
      </Form>
    </>
  );
}
