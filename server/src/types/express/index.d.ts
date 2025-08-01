import "express";
import { ReqUser } from "../user.types";
import { PaginationType } from "@client/types/pagination.types";

declare module "express-serve-static-core" {
  interface Response {
    responseTime?: string;
  }
  interface Request {
    user?: ReqUser; // User information from JWT token
    pagination?: Partial<PaginationType>;
  }
}
