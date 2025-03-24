// src/config.js

const isLocal = window.location.hostname === "localhost";

export const BASE_URL = isLocal
  ? "http://localhost:8000" // 👈 Local backend
  : "https://hypertrophy-backend.onrender.com"; // 👈 Replace with real backend URL
