import { AuthResponse } from "@client/types/auth.types";
import { api } from "../api/api";
import { ZodError } from "zod";

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = sessionStorage.getItem("access_token");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await api.post("/auth/refresh", {
    refreshToken,
  });
  const data = res.data as unknown as AuthResponse;
  return data.accessToken;
}

/**
 * Extracts user-friendly messages from a ZodError or Zod-style error response.
 */
export function extractZodMessages(error: unknown): string[] {
  // Case 1: Direct ZodError instance
  if (error instanceof ZodError) {
    return error.issues.map((issue) => {
      const path = issue.path.join(".");
      return `${path || "field"}: ${issue.message}`;
    });
  }
  return [`Error: ${error instanceof Error ? error.message : String(error)}`];
}
