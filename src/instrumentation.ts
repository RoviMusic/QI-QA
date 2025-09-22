export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeBackgroundServices } = await import("./lib/startup");
    initializeBackgroundServices();
  }
}
