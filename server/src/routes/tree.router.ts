import { Router } from "express";
import {
  createTreesController,
  getTreeNetworkController,
  getTreesController,
} from "../controllers/tree.controller";
import { validatePagination } from "../middlewares/validatePagination";
import authMiddleware from "../middlewares/auth.middleware";

const treeRouter = Router();

treeRouter.get("/", authMiddleware, validatePagination, getTreesController);
treeRouter.get("/:id", authMiddleware, getTreeNetworkController);
treeRouter.post("/", authMiddleware, createTreesController);


export default treeRouter;
