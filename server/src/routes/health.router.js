import { Router } from "express";
import { healthController } from "../controllers/health.controller.js";

const healthRouter = Router();

/**
 * GET /healthz
 *  - Quick liveness probe for load balancers or uptime monitors
 *  - No authentication or validation needed
 */
healthRouter.get("/", healthController);

export default healthRouter;
