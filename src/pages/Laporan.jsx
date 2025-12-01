import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient"; 
import { BsTrash } from "react-icons/bs";
import toast from "react-hot-toast"; // Gunakan Toast

function Laporan() {
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Ambil semua data tagihan
  const fetchLaporan = () => {
    setLoading(true);
    apiClient
      .get("/tagihan")
      .then((res) => {
        setLaporanList(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal mengambil data laporan.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  // 🗑️ Hapus satu tagihan (Dengan Toast Konfirmasi)
  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-800">
          Hapus tagihan ini?
        </span>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(id);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
          >
            Hapus
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">
            Batal
          </button>
        </div>
      </div>
    ));
  };

  const executeDelete = (id) => {
    const loadingToast = toast.loading("Menghapus...");
    apiClient
      .delete(`/tagihan/${id}`)
      .then((res) => {
        toast.success("Tagihan dihapus", { id: loadingToast });
        fetchLaporan();
      })
      .catch((err) => {
        toast.error("Gagal menghapus.", { id: loadingToast });
      });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Laporan Tagihan</h2>
        {/* Tombol Reset sudah DIHAPUS dari sini */}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase">Nama Krama</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase">Bulan</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase">Jumlah</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase">Status</th>
              <th className="p-4 text-sm font-bold text-gray-600 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : laporanList.length > 0 ? (
              laporanList.map((tagihan) => (
                <tr key={tagihan.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{tagihan.datakrama?.name || "N/A"}</td>
                  <td className="p-4 text-gray-600">{tagihan.bulan}</td>
                  <td className="p-4 font-mono font-medium">
                    Rp {Number(tagihan.jumlah).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    {tagihan.pembayaran ? (
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                          tagihan.pembayaran.keterangan === "selesai"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tagihan.pembayaran.keterangan === "selesai"
                          ? "Lunas"
                          : "Pending"}
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide">
                        Belum Bayar
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {/* Tombol hapus hanya muncul jika tagihan BELUM punya relasi pembayaran */}
                    {!tagihan.pembayaran && (
                      <button
                        onClick={() => handleDelete(tagihan.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                        title="Hapus Tagihan"
                      >
                        <BsTrash size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                  Tidak ada data tagihan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Laporan;