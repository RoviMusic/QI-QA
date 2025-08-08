import Container from "@/components/layout/Container";
import Processor from "@/modules/tools/process/components/processor";
import {
  GetAllAmazonData,
  GetAllMeliData,
} from "@/modules/tools/process/services/processorService";
import Sync from "@/modules/tools/sync/components/sync";
import {
  GetCicleError,
  GetSync48hErrors,
  GetSyncSummary,
} from "@/modules/tools/sync/services/syncService";
import { Flex } from "antd";

export default async function SyncProcessPage() {
  const meliData = await GetAllMeliData();
  const amazonData = await GetAllAmazonData();

  const allData = [...meliData, ...amazonData]
    .filter((item) => !item.shipment_reference?.startsWith("NE-"))
    .sort(
      (a, b) =>
        new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
    );

  const syncErrors = await GetSync48hErrors();
  const syncSummary = await GetSyncSummary();
  const cicleErrors = await GetCicleError(
    syncSummary[0].timestamp,
    syncSummary[0].end_time
  );

  return (
    <>
      <Container>
        <Flex vertical gap={50}>
          <Sync
            syncTotalErrors={syncErrors}
            syncSummary={syncSummary[0]}
            syncCicleErrors={cicleErrors}
          />
          <Processor data={allData} />
        </Flex>
      </Container>
    </>
  );
}
