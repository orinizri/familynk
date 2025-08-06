import express from "express";
import { healthController } from "../controllers/health.controller";

const healthRouter = express.Router();

healthRouter.get("/", healthController);
export default healthRouter;
