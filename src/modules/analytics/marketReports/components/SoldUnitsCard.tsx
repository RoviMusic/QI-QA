import { MutedSubtitle } from "@/components/core/Titulo";
import { Card } from "antd";
import { useTranslations } from "next-intl";

export default function SoldUnitsCard(){
    const t = useTranslations("Analytics.marketReports");
    return(
        <>
        <Card variant="outlined">
            <MutedSubtitle>{t('soldUnits')}</MutedSubtitle>
        </Card>
        </>
    )
}