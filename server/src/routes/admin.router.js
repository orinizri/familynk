import express from "express";
import requireRole from "../middlewares/role.middleware.js";
import { getAllUsers } from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.get("/users", authMiddleware, requireRole("admin"), getAllUsers);

export default adminRouter;
