import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getAccessToken, setAccessToken } from "../utils/axiosInstance";
import api from "../api/api";
import { getTokenExpiration } from "../utils/jwtUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = useCallback(async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    if (!res.data || !res.data.data || !res.data.success) {
      throw new Error("Login failed");
    }
    const { accessToken, refreshToken, user } = res.data.data;
    setAccessToken(accessToken);
    sessionStorage.setItem("access_token", refreshToken);
    setUser(user);
  }, []);

  // Logout
  const logout = useCallback(() => {
    setAccessToken(null);
    sessionStorage.removeItem("access_token");
    setUser(null);
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    const stored = sessionStorage.getItem("access_token");
    if (!stored) return;

    try {
      const res = await api.post("/auth/refresh", { refreshToken: stored });
      const { accessToken, refreshToken, user } = res.data.data;
      setAccessToken(accessToken);
      sessionStorage.setItem("access_token", refreshToken);
      setUser(user);
    } catch (error) {
      console.warn("Refresh failed:", error.message);
      alert("Session expired, please log in again.");
      logout();
    }
  }, [logout]);

  const register = useCallback(async (form) => {
    const res = await api.post("/auth/register", form);
    if (!res.data?.success)
      throw new Error(res.data?.error || "Register failed");
    const { token, user } = res.data.data;
    setAccessToken(token);
    sessionStorage.setItem("access_token", token); // or refreshToken if split
    setUser(user);
  }, []);

  // On app load: try to refresh session
  useEffect(() => {
    const init = async () => {
      await refreshToken();
      setLoading(false);
    };
    init();
  }, [refreshToken]);

  // Memoize context value to avoid triggering re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
    }),
    [user, loading, login, logout, register]
  );

  useEffect(() => {
    if (!user) return;

    const token = getAccessToken();
    const expiration = getTokenExpiration(token);
    if (!expiration) return;

    const now = Date.now();
    const timeUntilExpiry = expiration - now;
    const refreshThreshold = 60 * 1000; // 1 minute

    if (timeUntilExpiry < refreshThreshold) {
      refreshToken(); // preemptive refresh
      return;
    }

    const timeout = setTimeout(() => {
      refreshToken(); // or logout()
    }, timeUntilExpiry - refreshThreshold);

    return () => clearTimeout(timeout);
  }, [user, refreshToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
