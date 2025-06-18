import { loginUser, registerUser } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// LOG IN
export async function loginController(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "Email and password are required", 400);
  }

  try {
    const token = await loginUser(email, password);
    return sendSuccess(res, { token, message: "Login successful" });
  } catch (err) {
    next(err);
  }
}

// REGISTER
export async function registerController(req, res, next) {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return sendError(res, "Required Fields are missing", 400);
  }

  try {
    const token = await registerUser({
      email,
      password,
      first_name,
      last_name,
    });
    return sendSuccess(res, { token, message: "Registration successful" }, 201);
  } catch (err) {
    next(err);
  }
}
