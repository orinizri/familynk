import "express";

declare module "express-serve-static-core" {
  interface Response {
    responseTime?: string;
  }
}
