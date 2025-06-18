import express from "express";
import {
  getProfileController,
  updateProfileController,
  deleteProfileController,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getProfileController);
userRouter.put("/me", authMiddleware, updateProfileController);
userRouter.delete("/me", authMiddleware, deleteProfileController);

export default userRouter;
