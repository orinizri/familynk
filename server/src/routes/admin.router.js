import express from "express";
import requireRole from "../middlewares/role.middleware.js";
import { getAllUsers } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/users", requireRole("admin"), getAllUsers);

export default adminRouter;
