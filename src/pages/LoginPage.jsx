// src/pages/LoginPage.jsx

import React, { useState } from "react";
import apiClient from "../utils/apiClient";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Gunakan apiClient dan URL relatif (tanpa http://localhost:8000/api)
    apiClient
      .post("/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        // Fungsi login dari AuthContext akan menangani penyimpanan token
        login(response.data.user, response.data.token);

        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        if(err.response && err.response.status === 403) {
          navigate("/verify-email", { state: { email: email } });
          return;
        }


        if (err.response && err.response.data) {
          const errorMsg =
            err.response.data.errors?.email?.[0] || err.response.data.message;
          setError(errorMsg || "Email atau password salah.");
        } else {
          setError("Login gagal. Coba lagi.");
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full p-4 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
