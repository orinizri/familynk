import { RequestHandler } from "express";
import {
  loginUserService,
  registerUserService,
  refreshTokenService,
} from "../services/auth.service.ts";
import { sendSuccess, sendError } from "../utils/apiResponse.ts";
import { JWT_SECRET_REFRESH } from "../config/env.ts";
console.log("refreshTokenController called", JWT_SECRET_REFRESH);

// LOG IN
export const loginController: RequestHandler = async function (
  req,
  res,
  next
): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    sendError(res, "Email and password are required", 400);
    return;
  }

  try {
    const data = await loginUserService(email, password);
    sendSuccess(res, { ...data, message: "Login successful" });
  } catch (error) {
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
    role,
  } = req.body;

  if (!email || !password || !first_name || !last_name) {
    sendError(res, "Required Fields are missing", 400);
  }

  try {
    const token = await registerUserService({
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      photo_url,
      role: role || "user", // Default role
    });
    sendSuccess(res, { token, message: "Registration successful" }, 201);
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
  const { refreshToken } = req.body;
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