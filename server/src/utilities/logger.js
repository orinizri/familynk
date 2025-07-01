import pino from "pino";

export const reqSerializer = (req) => ({
  id: req.id,
  method: req.method,
  url: req.url,
});

export const resSerializer = (res) => ({
  statusCode: res.statusCode,
  responseTime: res.responseTime,
});

export const logger = pino();
