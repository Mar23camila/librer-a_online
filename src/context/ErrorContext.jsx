import { createContext, useCallback, useContext, useState } from "react";
import { useToast } from "./ToastContext";

export const ErrorContext = createContext(null);

/**
 * ErrorContext: Manejo centralizado de errores globales.
 * Permite a cualquier componente registrar errores que se muestran de forma consistente.
 */
export function ErrorProvider({ children }) {
  const toast = useToast();
  const [errors, setErrors] = useState([]);

  const addError = useCallback(
    (error, showNotification = true) => {
      const errorObj = {
        id: Date.now(),
        message: error?.message || String(error),
        status: error?.status,
        timestamp: new Date().toISOString(),
      };

      setErrors((prev) => [errorObj, ...prev.slice(0, 9)]); // Mantener últimos 10 errores

      if (showNotification) {
        toast.error(errorObj.message);
      }

      return errorObj.id;
    },
    [toast]
  );

  const clearError = useCallback((id) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getLastError = useCallback(() => {
    return errors[0] || null;
  }, [errors]);

  const value = {
    errors,
    addError,
    clearError,
    clearAllErrors,
    getLastError,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

export function useGlobalError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    throw new Error("useGlobalError debe usarse dentro de <ErrorProvider>");
  }
  return ctx;
}
