import { useContext } from "react";
import { UserContext } from "../context/UserContext";

/**
 * Hook para acceder al contexto de usuarios.
 * Uso: const { users, fetchAllUsers, createAdminUser } = useUsers();
 */
export function useUsers() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUsers debe usarse dentro de <UserProvider>");
  }
  return ctx;
}
