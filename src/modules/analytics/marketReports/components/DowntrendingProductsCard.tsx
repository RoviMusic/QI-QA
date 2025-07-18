import { MutedSubtitle } from "@/components/core/Titulo";
import { Card } from "antd";
import { useTranslations } from "next-intl";

export default function DowntrendingProductsCard(){
    const t = useTranslations("Analytics.marketReports");
    return(
        <>
        <Card variant="outlined">
            <MutedSubtitle>{t('downtrendingProducts')}</MutedSubtitle>
        </Card>
        </>
    )
}