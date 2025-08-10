import express from "express";
import {
  loginController,
  refreshTokenController,
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/verify-email", verifyEmailController);

export default authRouter;
