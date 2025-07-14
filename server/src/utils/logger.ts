import pino from "pino";
import { Request, Response } from "express";

export const reqSerializer = (req: Request) => ({
  id: req.id,
  method: req.method,
  url: req.url,
});

export const resSerializer = (res: Response) => ({
  statusCode: res.statusCode,
  responseTime: res.responseTime,
});

export const logger = pino();
