// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <--- 1. JANGAN LUPA IMPORT INI

// 1. Context
import { AuthProvider } from "./context/AuthContext";

// 2. Components & Layouts
import ProtectedRoutes from "./component/ProtectedRoutes";
import AdminLayout from "./component/AdminLayout";
import UserLayout from "./component/UserLayout";

// 3. Pages (Auth)
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// 4. Pages (User)
import UserDashboard from "./pages/UserDashboard";
import Riwayat from "./pages/Riwayat";
import FormPembayaran from "./pages/FormPembayaran";

// 5. Pages (Admin)
import AdminTagihan from "./pages/Tagihan"; 
import BuatTagihan from "./pages/BuatTagihan";
import Laporan from "./pages/Laporan";
import Verifikasi from "./pages/Verifikasi";
import KelolaKrama from "./pages/KelolaKrama"; 

function App() {
  return (
    <AuthProvider>
      {/* 2. PASANG KOMPONEN TOASTER DISINI 
          zIndex: 99999 PENTING agar toast muncul di atas Modal Pop-up
      */}
      <Toaster 
        position="top-right"
        containerStyle={{
          zIndex: 99999, 
        }}
        toastOptions={{
          style: {
            zIndex: 99999,
          },
        }}
      />

      <Routes>
        {/* === RUTE PUBLIK === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* === RUTE USER (KRAMA) === */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="riwayat" element={<Riwayat />} />
            {/* Tambahan: User bisa akses menu keluarga */}
            <Route path="keluarga" element={<KelolaKrama />} />
          </Route>
          <Route path="/form-pembayaran" element={<FormPembayaran />} />
        </Route>

        {/* === RUTE ADMIN === */}
        <Route element={<ProtectedRoutes role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="verifikasi" replace />} />
            
            <Route path="verifikasi" element={<Verifikasi />} />
            <Route path="tagihan" element={<BuatTagihan />} />
            <Route path="kasir" element={<AdminTagihan />} />
            <Route path="laporan" element={<Laporan />} />
            <Route path="krama" element={<KelolaKrama />} />
          </Route>
          
          <Route path="/admin/form-pembayaran" element={<FormPembayaran />} />
        </Route>

        {/* === FALLBACK (404) === */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;