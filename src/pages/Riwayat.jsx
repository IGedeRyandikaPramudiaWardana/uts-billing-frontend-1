import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";
import { BsSearch, BsReceipt } from "react-icons/bs";

function Riwayat() {
  const { user } = useAuth();
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nikInput, setNikInput] = useState(""); // State untuk input manual

  useEffect(() => {
    // 1. Coba Load Otomatis
    if (user?.krama?.nik) {
        setNikInput(user.krama.nik); // Isi input otomatis
        fetchRiwayat(user.krama.nik);
    }
  }, [user]);

  const fetchRiwayat = (nik) => {
    setLoading(true);
    apiClient.get(`/pembayaran/nik/${nik}`)
      .then((res) => {
        setRiwayat(res.data.riwayat);
      })
      .catch(() => {
        // Diam saja jika error, biarkan list kosong
      })
      .finally(() => setLoading(false));
  };

  const handleManualSearch = (e) => {
      e.preventDefault();
      if(nikInput) fetchRiwayat(nikInput);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Pembayaran</h2>
      
      {/* --- FORM PENCARIAN (BACKUP) --- */}
      <form onSubmit={handleManualSearch} className="mb-8 flex gap-2">
        <input 
            type="text" 
            placeholder="Masukkan NIK..."
            value={nikInput}
            onChange={(e) => setNikInput(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition flex items-center">
            <BsSearch className="mr-2"/> Cari
        </button>
      </form>
      {/* ------------------------------- */}

      {loading ? (
         <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : riwayat.length > 0 ? (
        <div className="space-y-4">
           {riwayat.map((r, index) => (
             <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition hover:shadow-md">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${r.keterangan === 'selesai' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <BsReceipt size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1">
                            {new Date(r.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </p>
                        <p className="font-bold text-gray-800">Pembayaran via {r.metode}</p>
                        <p className="text-sm text-gray-500">Ref ID: #{r.id}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 mb-1">Rp {Number(r.jumlah_bayar).toLocaleString("id-ID")}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${r.keterangan === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {r.keterangan === 'selesai' ? 'Lunas' : 'Menunggu Verifikasi'}
                    </span>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Belum ada riwayat pembayaran.</p>
            {nikInput && <p className="text-sm text-red-400 mt-2">Pastikan NIK "{nikInput}" sudah benar.</p>}
        </div>
      )}
    </div>
  );
}

export default Riwayat;