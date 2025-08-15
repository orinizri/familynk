import { Request } from "express";

export function getClientIp(req: Request): string | null {
  const xff = (req.headers["x-forwarded-for"] as string) || "";
  const first = xff.split(",")[0].trim();
  return first || req.socket.remoteAddress || null;
}

export function getUserAgent(req: Request): string | null {
  return req.headers["user-agent"] || null;
}
