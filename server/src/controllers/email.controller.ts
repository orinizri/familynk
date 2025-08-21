import { EmailSchema, TokenSchema } from "../schemas/token.schema";
import { verifyEmailToken } from "../services/email.service";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { NextFunction, RequestHandler } from "express";
import { Request, Response } from "express";
import {
  resendVerificationByEmail,
  resendVerificationForUserId,
} from "../services/email.service";
import { getClientIp, getUserAgent } from "../utils/reqMeta";

/** POST /email/verify-email  (unauthenticated; body: { token }) */
export const verifyEmailController: RequestHandler = async (req, res, next) => {
  try {
    const parse = TokenSchema.safeParse(req.body);
    if (!parse.success) {
      sendError(res, parse.error.flatten().fieldErrors.token[0], 400);
      return;
    }
    const result = await verifyEmailToken(parse.data?.token);

    if (!result.ok) {
      switch (result.reason) {
        case "expired":
          sendError(res, "Verification link expired", 400);
          return;
        case "used":
          sendSuccess(res, "Account already verified");
          return;
        default:
          sendError(res, "Invalid verification link", 400);
          return;
      }
    }

    sendSuccess(res, "Email verified successfully", 200);
  } catch (error) {
    console.error("Error in verifyEmailHandler:", error);
    next(error);
  }
};

/** POST /email/resend-verification  (unauthenticated; body: { email }) */
export async function resendVerificationByEmailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parse = EmailSchema.safeParse(req.body);
    if (!parse.success) {
      sendError(res, parse.error.flatten().fieldErrors.email[0], 400);
      return;
    }
    const { email } = parse.data;
    const meta = { ip: getClientIp(req), ua: getUserAgent(req) };
    const result = await resendVerificationByEmail(email, meta);
    if ("rateLimited" in result && result.rateLimited) {
      sendError(res, "Too many requests. Try again later.", 429);
    }

    sendSuccess(
      res,
      "If an account exists for this email, a new verification link has been sent."
    );
  } catch (error) {
    console.error("Error in verifyEmailHandler:", error);
    next(error);
  }
}

/** POST /email/resend-verification/me  (authenticated; no body) */
export const resendVerificationForMeController: RequestHandler = async (
  req: Request,
  res,
  next
) => {
  try {
    // assumes auth middleware set req.user.id
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, "Unauthorized.", 401);
      return;
    }

    const meta = { ip: getClientIp(req), ua: getUserAgent(req) };
    const result = await resendVerificationForUserId(userId, meta);

    if ("notFound" in result && result.notFound) {
      sendError(res, "User not found.", 404);
      return;
    }
    if ("alreadyVerified" in result && result.alreadyVerified) {
      sendSuccess(res, "Email already verified.");
      return;
    }
    if ("rateLimited" in result && result.rateLimited) {
      sendError(res, "Too many requests. Try again later.", 429);
      return;
    }

    sendSuccess(res, "Verification email sent successfully.");
  } catch (error) {
    console.error("Error in verifyEmailHandler:", error);
    next(error);
  }
};
