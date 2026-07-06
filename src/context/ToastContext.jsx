import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "success") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  const toast = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[min(92vw,360px)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`animate-fade-up rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur
              ${
                t.type === "success"
                  ? "bg-violet-950/90 border-violet-600 text-lilac-200"
                  : t.type === "error"
                  ? "bg-red-950/90 border-red-600 text-red-100"
                  : "bg-surface-2/90 border-line text-parchment"
              }`}
            style={{
              backgroundColor:
                t.type === "success" ? "rgba(47,20,97,0.92)" : t.type === "error" ? "rgba(69,10,10,0.92)" : "rgba(31,24,48,0.92)",
              borderColor: t.type === "success" ? "#7c3aed" : t.type === "error" ? "#dc2626" : "#2c2340",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
