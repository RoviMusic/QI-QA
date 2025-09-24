import Container from "@/components/layout/Container";
import ShipmentReview from "@/modules/marketplaces/components/shipmentReview";
import { GetProcesserMeli } from "@/modules/tools/process/services/processorService";

export default async function ShipmentReviewPage() {
  const getData = await GetProcesserMeli();

  const filteredData = [...getData]
    .filter((item) => item.shipment_type != "fulfillment")
    .filter((item) => !item.shipment_reference?.startsWith("NE-"));
  //.filter((item) => item.picking_ids == null);

  //const updateMongo = await UpdatedMongo(filteredData);

  return (
    <>
      <Container>
        <ShipmentReview shipmentData={filteredData} />
      </Container>
    </>
  );
}
