// src/pages/Tagihan.jsx (Digunakan untuk Admin Kasir)

import React, { useState } from "react";
import {
  BsSearch,
  BsExclamationTriangleFill,
  BsCheckCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // <-- Hapus axios
import apiClient from "../utils/apiClient"; // <-- Gunakan apiClient
import { useAuth } from "../context/AuthContext";

// --- Komponen KartuTagihan ---
// PERBAIKAN: Data hardcoded dihapus dan diganti dengan data dari props
const KartuTagihan = ({ tagihan, total, status }) => {
  // Cek status pembayaran
  const isLunas = status === "Lunas" || status === "selesai";

  // Gunakan data dari props, fallback ke 0 jika tidak ada
  const dedosan = tagihan?.dedosan || 0;
  const peturunan = tagihan?.peturunan || 0;
  const totalTagihan = total || 0;

  return (
    <div
      className={`border rounded-lg p-6 mt-6 ${
        isLunas ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
      }`}
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold text-gray-900">
          {/* Tambahkan Tanda (?) agar tidak error jika tagihan null */}
          Tagihan #{tagihan?.id || "N/A"} -{" "}
          {tagihan?.created_at
            ? new Date(tagihan.created_at).toLocaleDateString("id-ID")
            : "Tanggal Tidak Ada"}
        </h4>
        {isLunas ? (
          <span className="flex items-center text-green-600 font-bold">
            <BsCheckCircleFill className="mr-2" />
            Lunas
          </span>
        ) : (
          <span className="flex items-center text-red-600 font-bold">
            <BsExclamationTriangleFill className="mr-2" />
            Belum Bayar
          </span>
        )}
      </div>
      <div className="mt-4 space-y-2 text-gray-700">
        <p>Dedosan: Rp {dedosan.toLocaleString("id-ID")}</p>
        <p>Peturunan: Rp {peturunan.toLocaleString("id-ID")}</p>
      </div>
      <div
        className={`mt-4 border-t pt-4 ${
          isLunas ? "border-green-200" : "border-red-200"
        }`}
      >
        <p className="text-lg font-bold text-right text-gray-900">
          Total: Rp {totalTagihan.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
};
// --- Batas KartuTagihan ---

// === KOMPONEN UTAMA ===
function Tagihan() {
  const [nik, setNik] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!nik) return;
    setLoading(true);
    setSearchResult(null);
    setMessage("");

    // PERBAIKAN: Gunakan apiClient dan URL relatif
    // PASTIKAN RUTE INI ADA DI routes/api.php! (Lihat catatan di bawah)
    apiClient
      .get(`/cari-krama-nik/${nik}`)
      .then((response) => {
        const data = response.data;
        if (!data.identitas) {
          setLoading(false);
          setMessage("Error: Data Krama tidak ditemukan.");
          setSearchResult(null);
        } else {
          setLoading(false);
          setSearchResult(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Data Krama tidak ditemukan";
        setMessage(`Error: ${errorMessage}`);
        setSearchResult(null);
      });
  };

  const handleLanjutBayar = () => {
    if (!searchResult) return;
    // Arahkan ke rute /admin/form-pembayaran
    navigate("/admin/form-pembayaran", { state: { data: searchResult } });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Dashboard Pembayaran Krama Desa
        </h1>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder="Masukkan NIK Krama..."
            className="flex-1 p-4 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center bg-blue-600 text-white px-6 py-4 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
          >
            <BsSearch className="mr-2" />
            {loading ? "Mencari..." : "Cari"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        {searchResult && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div>
              <label className="text-sm font-medium text-gray-500">Nama</label>
              <p className="text-2xl font-semibold text-gray-900">
                {searchResult.identitas.name}
              </p>
            </div>
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="text-lg text-gray-700 capitalize">
                {searchResult.identitas.status}
              </p>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-8">
              Daftar Tagihan:
            </h3>

            {/* PERBAIKAN BUG: 
              Data dari searchResult (tagihan_terbuka, total_tagihan, status_pembayaran) 
              sekarang diteruskan ke KartuTagihan.
            */}
            <KartuTagihan
              tagihan={searchResult.tagihan_terbuka}
              total={searchResult.total_tagihan}
              status={searchResult.status_pembayaran}
            />

            {/* PERBAIKAN LOGIKA: 
              Tampilkan tombol jika status BUKAN "Lunas" atau "selesai"
            */}
            {searchResult.status_pembayaran !== "Lunas" &&
              searchResult.status_pembayaran !== "selesai" && (
                <button
                  onClick={handleLanjutBayar}
                  className="w-full p-4 mt-8 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Lanjut ke Form Pembayaran
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tagihan;
