import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { setAccessToken } from "../utils/axiosInstance";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = useCallback(async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = res.data;

    setAccessToken(accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
    setUser(user);
  }, []);

  // Logout
  const logout = useCallback(() => {
    setAccessToken(null);
    sessionStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    const stored = sessionStorage.getItem("refresh_token");
    if (!stored) return;

    try {
      const res = await api.post("/auth/refresh", { refreshToken: stored });
      const { accessToken, user } = res.data;
      setAccessToken(accessToken);
      setUser(user);
    } catch (err) {
      console.warn("Refresh failed:", err.message);
      logout();
    }
  }, [logout]);

  // On app load: try to refresh session
  useEffect(() => {
    const init = async () => {
      await refreshToken();
      setLoading(false);
    };
    init();
  }, [refreshToken]);

  // Memoize context value to avoid triggering re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
  }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};