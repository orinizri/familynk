import "express";
import { FetchTreesOptions } from "../tree.types";
import { User } from "shared/types/user.types";

declare module "express-serve-static-core" {
  interface Response {
    responseTime?: string;
  }
  interface Request {
    user?: User; // User information from JWT token
    pagination?: FetchTreesOptions;
  }
}
