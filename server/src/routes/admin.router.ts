import express from "express";
import requireRole from "../middlewares/role.middleware.ts";
import { getAllUsers } from "../controllers/admin.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const adminRouter = express.Router();

adminRouter.get("/users", authMiddleware, requireRole("admin"), getAllUsers);

export default adminRouter;
