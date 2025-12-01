// src/utils/apiClient.js (Pastikan seperti ini)

import axios from "axios";

// Ambil token dari localStorage menggunakan key "authToken"
const token = localStorage.getItem("authToken");

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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
