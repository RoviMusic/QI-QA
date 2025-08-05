import Container from "@/components/layout/Container";
import ProcessorDev from "@/modules/tools/process/components/processorDev";
import Sync from "@/modules/tools/sync/components/sync";
import { GetSyncErrors, GetSyncSummary } from "@/modules/tools/sync/services/syncService";
import { Flex } from "antd";

export default async function DevSipPage() {
  const syncErrors = await GetSyncErrors();
  const syncSummary = await GetSyncSummary();
  

  const filteredSyncErrors = syncErrors.filter((error: any) =>
    syncSummary.some((summary: any) =>
      error.timestamp >= summary.start_time && error.timestamp <= summary.end_time
    )
  );

  console.log('sync e ', filteredSyncErrors)

  return (
    <>
      <Container>
        <Flex vertical gap={50}>
          <Sync syncErrors={filteredSyncErrors} syncSummary={syncSummary}/>
          <ProcessorDev />
        </Flex>
      </Container>
    </>
  );
}
