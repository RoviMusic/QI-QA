import { GetAllProcessorData } from "@/modules/tools/process/services/processorService";
import { ProcessorMongoType } from "@/modules/tools/process/types/processorTypes";
import { sendEmailsAlerts } from "../../shared/services/sendEmailAlerts";
import cron, { ScheduledTask } from "node-cron";

class ProcessorMonitor {
  private static instance: ProcessorMonitor;
  private cronJob: ScheduledTask | null = null;
  private lastActivityCheck: Date | null = null;

  private constructor() {}

  static getInstance(): ProcessorMonitor {
    if (!ProcessorMonitor.instance) {
      ProcessorMonitor.instance = new ProcessorMonitor();
    }
    return ProcessorMonitor.instance;
  }

  start() {
    if (this.cronJob) {
      console.log("Cron job del procesador ya está ejecutándose");
      return;
    }

    // Ejecutar cada hora (0 minutos de cada hora)
    this.cronJob = cron.schedule(
      "0 * * * *",
      async () => {
        await this.checkProcessorActivity();
      },
      {
        timezone: "America/Mexico_City", // ajusta según tu zona horaria
      }
    );

    console.log(
      "✅ Cron job de monitoreo del procesador iniciado - se ejecutará cada hora"
    );

    // Ejecutar inmediatamente al iniciar
    this.checkProcessorActivity();
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log("❌ Cron job de monitoreo procesador detenido");
    }
  }

  private async checkProcessorActivity() {
    try {
      console.log(`🔍 Verificando actividad del procesador - ${new Date()}`);
      const allData: ProcessorMongoType[] = await GetAllProcessorData();
      const now = new Date();

      const lastDate = new Date(allData[0].sale_date);

      const diffMs = now.getTime() - lastDate.getTime();
      const diffMin = Math.floor(diffMs / 1000 / 60);

      if (diffMin > 70) {
        await this.sendAlert({
          message: `El procesador no ha tenido actividad en ${diffMin} minutos. Última actividad: ${lastDate}`,
          level: "CRITICAL",
          where: "Procesador",
        });
      }

      const recentData = allData.filter((item: any) => {
        const itemDate = new Date(item.sale_date);
        const diffInMinutes =
          (now.getTime() - itemDate.getTime()) / (1000 * 60);
        return diffInMinutes <= 60; // Filtrar los datos de los últimos 60 minutos
      });

      let totalErrors = 0;

      recentData.map((item) => {
        if (item.type == "errors") ++totalErrors;
      });

      const getErrorPercentage = (totalErrors * 100) / recentData.length;
      console.log("percentage ", getErrorPercentage);

      if (getErrorPercentage >= 10 && getErrorPercentage < 30) {
        await this.sendAlert({
          message: `El procesador tiene un ${getErrorPercentage.toFixed(
            2
          )}% de errores.`,
          level: "WARNING",
          where: "Procesador",
        });
      } else if (getErrorPercentage >= 30 && getErrorPercentage < 50) {
        await this.sendAlert({
          message: `El procesador tiene un ${getErrorPercentage.toFixed(
            2
          )}% de errores.`,
          level: "ERROR",
          where: "Procesador",
        });
      } else if (getErrorPercentage >= 50) {
        await this.sendAlert({
          message: `El procesador tiene un ${getErrorPercentage.toFixed(
            2
          )}% de errores.`,
          level: "CRITICAL",
          where: "Procesador",
        });
      }

      const pendingData = recentData.filter((item) => item.type == "pending");

      for (const item of pendingData) {
        const itemDate = new Date(item.sale_date);
        const diffInMinutes =
          (now.getTime() - itemDate.getTime()) / (1000 * 60);
        if (diffInMinutes >= 10) {
          console.log("han pasado mas de 10 min en este item ", item.sale_id);
          await this.sendAlert({
            message: `Han pasado más de 10min intentando procesar la orden ${item.sale_id}.`,
            level: "ERROR",
            where: "Procesador",
          });

          break;
        }
      }

      this.lastActivityCheck = new Date();
    } catch (error: any) {
      console.error("❌ Error al verificar actividad del procesador:", error);
      await this.sendAlert({
        message: `Error al verificar el estado del procesador: ${error.message}`,
        level: "ERROR",
        where: "Procesador",
      });
    }
  }

  private async sendAlert(payload: {
    message: string;
    level: "CRITICAL" | "WARNING" | "ERROR";
    where: "Procesador" | "Sync";
  }) {
    try {
      const r = await sendEmailsAlerts(payload);
      return r;
    } catch (error) {
      console.error("❌ Error al enviar alerta por email:", error);
    }
  }

  private getNextHourExecution(): Date {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);
    return nextHour;
  }

  getStatus() {
    return {
      isRunning: !!this.cronJob,
      lastCheck: this.lastActivityCheck,
      nextExecution: this.cronJob ? this.getNextHourExecution() : null,
    };
  }
}

export const processorMonitor = ProcessorMonitor.getInstance();
