// src/component/SidebarUser.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import { BsGrid, BsClockHistory, BsBoxArrowLeft } from "react-icons/bs";
import { useAuth } from "../context/AuthContext"; // <-- 1. Impor useAuth

function SidebarUser() {
  // 2. Ambil 'user' (untuk nama) dan 'logout' (untuk tombol keluar)
  const { user, logout } = useAuth();

  const linkClasses =
    "flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200";
  const activeLinkClasses = "bg-blue-500 font-semibold";

  const getLinkClass = ({ isActive }) =>
    `${linkClasses} ${isActive ? activeLinkClasses : ""}`;

  // 3. Logika untuk mengambil nama (sesuai permintaan Anda)
  let displayName = "Tamu"; // Nama default
  if (user && user.name) {
    const nameParts = user.name.split(" ");
    displayName = nameParts.length > 1 ? nameParts[1] : nameParts[0];
  }

  return (
    <div className="w-64 bg-blue-700 text-white flex flex-col p-4 shadow-lg">
      {/* Header Sidebar */}
      <div className="mb-10 pt-4 px-2">
        {/* 4. Tampilkan nama yang sudah diproses */}
        <h2 className="text-2xl font-bold">Selamat datang, {displayName}</h2>
        <p className="text-sm text-blue-200">Krama Desa</p>
      </div>

      {/* Navigasi Utama */}
      <nav className="grow flex flex-col space-y-2">
        <NavLink to="/" end className={getLinkClass}>
          {" "}
          {/* 'end' penting untuk root path */}
          <BsGrid size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/riwayat" className={getLinkClass}>
          <BsClockHistory size={20} />
          <span>Riwayat Pembayaran</span>
        </NavLink>
      </nav>

      {/* 5. Tombol Keluar (Diperbaiki) */}
      <div className="mt-10">
        <button
          onClick={logout} // Panggil fungsi logout dari Context
          className={`${linkClasses} w-full text-left`} // Buat agar terlihat seperti link
        >
          <BsBoxArrowLeft size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}

export default SidebarUser;
