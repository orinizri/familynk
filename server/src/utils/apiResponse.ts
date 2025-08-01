import { Response } from "express";

// Utility functions for sending API responses
export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendError(res: Response, error: string, status = 400) {
  return res.status(status).json({ success: false, error });
}
