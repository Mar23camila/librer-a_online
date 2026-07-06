import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

/**
 * Hook para acceder al contexto de errores globales.
 * Uso: const { addError, clearError } = useGlobalError();
 */
export function useGlobalError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    throw new Error("useGlobalError debe usarse dentro de <ErrorProvider>");
  }
  return ctx;
}
