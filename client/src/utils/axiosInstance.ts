import api from "../api/api";
import { refreshAccessToken } from "./utils";
import { AxiosError } from "axios";

import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

// ---- TYPES ---- //

type AccessToken = string;

type QueueItem = {
  resolve: (token: AccessToken) => void;
  reject: (err: unknown) => void;
};

// ---- STATE ---- //

let accessToken: AccessToken | null = null;
let isRefreshing = false;
let queue: QueueItem[] = [];

// ---- EXPORTS ---- //

export function getAccessToken(): AccessToken | null {
  return accessToken;
}

export function setAccessToken(token: AccessToken) {
  accessToken = token;
}

// ---- QUEUE PROCESSING ---- //

function processQueue(error: unknown, token: AccessToken | null) {
  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  queue = [];
}

// ---- INTERCEPTOR ---- //

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config;

    // Safeguard: AxiosRequestConfig is loosely typed
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token: AccessToken) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const access_token = await refreshAccessToken();
        console.log("New access token:", access_token);
        setAccessToken(access_token);
        processQueue(null, access_token);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
