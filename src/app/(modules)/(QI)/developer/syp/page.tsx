import AutoRefresher from "@/components/Autorefresher";
import Container from "@/components/layout/Container";
import ProcessorDev from "@/modules/tools/process/components/processorDev";
import {
  GetErrorsMeli,
  GetPendingMeli,
  GetProcesserMeli,
} from "@/modules/tools/process/services/processorService";
import Sync from "@/modules/tools/sync/components/sync";
import {
  GetCicleError,
  GetSync48hErrors,
  GetSyncSummary,
} from "@/modules/tools/sync/services/syncService";
import { Flex } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function DevSipPage() {
  const syncErrors = await GetSync48hErrors();
  const syncSummary = await GetSyncSummary();
  const cicleErrors = await GetCicleError(
    syncSummary[0].start_time,
    syncSummary[0].end_time
  );

  const processorData = await GetProcesserMeli();
  const errorsMeliData = await GetErrorsMeli();
  const pendingMeliData = await GetPendingMeli();

  const addMarket = (items: any[] | undefined, market: string) =>
    (items || []).map((item) => ({ ...item, market }));

  const processedData = [...addMarket(processorData, "Mercado Libre")];
  const errorsData = [...addMarket(errorsMeliData, "Mercado Libre")];
  const pendingData = [...addMarket(pendingMeliData, "Mercado Libre")];

  return (
    <>
      <AutoRefresher intervalMinutes={15} />
      <Container>
        <p>
          Última actualización de página:{" "}
          {dayjs
            .utc()
            .tz("America/Mexico_City")
            .format("DD/MM/YYYY [a las] HH:mm:ss a")}
        </p>
        <Flex vertical gap={50}>
          <Sync
            syncTotalErrors={syncErrors}
            syncSummary={syncSummary[0]}
            syncCicleErrors={cicleErrors}
          />
          <ProcessorDev
            processedData={processedData}
            errorsData={errorsData}
            pendingData={pendingData}
          />
        </Flex>
      </Container>
    </>
  );
}
