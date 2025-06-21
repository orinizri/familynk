import api from "../api/api";
import { refreshAccessToken } from "./utils"; // define in utils

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

// Inject token into every request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken(); // handles refresh call
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // retry request
      } catch {
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);
