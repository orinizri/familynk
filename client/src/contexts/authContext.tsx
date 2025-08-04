import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { getAccessToken, setAccessToken } from "../utils/axiosInstance";
import { api } from "../api/api";
import { getTokenExpiration } from "../utils/jwtUtils";
import {
  ApiResponse,
  AuthResponse,
  RegisterFormData,
} from "@client/types/auth.types";
import { User } from "@client/types/user.types";
import { AxiosResponse } from "axios";

type LoginArgs = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (args: LoginArgs) => Promise<void>;
  logout: () => void;
  register: (form: RegisterFormData) => Promise<void>;
  updateUser: (form: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = useCallback(async ({ email, password }: LoginArgs) => {
    const res = await api.post("/auth/login", { email, password });
    if (!res.data) {
      throw new Error("No response from server");
    }
    const { data } = res.data as AxiosResponse<AuthResponse>;
    console.log("Login response:", data);

    const { accessToken, refreshToken, user } = data;
    setAccessToken(accessToken);
    sessionStorage.setItem("access_token", refreshToken);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    sessionStorage.removeItem("access_token");
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const stored = sessionStorage.getItem("access_token");
    if (!stored) return;

    try {
      const res = await api.post("/auth/refresh", {
        refreshToken: stored,
      });
      const { data } = res as AxiosResponse<ApiResponse>;
      const { accessToken, refreshToken, user } = data.data as AuthResponse;
      setAccessToken(accessToken);
      sessionStorage.setItem("access_token", refreshToken);
      setUser(user);
    } catch (error) {
      console.error("Refresh failed:", error);
      alert("Session expired, please log in again.");
      logout();
    }
  }, [logout]);

  const register = useCallback(async (form: RegisterFormData) => {
    try {
      const res = await api.post("/auth/register", form);
      const { data } = res as AxiosResponse<ApiResponse<AuthResponse>>;
      if (!data?.success) {
        throw new Error("Register failed");
      }
      console.log("Register response:", data);
      const { accessToken, user } = data.data;
      setAccessToken(accessToken);
      sessionStorage.setItem("access_token", accessToken);
      setUser(user);
    } catch (err) {
      console.error(err);
      throw new Error("Register failed");
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await refreshToken();
      setLoading(false);
    })();
  }, [refreshToken]);

  useEffect(() => {
    if (!user) return;

    const token = getAccessToken();
    const expiration = getTokenExpiration(token);
    if (!expiration) return;

    const now = Date.now();
    const timeUntilExpiry = expiration - now;
    const refreshThreshold = 60 * 1000;

    if (timeUntilExpiry < refreshThreshold) {
      void refreshToken(); // safe fire-and-forget
      return;
    }

    const timeout = setTimeout(() => {
      void refreshToken();
    }, timeUntilExpiry - refreshThreshold);

    return () => clearTimeout(timeout);
  }, [user, refreshToken]);

  const updateUser = useCallback(
    (newData: Partial<User>) => {
      setUser((prev) => (prev ? { ...prev, ...newData } : prev));
    },
    [setUser]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      updateUser,
      user,
      loading,
      login,
      logout,
      register,
    }),
    [user, loading, login, logout, register, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access the current authenticated user and auth actions.
 * Must be used within an <AuthProvider>.
 */
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
