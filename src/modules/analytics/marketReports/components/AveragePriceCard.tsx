import { MutedSubtitle } from "@/components/core/Titulo";
import { Card } from "antd";
import { useTranslations } from "next-intl";

export default function AveragePriceCard(){
    const t = useTranslations("Analytics.marketReports");
    return(
        <>
        <Card variant="outlined">
            <MutedSubtitle>{t('averagePrice')}</MutedSubtitle>
        </Card>
        </>
    )
}