import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BsGrid,
  BsFileEarmarkText,
  BsBoxArrowLeft,
  BsPlusCircle,
  BsPatchCheck,
  BsPeople,
  BsClockHistory,
  BsShieldLock, // Ikon untuk tombol balik ke Admin
} from "react-icons/bs";

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // 1. Deteksi Role & Posisi Halaman
  const isAdmin = user?.role === "admin";
  const isOnAdminRoute = location.pathname.startsWith("/admin");

  // 2. Style Classes
  const linkClasses =
    "flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200";
  const activeLinkClasses = "bg-blue-500 font-semibold shadow-md";
  const getLinkClass = ({ isActive }) =>
    `${linkClasses} ${isActive ? activeLinkClasses : ""}`;

  // 3. Logic Nama User (Ambil nama depan saja biar rapi)
  let displayName = "User";
  if (user?.name) {
    const nameParts = user.name.split(" ");
    displayName = nameParts.length > 1 ? nameParts[0] : user.name;
  }

  return (
    <div className="w-64 bg-blue-700 text-white flex flex-col p-4 shadow-lg min-h-screen">
      {/* === HEADER SIDEBAR === */}
      <div className="mb-10 pt-4 px-2">
        {isAdmin && isOnAdminRoute ? (
          // Header Tampilan Admin
          <>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-sm text-blue-200">Manajemen Desa</p>
          </>
        ) : (
          // Header Tampilan User (atau Admin yg sedang mode User)
          <>
            <h2 className="text-2xl font-bold">Halo, {displayName}</h2>
            <p className="text-sm text-blue-200">
              {isAdmin ? "Administrator" : "Krama Desa"}
            </p>
          </>
        )}
      </div>

      {/* === MENU NAVIGASI === */}
      <nav className="grow flex flex-col space-y-2">
        
        {/* KONDISI 1: Admin sedang di Halaman Admin */}
        {isAdmin && isOnAdminRoute ? (
          <>
            <NavLink to="/admin/krama" className={getLinkClass}>
              <BsPeople size={20} />
              <span>Data Krama</span>
            </NavLink>
            <NavLink to="/admin/tagihan" className={getLinkClass}>
              <BsPlusCircle size={20} />
              <span>Buat Tagihan</span>
            </NavLink>
            <NavLink to="/admin/verifikasi" className={getLinkClass}>
              <BsPatchCheck size={20} />
              <span>Verifikasi</span>
            </NavLink>
            <NavLink to="/admin/laporan" className={getLinkClass}>
              <BsFileEarmarkText size={20} />
              <span>Laporan</span>
            </NavLink>

            {/* Divider */}
            <div className="border-t border-blue-500 my-2"></div>

            {/* Tombol Pindah ke Mode User */}
            <NavLink to="/" className={linkClasses}>
              <BsGrid size={20} />
              <span>Mode User (App)</span>
            </NavLink>
          </>
        ) : (
          // KONDISI 2: User Biasa ATAU Admin di Halaman User
          <>
            <NavLink to="/" end className={getLinkClass}>
              <BsGrid size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/riwayat" className={getLinkClass}>
              <BsClockHistory size={20} />
              <span>Riwayat Pembayaran</span>
            </NavLink>
            <NavLink to="/keluarga" className={getLinkClass} onClick={() => setIsOpen(false)}>
              <BsPeople size={20} />
              <span>Data Keluarga</span>
            </NavLink>

            {/* FITUR KHUSUS: Jika Admin sedang di mode User, munculkan tombol balik */}
            {isAdmin && (
              <>
                <div className="border-t border-blue-500 my-2"></div>
                <NavLink to="/admin" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-800 hover:bg-blue-900 transition-colors duration-200 text-yellow-400 font-medium">
                  <BsShieldLock size={20} />
                  <span>Kembali ke Admin</span>
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>

      {/* === TOMBOL KELUAR === */}
      <div className="mt-10 border-t border-blue-500 pt-4">
        <button
          onClick={logout}
          className={`${linkClasses} w-full text-left`}
        >
          <BsBoxArrowLeft size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;