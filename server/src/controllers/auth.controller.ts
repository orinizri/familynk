import { RequestHandler } from "express";
import {
  loginUserService,
  registerUserService,
  refreshTokenService,
} from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { User } from "../types/user.types";
import { LoginFormData, RefreshRequestBody } from "../types/auth.types";
import { verifyEmailToken } from "../services/token.service";
import { TokenSchema } from "../schemas/token.schema";

// LOG IN
export const loginController: RequestHandler = async function (
  req,
  res,
  next
): Promise<void> {
  const { email, password } = req.body as LoginFormData;

  if (!email || !password) {
    sendError(res, "Email and password are required", 400);
    return;
  }

  try {
    const data = await loginUserService(email, password);
    sendSuccess(res, { ...data, message: "Login successful" });
  } catch (error) {
    console.error("Login failed:", error);
    next(error);
  }
};

// REGISTER
export const registerController: RequestHandler = async function (
  req,
  res,
  next
): Promise<void> {
  const {
    email,
    password,
    first_name,
    last_name,
    date_of_birth,
    photo_url,
  }: User = req.body as User;

  if (!email || !password || !first_name || !last_name) {
    sendError(res, "Required Fields are missing", 400);
  }

  try {
    const response = await registerUserService({
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      photo_url,
    });
    console.log("RESPONSE", response);
    sendSuccess(res, response, 201);
  } catch (error) {
    next(error);
  }
};

// REFRESH TOKEN
export const refreshTokenController: RequestHandler = async function (
  req,
  res,
  next
): Promise<void> {
  const { refreshToken } = req.body as RefreshRequestBody;
  if (!refreshToken) {
    sendError(res, "Refresh token is required", 400);
    return;
  }
  try {
    const data = await refreshTokenService(refreshToken);
    sendSuccess(res, { ...data }, 201);
  } catch (error) {
    next(error);
  }
};

// VERIFY EMAIL
export const verifyEmailController: RequestHandler = async (req, res, next) => {
  try {
    console.log("verifyEmailController called with query:", req.body);
    const parse = TokenSchema.safeParse(req.body);
    if (!parse.success) {
      sendError(res, parse.error.flatten().toString(), 400);
      return;
    }
    const result = await verifyEmailToken(parse.data?.token);
    console.log("verifyEmailToken result:", result);

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
          return
      }
    }

    sendSuccess(res, { message: "Email verified successfully" }, 200);
  } catch (error) {
    console.error("Error in verifyEmailHandler:", error);
    next(error);
  }
};
