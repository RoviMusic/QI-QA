"use client";
import { CircleButton } from "@/components/core/Buttons";
import { GlassCard } from "@/components/core/GlassCard";
import LoadingAnimation from "@/components/core/LoadingAnimation";
import { DinamicTable } from "@/components/core/Tables";
import { MainTitle, TableText } from "@/components/core/Titulo";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { App, Flex, Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fullfilmentService } from "../services/fullfilmentService";
import { FullfilmentData } from "../types/fullfilmentType";

interface FullfilmentProps {
  data: FullfilmentData[];
}

export default function FullfilmentList({ data }: FullfilmentProps) {
  const router = useRouter();
  //const [columns, setColumns] = useState<DinamicColumnsType[]>([]);
  //const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { notification } = App.useApp();

  useEffect(() => {
    //setLoading(true);
    // fullfilmentService
    //   .getFulfillmentData()
    //   .then(async (data) => {
    //     console.warn("Fullfilment data fetched:", data);
    //     setColumns(data.columns);
    //     setData(data.data);
    //     //setLoading(false);
    //     getDataProcessed(data.data, data.authToken);
    //     //getDataProcessedInParallelBatches(data.data, data.authToken);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching fullfilment data:", error);
    //     setLoading(false);
    //     notification.open({
    //       type: "error",
    //       message: "Hubo un error",
    //       description: `No se pudo obtener la información de fullfilment: ${error.message}`,
    //     });
    //   });
    //fetchData();
  });

  async function fetchData() {
    setLoading(true);
    const timeStart = Date.now();
    try {
      // const extradata = await fetch("http://192.168.0.234:8000/fulfillment", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Access-Control-Allow-Origin": "*",
      //   },
      // });
      // const extraData = await extradata.json();
      const extraData = await fullfilmentService.getFulfillmentAllTogether();
      console.log("Fullfilment data fetched:", extraData);
      //setColumns(extraData.columns ?? []);
      //setData(extraData.data ?? []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      notification.open({
        type: "error",
        message: "Error al obtener los datos",
        description: `No se pudo obtener la información de fullfilment: ${err}`,
      });
      //setColumns([]);
      //setData([]);
      setLoading(false);
      return;
    }

    const timeEnd = Date.now();
    const totalTime = (timeEnd - timeStart) / 1000; // Convertir a segundos
    console.log(`Total processing time: ${totalTime} seconds`);
    setLoading(false);
  }

  async function getDataProcessed(datos: any, authToken: string) {
    const timeStart = Date.now();
    try {
      let j = 0;
      for (let i = 0; i < datos.length; i++) {
        console.log(`Processing item ${i + 1} of ${datos.length}`);
        const item = datos[i];
        try {
          // const extraData = await fullfilmentService.processFulfillmentItem(
          //   item.inventory_id,
          //   authToken
          // );
          const extradata = await fetch(
            "http://192.168.0.234:8000/fulfillment?inventory_id=" +
              item.inventory_id +
              "&authToken=" +
              authToken,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ inventory_id: item.inventory_id }),
            }
          );
          const extraData = await extradata.json();
          // Actualizar solo el item específico que acabamos de procesar
          // setData((prevData) =>
          //   prevData.map((dataItem, index) =>
          //     dataItem.inventory_id === extraData.data.inventory_id
          //       ? {
          //           ...dataItem,
          //           ...(typeof extraData === "object" && extraData !== null
          //             ? extraData.data
          //             : {}),
          //         }
          //       : dataItem
          //   )
          // );
        } catch (itemError) {
          console.error(`Error processing item ${i}:`, itemError);
        }
        j++;
        console.log(`Processed ${j} items so far`);
      }
      const timeEnd = Date.now();
      const totalTime = (timeEnd - timeStart) / 1000; // Convertir a segundos
      console.log(`Total processing time: ${totalTime} seconds`);
      console.warn("All items processed successfully");
      console.log("datos procesados en total:", j);
    } catch (error) {
      console.error("Error processing data:", error);
      notification.open({
        type: "error",
        message: "Error al procesar los datos",
        description: `No se pudo procesar la información: ${error}`,
      });
    }
  }

  async function getDataProcessedInParallelBatches(
    datos: any,
    authToken: string,
    batchSize = 100
  ) {
    try {
      if (Array.isArray(datos) || datos.length > 0) {
        let totalTime = 0;
        for (let i = 0; i < datos.length; i += batchSize) {
          const batch = datos.slice(i, i + batchSize);
          console.log(
            `Processing batch from index ${i} to ${i + batch.length - 1}`
          );

          // Procesar todos los items del lote en paralelo
          const batchPromises = batch.map(
            async (item: any, batchIndex: any) => {
              try {
                const extradata = await fetch(
                  "http://192.168.0.234:8000/fulfillment?inventory_id=" +
                    item.inventory_id +
                    "&authToken=" +
                    authToken,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ inventory_id: item.inventory_id }),
                  }
                );
                const extraData = await extradata.json();
                // const extraData =
                //   await fullfilmentService.processFulfillmentItem(
                //     item.inventory_id,
                //     authToken
                //   );

                const actualIndex = i + batchIndex;
                totalTime += extraData.data.delayTime; // Sumar el tiempo de procesamiento

                // setData((prevData) =>
                //   prevData.map((dataItem, index) =>
                //     index === actualIndex
                //       ? {
                //           ...dataItem,
                //           ...(typeof extraData.data === "object" &&
                //           extraData.data !== null
                //             ? extraData.data
                //             : {}),
                //           //extraData: result.extraData,
                //           //isProcessed: true,
                //         }
                //       : dataItem
                //   )
                // );

                console.log(`----> extraData:${actualIndex}`, extraData);

                return { actualIndex, extraData, success: true };
              } catch (error) {
                console.error(
                  `Error processing item at index ${i + batchIndex}:`,
                  error
                );
                return { actualIndex: i + batchIndex, error, success: false };
              }
            }
          );

          // Esperar a que termine todo el lote
          const batchResults = await Promise.all(batchPromises);

          // Actualizar los datos uno por uno para el efecto visual
          // for (const result of batchResults) {
          //   if (result.success) {
          //     setData((prevData) =>
          //       prevData.map((dataItem, index) =>
          //         index === result.actualIndex
          //           ? {
          //               ...dataItem,
          //               ...(typeof result.extraData === "object" &&
          //               result.extraData !== null
          //                 ? result.extraData
          //                 : {}),
          //               //extraData: result.extraData,
          //               //isProcessed: true,
          //             }
          //           : dataItem
          //       )
          //     );
          //   } else {
          //     setData((prevData) =>
          //       prevData.map((dataItem, index) =>
          //         index === result.actualIndex
          //           ? {
          //               ...dataItem,
          //               ...(typeof result.extraData === "object" &&
          //               result.extraData !== null
          //                 ? result.extraData
          //                 : {}),
          //               //extraData: result.extraData,
          //               //isProcessed: true,
          //             }
          //           : dataItem
          //       )
          //     );
          //   }

          //   // Delay opcional para efecto visual
          //   //await new Promise((resolve) => setTimeout(resolve, 10));
          // }

          console.log(
            `******Lote ${Math.floor(i / batchSize) + 1} procesado*******: ${
              i + batch.length
            }/${datos.length} items`
          );
          console.log(`Total processing time for this batch: ${totalTime}s`);
        }
      } else {
        console.warn("No data to process or data is not an array");
        notification.open({
          type: "error",
          message: "Error al procesar los datos",
          description: `No hay datos para procesar o los datos no son un arreglo.`,
        });
      }
    } catch (error) {
      console.error("Error processing data:", error);
      notification.open({
        type: "error",
        message: "Error al procesar los datos",
        description: `No se pudo procesar la información: ${error}`,
      });
    }
  }

  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return data; // Return original data if search term is empty
    }

    const searchValue = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue)
      )
    );
  }, [data, searchTerm]);

  const columns: DinamicColumnsType[] = [
    {
      column_id: "inventory",
      title: "ID",
      type: "int",
      width: "10%",
    },
    {
      column_id: "item",
      title: "Pub",
      type: "string",
    },
    {
      column_id: "ref",
      title: "SKU",
      type: "string",
    },
    {
      column_id: "marca",
      title: "Marca",
      type: "string",
      width: "10%",
    },

    {
      column_id: "v30",
      title: "Ventas (30d)",
      type: "int",
      width: "5%",
    },
    {
      column_id: "min",
      title: "Min",
      type: "int",
      width: "5%",
    },
    {
      column_id: "max",
      title: "Max",
      type: "int",
      width: "5%",
    },

    {
      column_id: "stock",
      title: "Stock ML",
      type: "int",
      width: "5%",
    },
    {
      column_id: "cedis",
      title: "Stock C",
      type: "int",
      width: "5%",
    },
    {
      column_id: "transito",
      title: "Stock T",
      type: "int",
      width: "5%",
    },
    {
      column_id: "sugerido",
      title: "Abastecer",
      type: "int",
      width: "10%",
    },
    {
      column_id: "final",
      title: "Final",
      type: "custom",
      align: "center",
      width: "5%",
      render: (value, record) => {
        return <TableText>{record.stock + record.transito}</TableText>;
      },
    },
    {
      column_id: "sold_quantity",
      title: "Ventas",
      type: "int",
      width: "5%",
    },
  ];

  return (
    <>
      <LoadingAnimation isActive={loading}>
        <Flex vertical gap={20}>
          <Flex justify="space-between" align="center">
            <MainTitle>Fullfilment</MainTitle>

            <CircleButton
              onPress={() => router.push("/tools/fullfilment/settings")}
              icon="Gear"
              tooltip="Configuración"
            />
          </Flex>
          <GlassCard>
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ marginBottom: 20, width: "50%" }}
            />
            <DinamicTable columns={columns} dataSource={filteredData} />
          </GlassCard>
        </Flex>
      </LoadingAnimation>
    </>
  );
}
