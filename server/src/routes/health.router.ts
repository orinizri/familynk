import type { RequestHandler } from "express";
import { getHealthStatus } from "../services/health.service.ts";

/**
 * healthController
 * ----------------
 * Express controller that wraps the healthService and
 * sends an HTTP response.
 */
const healthController: RequestHandler = (_req, res, next) => {
  try {
    const payload = getHealthStatus();
    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};

export default healthController;