import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";
import { JWT_SECRET_REFRESH } from "../config/env";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ReqUser } from "@server/types/user.types";

const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Missing or invalid Authorization header", 401);
    next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_REFRESH) as ReqUser;
    console.log("decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, "Invalid or expired token", 403);
    next(error);
  }
};

export default authMiddleware;
