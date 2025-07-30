"use client";
import { Progress, Spin, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { competenciaService } from "../services/competitionService";
import type { TableColumnsType } from "antd";
import { MainTableType } from "../types/competitionType";
import ml from "../utils/mercadolibre";
import { formattedPriceNormalized } from "@/lib/formattedPrice";
import DetailTable from "./DetailTable";

export default function MainTable() {
  const [loading, setLoading] = useState(false);
  const [dataProduct, setDataProduct] = useState<any>([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    //getMainData();
    //getMainDataWithStreaming();
  }, []);

    async function getMainData() {
      setLoading(true);
      try {
        var hash: any = {};
        var stored;
        var products: any = { list: [] };
        const auth_data = await competenciaService.authMLToken();
        ml.init((url: any, init: any) =>
          url.searchParams.set("access_token", auth_data.access_token)
        );
        const data = await competenciaService.couchData();

        stored = Object.fromEntries(data.rows.map((e: any) => [e.id, e.doc]));

        const params = { status: "active,paused", orders: "sold_quantity_desc" };

        const mlAny = ml as any;
        console.warn("Empieza carga de productos...");
        for await (const e of mlAny.publications.user_search(params)) {
          e.group_nick = mlAny.publications.group_names[e.group];
          e.competition_price = 0;
          console.log("producto? ", e);
          if (!(e.sku in hash)) {
            const obj = {
              id: e.sku,
              brand: e.brand,
              title: e.title,
              sold: e.sold,
              status: e.status,
              publications: [e],
              check: "",
              competition: [{}]
            };
            const info = stored[obj.id];
            obj.check = info?.check ? "ok" : "bad";
            hash[obj.id] = obj;
            const infoComp = await getPriceCompetition(e.title)
            obj.competition = infoComp ?? [{}];
            products.list.push(obj);
          } else {
            const obj = hash[e.sku];
            obj.sold += e.sold;
            obj.publications.push(e);
          }
        }
        setDataProduct(products.list);
        console.warn("Termina carga de productos...");
        console.log("datos cargados ", products.list);
      } catch (error) {
        console.error("Error ", error);
        setDataProduct([]);
      } finally {
        setLoading(false);
      }
    }

    async function getPriceCompetition(element: any) {
      const map = (e: any) => {
        return {
          id: e.id,
          title: e.title,
          price: e.price,
          link: e.link,
          picture: e.picture,
        };
      };

      const params = {
        query: element,
        pages: "1",
        delay: "1",
      };
      const queryParams = new URLSearchParams(params).toString();

      try {
        // Llamada a la API (ruta relativa al mismo origen)
        const resp = await fetch(`http://187.189.243.250:3500/searchFilter?${queryParams}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.log('llamada competition ', resp);
        if (!resp.ok) {
          console.error("API error:", resp.status, resp.statusText);
          return [];
        }

        // Extraemos el JSON (un array de productos)
        const data = await resp.json();
        console.log(data);

        // Si no hay resultados, nos salimos
        if (!Array.isArray(data) || data.length === 0) {
          console.log("No hay productos para mostrar");
          return [];
        }

        let mapeo = data.map(map);
        console.log('mapeo ', mapeo)
        return mapeo

      } catch (error) {
        console.error("idk man ", error);
      }
    }

  async function getMainDataWithStreaming() {
    setLoading(true);
    setDataProduct([]);

    try {
      const hash: any = {};
      const products: any = { list: [] };
      //consulta de token
      const auth_data = await competenciaService.authMLToken();
      ml.init((url: any, init: any) =>
        url.searchParams.set("access_token", auth_data.access_token)
      );

      const data = await competenciaService.couchData();
      setTotalRegistros(data.rows.length);

      const stored = Object.fromEntries(
        data.rows.map((e: any) => [e.id, e.doc])
      );

      console.log("total ", data.rows.length);

      const params = { status: "active", orders: "sold_quantity_desc" };
      const mlAny = ml as any;

      console.warn("Empieza carga de productos...");
      setLoading(false);
      for await (const e of mlAny.publications.user_search(params)) {
        e.group_nick = mlAny.publications.group_names[e.group];
        e.competition_price = 0;
        //console.log("producto ", e);
        if (!(e.sku in hash)) {
          const obj = {
            id: e.sku,
            brand: e.brand,
            title: e.title,
            sold: e.sold,
            status: e.status,
            publications: [e],
            check: stored[e.id]?.check ? "ok" : "bad",
            price: e.price,
            competition: [{}],
            competitionLoading: true,
          };
          //   const info = stored[obj.id];
          //   obj.check = info?.check ? "ok" : "bad";
          hash[obj.id] = obj;
          //const infoComp = await getPriceCompetition(e.title);
          //obj.competition = infoComp ?? [{}];
          products.list.push(obj);
          setDataProduct([...products.list]);
          getPercent(products.list.length, data.rows.length);
        } else {
          const obj = hash[e.sku];
          obj.sold += e.sold;
          obj.publications.push(e);
        }
      }
      console.log("carga de productos principal ", products.list);
      //setDataProduct([...products.list]);

      //await processCompetitionStreaming(products.list);
    } catch (error) {
      console.error(error);
      setDataProduct([]);
    } finally {
      setLoading(false);
    }
  }

  function getPercent(cargado: number, total: number) {
    let percent = (cargado * 100) / total;
    console.log("percent ", total);
    setPercent(percent);
  }

  // 3. SEMÁFORO PARA CONTROLAR CONCURRENCIA
  class Semaphore {
    private capacity: number;
    private running: number;
    private queue: (() => void)[];

    constructor(capacity: any) {
      this.capacity = capacity;
      this.running = 0;
      this.queue = [];
    }

    async acquire(): Promise<void> {
      return new Promise((resolve) => {
        if (this.running < this.capacity) {
          this.running++;
          resolve();
        } else {
          this.queue.push(resolve);
        }
      });
    }

    release(): void {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) {
          this.running++;
          next();
        }
      }
    }
  }

  async function processCompetitionStreaming(productsList: any) {
    const CONCURRENT_REQUESTS = 10;
    const semaphore = new Semaphore(CONCURRENT_REQUESTS);

    const promises = productsList.map(async (product: any, index: any) => {
      await semaphore.acquire();
      try {
        const competition = await getPriceCompetitionOptimized(product.title);
        console.warn("antes de actualizar competition ", competition);
        // Actualizar el producto específico
        productsList[index].competition = competition || [{}];
        productsList[index].competitionLoading = false;

        // Trigger re-render con datos actualizados
        setDataProduct([...productsList]);
      } catch (error) {
        console.error(`Error procesando ${product.title}:`, error);
        productsList[index].competition = [{}];
        productsList[index].competitionLoading = false;
        setDataProduct([...productsList]);
      } finally {
        semaphore.release();
      }
    });

    await Promise.all(promises);
  }

  const competitionCache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  async function getPriceCompetitionOptimized(element: any) {
    // Check cache first
    const cacheKey = element.toLowerCase().trim();
    const cached = competitionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const params = {
      query: element,
      pages: "1",
      delay: "1",
    };
    const queryParams = new URLSearchParams(params).toString();

    try {
      const resp = await fetchWithRetry(
        `http://187.189.243.250:3500/searchFilter?${queryParams}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          timeout: 10000, // 10 segundos timeout
        },
        3 // 3 intentos
      );

      if (resp == undefined) return [];

      if (!resp.ok) {
        console.error("API error:", resp.status, resp.statusText);
        return [];
      }

      const data = await resp.json();

      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      const result = data.map((e) => ({
        id: e.id,
        title: e.title,
        price: e.price,
        link: e.link,
        picture: e.picture,
      }));

      console.log("resultado de api search ", result);

      // Cache result
      competitionCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error(`Error fetching competition for "${element}":`, error);
      return [];
    }
  }

  async function fetchWithRetry(url: any, options: any, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          options.timeout || 10000
        );

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        if (i === maxRetries - 1) throw error;

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  const columns: TableColumnsType<MainTableType> = [
    {
      title: "SKU",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Marca",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Precio Rovi",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => <span>{formattedPriceNormalized(price)}</span>
    },
    {
      title: "Ventas",
      dataIndex: "sold",
      key: "sold",
      align: "center"
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        return(
          <Tag color={status === 'active' ? "green" : "red"}>{status}</Tag>
        )
      }
    },
  ];



  return (
    <>
      <Progress
        percent={percent}
        format={(percent) => `${percent?.toFixed(0)} %`}
        strokeColor={"#FFC709"}
        success={{strokeColor: "green"}}
      />
      <Spin spinning={loading}>
        <Table columns={columns} bordered dataSource={dataProduct} expandable={{
          expandedRowRender: (record) => <DetailTable />,
          columnWidth: 50
        }}/>
      </Spin>
    </>
  );
}
