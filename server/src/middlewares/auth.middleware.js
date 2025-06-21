import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse.js";
import { JWT_SECRET_ACCESS } from "../config/env.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, "Missing or invalid Authorization header", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_ACCESS);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, "Invalid or expired token", 403);
  }
};

export default authMiddleware;