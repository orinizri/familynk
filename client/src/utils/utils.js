import api from "../api/api";

export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("access_token");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await api.post("/auth/refresh", { refreshToken });
  return res.data.accessToken;
}
