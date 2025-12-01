import React from "react";
import Sidebar from "./Sidebar"; // Gunakan Sidebar universal
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Cerdas akan otomatis menyesuaikan tampilan */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="grow p-6 md:p-8">
          <Outlet />
        </main>

        <footer className="text-center p-4 text-gray-500 text-sm">
          © 2025 Sistem Iuran Krama Desa Adat Bali. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default UserLayout;