import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext"; // Ambil data user login
import { BsWallet2, BsQrCode, BsSearch, BsArrowRight } from "react-icons/bs";

export default function UserDashboard() {
  const { user } = useAuth(); // Ambil user yang sedang login
  const navigate = useNavigate();

  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nikInput, setNikInput] = useState("");

  // --- AUTOMATIC LOAD ---
  // Jika user login punya data krama terkait, langsung cari tagihannya
  useEffect(() => {
    if (user?.krama?.nik) {
      fetchTagihan(user.krama.nik);
    }
  }, [user]);

  const fetchTagihan = async (targetNik) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/cari-krama-nik/${targetNik}`);
      setSearchResult(res.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if(nikInput) fetchTagihan(nikInput);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* 1. HERO SECTION & GREETING */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-blue-200 font-medium mb-1">Om Swastyastu,</p>
            <h1 className="text-3xl font-bold mb-4">
                {searchResult ? searchResult.identitas.name : (user?.name || "Krama Desa")}
            </h1>
            
            {searchResult && (
                <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-4 py-2">
                    <p className="text-xs text-blue-100 uppercase tracking-wider">Total Tagihan Aktif</p>
                    <p className="text-2xl font-bold font-mono mt-1">
                        Rp {searchResult.total_tagihan.toLocaleString("id-ID")}
                    </p>
                </div>
            )}
        </div>
        {/* Hiasan Background */}
        <BsWallet2 className="absolute -right-4 -bottom-8 text-white/10 text-[150px] rotate-[-15deg]" />
      </div>

      {/* 2. SEARCH BAR (Hanya muncul jika data tidak auto-load atau ingin cari orang lain) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center gap-2">
        <input 
            type="text" 
            placeholder="Cari tagihan keluarga lain (Masukkan NIK)..." 
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            value={nikInput}
            onChange={(e) => setNikInput(e.target.value)}
        />
        <button 
            onClick={handleManualSearch}
            className="bg-blue-100 text-blue-600 p-2.5 rounded-lg hover:bg-blue-200 transition"
        >
            <BsSearch />
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 animate-pulse">Memuat data tagihan...</div>
      ) : searchResult ? (
        <div>
            {/* Status Banjar */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold text-gray-800">Daftar Tagihan</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {searchResult.identitas.banjar} • {searchResult.identitas.status.replace('_', ' ')}
                </span>
            </div>

            {/* List Kartu Tagihan */}
            {searchResult.tagihan.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResult.tagihan.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            {/* Garis indikator kiri */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${t.jenis_tagihan === 'iuran' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                            
                            <div className="flex justify-between items-start mb-4 pl-2">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                                        {new Date(t.tgl_tagihan).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
                                    </p>
                                    <h4 className="text-lg font-bold text-gray-800 capitalize">
                                        {t.jenis_tagihan}
                                    </h4>
                                </div>
                                <div className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">
                                    BELUM BAYAR
                                </div>
                            </div>

                            <div className="flex justify-between items-end pl-2">
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">
                                        Rp {Number(t.jumlah).toLocaleString("id-ID")}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => navigate("/form-pembayaran", { state: { data: { ...searchResult, tagihan: t } } })}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    Bayar <BsArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BsWallet2 size={28}/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Tidak Ada Tagihan</h3>
                    <p className="text-gray-500">Hebat! Anda tidak memiliki tunggakan iuran saat ini.</p>
                </div>
            )}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
            Silakan cari NIK untuk melihat tagihan.
        </div>
      )}
    </div>
  );
}