import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse.ts";
import { JWT_SECRET_REFRESH } from "../config/env.ts";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "@server/types/user.types.ts";

const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Missing or invalid Authorization header", 401);
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_REFRESH);
    req.user = decoded as User;
    next();
  } catch (error) {
    sendError(res, "Invalid or expired token", 403);
    return next(error);
  }
};

export default authMiddleware;
