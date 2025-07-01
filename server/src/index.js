import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import pinoHttp from "pino-http";
import errorHandler from "./middlewares/errorHandler.js";
import healthRouter from "./routes/health.router.js";
import reservationsRouter from "./routes/reservations.router.js";
import { CLIENT_URL, PORT } from "./config/env.js";
import { logger } from "./utilities/logger.js";

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

const app = express();
/* Middlewares */
// Security headers
app.use(helmet());
// CORS middleware to allow cross-origin requests
app.use(cors({ origin: CLIENT_URL }));
app.use(compression({ threshold: 0 })); // Compress all responses
// Logging middleware
app.use(pinoHttp({ logger }));
// Body parser middleware
app.use(express.json());

// Health-check router
app.use("/healthz", healthRouter);

// Reservations router
app.use("/reservations", reservationsRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}!`);
});

// Graceful shutdown handler
function gracefulExit() {
  logger.info("🛑 Received shutdown signal, closing server...");
  app.close((error) => {
    if (error) {
      logger.error(error, "Error closing server:");
      process.exit(1);
    }
    logger.info("✅ Server closed, exiting process");
    process.exit(0);
  });

  // Force kill after timeout (in case of stuck connections)
  setTimeout(() => {
    logger.warn("⏱  Shutdown timeout, forcing exit");
    process.exit(1);
  }, 10000).unref(); // 10 seconds
}

// Listen for PM2 cluster shutdown events
process.on("SIGINT", gracefulExit);
process.on("SIGTERM", gracefulExit);
