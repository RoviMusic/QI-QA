import { GetSyncActivity } from "@/modules/tools/sync/services/syncService";
import { sendEmailsAlerts } from "../../shared/services/sendEmailAlerts";
import cron, { ScheduledTask } from "node-cron";

class SyncMonitor {
  private static instance: SyncMonitor;
  private cronJob: ScheduledTask | null = null;
  private lastActivityCheck: Date | null = null;

  private constructor() {}

  static getInstance(): SyncMonitor {
    if (!SyncMonitor.instance) {
      SyncMonitor.instance = new SyncMonitor();
    }
    return SyncMonitor.instance;
  }

  start() {
    if (this.cronJob) {
      console.log("Cron job ya está ejecutándose");
      return;
    }

    // Ejecutar cada hora (0 minutos de cada hora)
    this.cronJob = cron.schedule(
      "0 * * * *",
      async () => {
        await this.checkSyncActivity();
      },
      {
        timezone: "America/Mexico_City", // ajusta según tu zona horaria
      }
    );

    console.log("✅ Cron job de monitoreo iniciado - se ejecutará cada hora");

    // Ejecutar inmediatamente al iniciar
    this.checkSyncActivity();
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log("❌ Cron job de monitoreo detenido");
    }
  }

  private async checkSyncActivity() {
    try {
      console.log(`🔍 Verificando actividad del sync - ${new Date()}`);

      const syncActivity = await GetSyncActivity();
      const latestActivity = syncActivity[0];

      if (!latestActivity) {
        await this.sendAlert({
          message: "SINCRONIZADOR - No se encontró actividad de sync",
          level: "CRITICAL",
          where: "Sync",
        });
        return;
      }

      const activityTimestamp = new Date(
        latestActivity.timestamp.toString().replace(/([+-]\d{2}:\d{2}|Z)$/, "")
      );

      const nowLocal = new Date();

      const diffMs = nowLocal.getTime() - activityTimestamp.getTime();
      const diffMin = Math.floor(diffMs / 1000 / 60);

      if (diffMin <= 70) {
        console.log("✅ Sync funcionando correctamente");
      } else {
        await this.sendAlert({
          message: `SINCRONIZADOR no ha tenido actividad en ${diffMin} minutos. Última actividad: ${activityTimestamp}`,
          level: "CRITICAL",
          where: "Sync",
        });
      }

      this.lastActivityCheck = new Date();
    } catch (error: any) {
      console.error("❌ Error al verificar actividad del sync:", error);
      await this.sendAlert({
        message: `SINCRONIZADOR - Error al verificar el estado del sync: ${error.message}`,
        level: "ERROR",
        where: "Sync",
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

export const syncMonitor = SyncMonitor.getInstance();
