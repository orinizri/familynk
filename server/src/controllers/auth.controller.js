import {
  loginUserService,
  registerUserService,
  refreshTokenService,
} from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// LOG IN
export async function loginController(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "Email and password are required", 400);
  }

  try {
    const data = await loginUserService(email, password);
    return sendSuccess(res, { ...data, message: "Login successful" });
  } catch (error) {
    next(error);
  }
}

// REGISTER
export async function registerController(req, res, next) {
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
    return sendError(res, "Required Fields are missing", 400);
  }

  try {
    const token = await registerUserService({
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      photo_url,
      role: "user", // Default role
    });
    return sendSuccess(res, { token, message: "Registration successful" }, 201);
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenController(req, res, next) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return sendError(res, "Refresh token is required", 400);
  }
  try {
    const data = await refreshTokenService(refreshToken);
    return sendSuccess(res, { ...data }, 201);
  } catch (error) {
    next(error);
  }
}
