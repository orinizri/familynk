import { getHealthStatus } from "../services/health.service";
import { RequestHandler } from "express";

/**
 * healthController
 * ----------------
 * Express controller that wraps the healthService and
 * sends an HTTP response.
  * It handles the GET /health endpoint.
 */
export const healthController: RequestHandler = (_req, res, next) => {
  try {
    const payload = getHealthStatus();
    // 200 OK + JSON body
    res.status(200).json(payload);
  } catch (err) {
    // Unexpected errors bubble to your global error handler
    next(err);
  }
};
