import { ApiResponse, AuthResponse } from "@client/types/auth.types";
import api from "../api/api";

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = sessionStorage.getItem("access_token");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await api.post<ApiResponse<AuthResponse>>("/auth/refresh", {
    refreshToken,
  });
  const data = res.data as unknown as AuthResponse;
  return data.accessToken;
}
