import { createContext, useEffect, useState, useCallback } from "react";
import * as api from "../api/apiClient";

export const AuthContext = createContext(null);

const TOKEN_KEY = "pv_token";
const ROLE_KEY = "pv_role";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const r = localStorage.getItem(ROLE_KEY);
    if (t) {
      const u = api.getUserFromToken(t);
      // Si el usuario se recupera del token, usar ese rol; si no, usar el rol guardado
      if (u) return u;
      // Fallback: reconstruir un objeto mínimo con el rol guardado
      if (r) return { role: r };
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sincronizar token + rol con localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      const userData = api.getUserFromToken(token);
      if (userData) {
        setUser(userData);
        localStorage.setItem(ROLE_KEY, userData.role);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      setUser(null);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken } = await api.login({ email, password });
      // El useEffect se encarga de persistir token y rol
      setToken(newToken);
      const userData = api.getUserFromToken(newToken);
      // Guardar rol explícitamente en localStorage
      localStorage.setItem(ROLE_KEY, userData.role);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken } = await api.registerClient(data);
      setToken(newToken);
      const userData = api.getUserFromToken(newToken);
      // Guardar rol explícitamente en localStorage
      localStorage.setItem(ROLE_KEY, userData.role);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    // El useEffect limpiará ROLE_KEY también
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
