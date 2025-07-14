import "express";
import { RegisterUserInput } from "../user.types";

declare module "express-serve-static-core" {
  interface Response {
    responseTime?: string;
  }
  interface Request {
    user?: RegisterUserInput; // User information from JWT token
  }
}
