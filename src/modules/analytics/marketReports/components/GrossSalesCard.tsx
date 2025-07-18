import { MutedSubtitle } from "@/components/core/Titulo";
import { Card, Flex } from "antd";
import { useTranslations } from "next-intl";

export default function GrossSalesCard() {
  const t = useTranslations("Analytics.marketReports");
  return (
    <>
      <Card variant="outlined">
        <Flex gap={30} vertical>
          <MutedSubtitle>{t("grossSales")}</MutedSubtitle>

          
        </Flex>
      </Card>
    </>
  );
}
