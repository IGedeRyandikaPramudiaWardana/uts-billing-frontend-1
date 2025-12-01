// src/pages/Verifikasi.jsx

import React, { useState, useEffect } from "react";
// import axios from "axios"; // <-- Hapus axios
import apiClient from "../utils/apiClient"; // <-- Gunakan apiClient

function Verifikasi() {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1. Fungsi untuk mengambil data pending
  const fetchPendingPayments = () => {
    setLoading(true);

    // Gunakan apiClient dan URL relatif
    // Rute ini ('/pembayaran/pending') sudah dilindungi auth:sanctum
    apiClient
      .get("/pembayaran/pending")
      .then((response) => {
        setPendingList(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setLoading(false);
        setError("Gagal mengambil data pending.");
      });
  };

  // 2. Ambil data saat halaman dimuat
  useEffect(() => {
    fetchPendingPayments();
  }, []); // Jalankan sekali

  // 3. Fungsi untuk verifikasi (approve)
  const handleVerifikasi = (id) => {
    setMessage("");
    setError("");

    // Gunakan apiClient dan URL relatif
    // Rute ini ('/pembayaran/verifikasi/{id}') sudah dilindungi auth:sanctum
    apiClient
      .patch(`/pembayaran/verifikasi/${id}`)
      .then((response) => {
        setMessage(response.data.message || "Verifikasi sukses!");
        // Otomatis refresh daftar pending setelah sukses
        fetchPendingPayments();
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error: Gagal memverifikasi.");
      });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Verifikasi Pembayaran</h2>

      {/* Tampilkan pesan sukses/error */}
      {message && <p className="text-center text-green-600 mb-4">{message}</p>}
      {error && <p className="text-center text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-full text-left border-collapse">
          <thead className="border-b-2 border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">
                Nama Krama
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">
                Tagihan ID
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">
                Jumlah Bayar
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">
                Metode
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : pendingList.length > 0 ? (
              pendingList.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  {/* Kita ambil nama dari relasi 'datakrama' */}
                  <td className="p-3">{p.datakrama?.name || p.nik}</td>
                  <td className="p-3">{p.tagihan_id}</td>
                  <td className="p-3">
                    Rp {Number(p.jumlah_bayar).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">{p.metode}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleVerifikasi(p.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      Setujui
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Tidak ada pembayaran untuk diverifikasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Verifikasi;
