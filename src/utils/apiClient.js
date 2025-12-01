// src/utils/apiClient.js

import axios from "axios";

// Ambil token dari localStorage menggunakan key "authToken"
const token = localStorage.getItem("authToken");

const apiClient = axios.create({
  // --- PERBAIKAN UTAMA DI SINI ---
  // Kita gunakan logika "OR" (||).
  // 1. Cek apakah ada VITE_API_URL (dari Vercel)?
  // 2. Jika tidak ada (null/undefined), gunakan localhost (untuk di laptop).
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

// Interceptor untuk memperbarui token di SETIAP request
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token terbaru dari localStorage dengan key "authToken"
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
