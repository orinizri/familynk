import pino from "pino";
import { NODE_ENV } from "../config/env.js";

const reqSerializer = (req) => ({
  id: req.id,
  method: req.method,
  url: req.url,
  responseTime: req.responseTime, // TODO: attach this yourself later
});

const resSerializer = (res) => ({
  statusCode: res.statusCode
});

export const logger = pino({
  serializers: {
    req: reqSerializer,
    res: resSerializer
  },
  transport: NODE_ENV === "production"
    ? undefined
    : { target: "pino-pretty", options: { colorize: true } }
});