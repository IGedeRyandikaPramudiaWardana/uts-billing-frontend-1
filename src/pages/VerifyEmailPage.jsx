// src/pages/VerifyEmailPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromRegister = location.state?.email || "";
  
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    apiClient.post("/verify-email", { email: emailFromRegister, code })
      .then((res) => {
        setMessage("Verifikasi Berhasil! Mengalihkan ke login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect ke Login
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Kode salah.");
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Verifikasi Email</h2>
        <p className="text-center text-gray-600 mb-6">
          Masukkan kode 6 digit yang telah dikirim ke <strong>{emailFromRegister}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Contoh: 123456"
            className="w-full p-3 border text-center text-2xl tracking-widest rounded-md"
            maxLength={6}
          />
          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? "Memproses..." : "Verifikasi Akun"}
          </button>
        </form>
        
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default VerifyEmailPage;