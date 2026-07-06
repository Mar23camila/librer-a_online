import { createContext, useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import * as api from "../api/apiClient";

export const UserContext = createContext(null);

/**
 * UserContext: Gestiona usuarios, especialmente para el panel de administración.
 * Centraliza operaciones CRUD de usuarios (crear, listar, actualizar, eliminar).
 */
export function UserProvider({ children }) {
  const { token, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllUsers = useCallback(async () => {
    if (!isAdmin || !token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllUsers(token);
      setUsers(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  const createAdminUser = useCallback(
    async (userData) => {
      if (!isAdmin || !token) throw new Error("No tienes permisos");
      try {
        const newUser = await api.registerAdmin(userData, token);
        setUsers((prev) => [...prev, newUser]);
        return newUser;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [token, isAdmin]
  );

  const updateUser = useCallback(
    async (userId, updates) => {
      if (!isAdmin || !token) throw new Error("No tienes permisos");
      try {
        const updated = await api.updateUser(userId, updates, token);
        setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [token, isAdmin]
  );

  const deleteUser = useCallback(
    async (userId) => {
      if (!isAdmin || !token) throw new Error("No tienes permisos");
      try {
        await api.deleteUser(userId, token);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [token, isAdmin]
  );

  const value = {
    users,
    loading,
    error,
    fetchAllUsers,
    createAdminUser,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
