import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import responseTime from "response-time";
import pinoHttp from "pino-http";
import errorHandler from "./middlewares/errorHandler.js";
import healthRouter from "./routes/health.router.js";
import reservationsRouter from "./routes/reservations.router.js";
import { CLIENT_URL, PORT } from "./config/env.js";
import { logger, reqSerializer, resSerializer } from "./utilities/logger.js";

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

const app = express();

/* Middlewares */

// Security headers
app.use(helmet());

// CORS middleware to allow cross-origin requests
app.use(cors({ origin: CLIENT_URL }));

// Response time middleware to measure request processing time
app.use(
  responseTime((req, res, timeMs) => {
    // store a string like "12.345ms" on the res object
    res.responseTime = `${timeMs.toFixed(3)}ms`;
  })
);

// Compression middleware to reduce response size
app.use(compression({ threshold: 0 }));

// Logging middleware
app.use(
  pinoHttp({
    logger,
    // override the default req/res serializers
    serializers: {
      req: reqSerializer,
      res: resSerializer,
    },
    customLogLevel: (res, err) =>
      err ? "error" : res.statusCode >= 400 ? "warn" : "info",
  })
);

// Nice-to-have: Echo request ID in response headers for tracing (req.id)

// Body parser middleware
app.use(express.json());

// Health-check
app.use("/healthz", healthRouter);

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
