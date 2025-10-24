import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const newToast = { id: id++, type, message };
    setToasts((prev) => [...prev, newToast]);
    // Auto-remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3000);
  }, []);

  const value = {
    toasts,
    success: (msg) => addToast("success", msg),
    error: (msg) => addToast("error", msg),
    warn: (msg) => addToast("warn", msg),
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}
