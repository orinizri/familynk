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
  verifyEmail: (
    token: string,
    signal: AbortSignal
  ) => Promise<ApiResponse<null>>;
  resendVerificationEmail: (
    email: string,
    signal: AbortSignal
  ) => Promise<ApiResponse<null>>;
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
    const { accessToken, refreshToken, user } = data;
    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      localStorage.setItem("access_token", refreshToken);
    }
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem("access_token");
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const stored = localStorage.getItem("access_token");
    if (!stored) return;

    try {
      const res = await api.post("/auth/refresh", {
        refreshToken: stored,
      });
      const { data } = res as AxiosResponse<ApiResponse>;
      const { accessToken, refreshToken, user } = data.data as AuthResponse;
      setAccessToken(accessToken);
      localStorage.setItem("access_token", refreshToken);
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
      localStorage.setItem("access_token", accessToken);
      console.log("set localStorage", localStorage.getItem("access_token"));
      setUser(user);
    } catch (err) {
      console.error(err);
      throw new Error("Register failed");
    }
  }, []);

  const verifyEmail = useCallback(
    async (token: string, signal: AbortSignal): Promise<ApiResponse<null>> => {
      console.log("Verifying email with token:", token);
      const res = await api.post("/email/verify-email", { token }, { signal });
      const { data } = res as AxiosResponse<ApiResponse<null>>;
      console.log("Verify email response auth context:", data);
      return data;
    },
    []
  );

  const resendVerificationEmail = useCallback(
    async (email: string, signal: AbortSignal): Promise<ApiResponse<null>> => {
      console.log("Verifying email with token:", email);
      const res = await api.post(
        "/email/resend-token-by-email",
        { email },
        { signal }
      );
      const { data } = res as AxiosResponse<ApiResponse<null>>;
      console.log("resendVerificationEmail:", data);
      return data;
    },
    []
  );

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
      delete newData.role; // Prevent role changes
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
      verifyEmail,
      resendVerificationEmail,
    }),
    [
      user,
      loading,
      login,
      logout,
      register,
      updateUser,
      verifyEmail,
      resendVerificationEmail,
    ]
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
