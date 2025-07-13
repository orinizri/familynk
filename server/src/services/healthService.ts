/**
 * healthService.getHealthStatus
 * -----------------------------
 * Business‐logic layer for the health check.
 * Returns an object with the current status and process uptime.
 *
 * @returns {{ status: string, uptime: number }}
 */
export function getHealthStatus() {
  return {
    status: "ok", // “ok” means the app is running
    uptime: process.uptime(), // seconds since process start
  };
}
