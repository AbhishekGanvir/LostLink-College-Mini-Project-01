// components/ConfirmDialog.jsx
import React from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <h2 className="text-lg font-semibold mb-2">{title || "Confirm Action"}</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-500 hover:bg-gray-700 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white font-semibold transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
