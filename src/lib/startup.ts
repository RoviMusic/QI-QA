import { processorMonitor } from "./cron/processorMonitor";
import { syncMonitor } from "./cron/syncMonitor";

export function initializeBackgroundServices() {
  console.log("🚀 Inicializando servicios de background...");

  // Iniciar el monitor de sync
  syncMonitor.start();
  processorMonitor.start();

  // Manejar cierre graceful
  process.on("SIGINT", () => {
    console.log("📱 Recibida señal SIGINT, cerrando servicios...");
    syncMonitor.stop();
    processorMonitor.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("📱 Recibida señal SIGTERM, cerrando servicios...");
    syncMonitor.stop();
    processorMonitor.stop();
    process.exit(0);
  });
}
