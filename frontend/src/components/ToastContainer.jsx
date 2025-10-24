import React from "react";
import { useToast } from "../utils/ToastContext";

const colors = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warn: "bg-yellow-500 text-white",
};

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2 w-72">
      {toasts.map(({ id, type, message }) => (
        <div
          key={id}
          className={`flex items-center p-3 rounded shadow ${
            colors[type] || colors.warn
          } animate-fade-in-down`}
        >
          <span className="font-bold mr-2">
            {type === "success" ? "✓" : type === "error" ? "✕" : "⚠️"}
          </span>
          <span>{message}</span>
        </div>
      ))}
      <style>{`
        @keyframes fade-in-down {
          from {opacity: 0; transform: translateY(-10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
