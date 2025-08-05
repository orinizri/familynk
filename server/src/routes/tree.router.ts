import { Router } from "express";
import {
  createTreesController,
  getTreesController,
} from "../controllers/tree.controller";
import { validatePagination } from "../middlewares/validatePagination";
import authMiddleware from "../middlewares/auth.middleware";

const treeRouter = Router();

treeRouter.get("/", authMiddleware, validatePagination, getTreesController);
treeRouter.post("/", authMiddleware, createTreesController);

export default treeRouter;
