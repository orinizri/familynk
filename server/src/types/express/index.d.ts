import "express";
import { RegisterUserInput } from "../user.types";
import { FetchTreesOptions } from "../tree.types";

declare module "express-serve-static-core" {
  interface Response {
    responseTime?: string;
  }
  interface Request {
    user?: RegisterUserInput; // User information from JWT token
    pagination?: FetchTreesOptions;
  }
}
