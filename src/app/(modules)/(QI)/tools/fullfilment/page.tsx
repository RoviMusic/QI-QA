import Container from "@/components/layout/Container";
import FullfilmentList from "@/modules/tools/fullfilment/components/fulfillmentList";
import { fullfilmentService } from "@/modules/tools/fullfilment/services/fullfilmentService";

export default async function FullfilmentPage() {
  const fullfil = await fullfilmentService.getFullfilmentV2();

  return (
    <>
      <Container>
        <FullfilmentList data={fullfil} />
      </Container>
    </>
  );
}
