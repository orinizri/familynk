// server/ecosystem.config.cjs

/**
 * PM2 Ecosystem Configuration (CommonJS)
 */
module.exports = {
  apps: [
    {
      name: "familynk-server",
      script: "./src/index.ts",   // your entry point
      instances: 2,               // number of processes
      exec_mode: "cluster",       // cluster mode
      watch: false,               // set to true only in dev
      max_restarts: 5,
      restart_delay: 3000,        // 3s between restarts
      min_uptime: "5s",           // consider started if >5s
      listen_timeout: 5000,       // wait up to 5s to bind
      kill_timeout: 5000,         // graceful shutdown timeout
      env: {
        NODE_ENV: "development",
        PORT: 8000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8000
      }
    }
  ]
};