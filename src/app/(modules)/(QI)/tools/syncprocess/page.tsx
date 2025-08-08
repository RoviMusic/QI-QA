import Container from "@/components/layout/Container";
import Processor from "@/modules/tools/process/components/processor";
import {
  GetAllAmazonData,
  GetAllMeliData,
  GetErrorAmazon,
  GetErrorsMeli,
  GetPendingAmazon,
  GetPendingMeli,
  GetProcesserMeli,
} from "@/modules/tools/process/services/processorService";
import Sync from "@/modules/tools/sync/components/sync";
import { Flex } from "antd";

export default async function SyncProcessPage() {
  const meliData = await GetAllMeliData();
  const amazonData = await GetAllAmazonData();

  const allData = [...meliData, ...amazonData]
    .filter(item => !item.shipment_reference?.startsWith('NE-'))
    .sort(
      (a, b) =>
        new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
    );

  return (
    <>
      <Container>
        <Flex vertical gap={50}>
          <Processor data={allData} />
        </Flex>
      </Container>
    </>
  );
}
