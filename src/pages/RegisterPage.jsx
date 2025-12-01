// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  // State Data Form Lengkap
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    nik: "",
    gender: "Laki-laki",
    banjar_id: "",
    status_krama: "krama_desa"
  });
  
  const [banjarList, setBanjarList] = useState([]); // Untuk dropdown banjar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Ambil data Banjar dari backend untuk dropdown
  useEffect(() => {
    apiClient.get("/banjar").then(res => setBanjarList(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
        setError("Password dan Konfirmasi Password tidak sesuai.");
        return;
    }
    setLoading(true);
    setError("");

    apiClient.post("/register", formData)
      .then((response) => {
        // SUKSES: Arahkan ke Halaman Verifikasi
        // Bawa email ke halaman sebelah pakai state
        navigate("/verify-email", { state: { email: formData.email } });
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.data?.errors) {
            setError(Object.values(err.response.data.errors).flat().join(", "));
        } else {
            setError(err.response?.data?.message || "Registrasi Gagal");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Pendaftaran Krama</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- Kolom Kiri: Data Akun --- */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Data Akun</h3>
                <input name="email" type="email" placeholder="Email Aktif" onChange={handleChange} required className="w-full p-3 border rounded" />
                <input name="phone" type="text" placeholder="No. Telepon / WA" onChange={handleChange} required className="w-full p-3 border rounded" />
                <input name="password" type="password" placeholder="Password (Min. 6)" onChange={handleChange} required className="w-full p-3 border rounded" />
                <input name="password_confirmation" type="password" placeholder="Konfirmasi Password" onChange={handleChange} required className="w-full p-3 border rounded" />
            </div>

            {/* --- Kolom Kanan: Data Krama --- */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Identitas Krama</h3>
                <input name="name" type="text" placeholder="Nama Lengkap" onChange={handleChange} required className="w-full p-3 border rounded" />
                <input name="nik" type="text" placeholder="NIK (16 Digit)" onChange={handleChange} required className="w-full p-3 border rounded" />
                
                <select name="gender" onChange={handleChange} className="w-full p-3 border rounded">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>

                <select name="banjar_id" onChange={handleChange} required className="w-full p-3 border rounded">
                    <option value="">-- Pilih Banjar --</option>
                    {banjarList.map(b => (
                        <option key={b.id} value={b.id}>{b.nama_banjar}</option>
                    ))}
                </select>

                <select name="status_krama" onChange={handleChange} className="w-full p-3 border rounded">
                    <option value="krama_desa">Krama Desa (Warga Tetap)</option>
                    <option value="krama_tamiu">Krama Tamiu (Pendatang)</option>
                    <option value="tamiu">Tamu</option>
                </select>
            </div>

            {/* Tombol Submit Full Width */}
            <div className="md:col-span-2 mt-4">
                <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700">
                    {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                </button>
            </div>
        </form>
        
        <p className="text-center mt-4">Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;