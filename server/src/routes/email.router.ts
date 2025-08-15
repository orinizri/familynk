import {
  verifyEmailController,
  resendVerificationByEmailController,
  resendVerificationForMeController,
} from "../controllers/email.controller";
import express from "express";

const emailRouter = express.Router();

emailRouter.post("/verify-email", verifyEmailController);
emailRouter.post("/resend-token-by-email", resendVerificationByEmailController);
emailRouter.post("/resend-token", resendVerificationForMeController);

export default emailRouter;
