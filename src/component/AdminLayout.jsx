import React from "react";
import Sidebar from "./Sidebar"; 
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>

        <footer className="text-center p-4 text-gray-500 text-sm">
          © 2025 Sistem Iuran Krama Desa Adat Bali. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;