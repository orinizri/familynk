import { Router } from "express";
import {
  createTreesController,
  getTreesController,
} from "../controllers/tree.controller.ts";
import { validatePagination } from "../middlewares/validatePagination.ts";

const treeRouter = Router();

treeRouter.get("/", validatePagination, getTreesController);
treeRouter.post("/", createTreesController);

export default treeRouter;
