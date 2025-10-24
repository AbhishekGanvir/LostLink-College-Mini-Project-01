// src/components/Loader.jsx
import React from "react";

export default function Loader({ size = 24 }) {
  return (
    <div className="flex items-center justify-center p-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="rgba(59,130,246,0.25)"
          strokeWidth="5"
          fill="none"
        />
        <path
          d="M45 25a20 20 0 00-20-20"
          stroke="rgb(59 130 246)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
