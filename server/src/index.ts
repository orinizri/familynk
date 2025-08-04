// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import responseTime from "response-time";
import pinoHttp from "pino-http";
import healthRouter from "./routes/health.router";
// import reservationsRouter from "./routes/reservations.router";
import authRouter from "./routes/auth.router";
import { CLIENT_URL, PORT } from "./config/env";
import { logger, reqSerializer, resSerializer } from "./utils/logger";
import { Request, Response } from "express";
import { limiter } from "./middlewares/rateLimiter";
import { Server } from "http";
import treeRouter from "./routes/tree.router";
import userRouter from "./routes/user.router";
import errorHandler from "./middlewares/errorHandler";

try {
  const app = express();

  /* Middlewares */

  // Security headers
  app.use(helmet());

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
        err
          ? "error"
          : res?.statusCode && res.statusCode >= 400
            ? "warn"
            : "info",
    })
  );

  // Nice-to-have: Echo request ID in response headers for tracing (req.id)

  // Rate limiting middleware to prevent abuse (per worker)
  app.use(limiter);

  // CORS middleware to allow cross-origin requests
  app.use(cors({ origin: CLIENT_URL }));

  // Response time middleware to measure request processing time
  app.use(
    responseTime((_req: Request, res: Response, timeMs: number) => {
      // store a string like "12.345ms" on the res object
      res.responseTime = `${timeMs.toFixed(3)}ms`;
    })
  );

  // Compression middleware to reduce response size
  app.use(compression({ threshold: 0 }));

  // Body parser middleware
  app.use(express.json());

  // Health-check
  app.use("/healthz", healthRouter);

  app.use("/auth", authRouter);

  app.use("/users", userRouter);

  app.use("/trees", treeRouter);

  // Error handling middleware
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}!`);
  });

  //   // Graceful shutdown handler
  const gracefulExit = (server: Server) => {
    logger.info("🛑 Received shutdown signal, closing server...");
    server.close((error) => {
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
  };

  // Listen for PM2 cluster shutdown events
  process.on("SIGINT", () => gracefulExit(server));
  process.on("SIGTERM", () => gracefulExit(server));
} catch (error) {
  logger.error(error, "Error starting server:");
  process.exit(1);
}
