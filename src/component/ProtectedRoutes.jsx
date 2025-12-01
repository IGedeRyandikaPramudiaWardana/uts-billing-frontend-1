import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoutes({ role }) {
  // 1. Ambil 'loading' dari AuthContext
  const { user, isAuthenticated, loading } = useAuth();

  // 2. TAMBAHKAN INI: Selama AuthContext masih loading,
  //    tampilkan sesuatu (atau jangan tampilkan apa-apa) dan JANGAN lanjut.
  if (loading) {
    return <div>Loading user...</div>; // atau return null;
  }

  // 3. Setelah loading selesai, baru cek token
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 4. Setelah yakin user ada, baru cek role
  if (role && user?.role !== role) {
    // Jika role dibutuhkan dan tidak cocok (misal: 'user' akses '/admin')
    return <Navigate to="/" replace />; // Arahkan ke dashboard user
  }

  // 5. Jika lolos semua, tampilkan halaman (Kelola Krama)
  return <Outlet />;
}
export default ProtectedRoutes;
