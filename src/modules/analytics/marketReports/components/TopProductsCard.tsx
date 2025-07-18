import { MutedSubtitle } from "@/components/core/Titulo";
import { Card } from "antd";
import { useTranslations } from "next-intl";

export default function TopProductsCard(){
    const t = useTranslations("Analytics.marketReports");
    return(
        <>
        <Card variant="outlined">
            <MutedSubtitle>{t('topProducts')}</MutedSubtitle>
        </Card>
        </>
    )
}