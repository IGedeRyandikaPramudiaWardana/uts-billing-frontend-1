import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; // Library Toast
import { 
  BsChevronLeft, 
  BsChevronRight, 
  BsPlusLg, 
  BsPencilSquare, 
  BsTrash,
  BsX,
  BsCheckCircleFill, 
  BsClockHistory,
  BsPersonBadge
} from "react-icons/bs";

export default function KelolaKrama() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // --- STATES ---
  const [kramaList, setKramaList] = useState([]);
  const [banjarList, setBanjarList] = useState([]);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    gender: "Laki-laki",
    status_krama: "krama_desa",
    banjar_id: "",
    email: "", // Field baru untuk Edit
    phone: ""  // Field baru untuk Edit
  });
  
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(""); 

  // --- API FUNCTIONS ---

  const fetchKrama = async (page = 1) => {
    try {
      const res = await apiClient.get(`/krama?page=${page}`);
      setKramaList(res.data.data); 
      setPagination({
        currentPage: res.data.current_page,
        lastPage: res.data.last_page,
        total: res.data.total
      });
    } catch (err) {
      toast.error("Gagal memuat data krama.");
    }
  };

  useEffect(() => {
    // Load data awal
    const loadInitialData = async () => {
        try {
            const resBanjar = await apiClient.get("/banjar");
            setBanjarList(resBanjar.data);
            fetchKrama(1);
        } catch (error) {
            console.error("Init Error:", error);
        }
    };
    loadInitialData();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchKrama(newPage);
    }
  };

  // --- ACTIONS (VERIFY & DELETE) ---

  // 1. Fungsi EKSEKUSI Verifikasi (yang dipanggil tombol 'Ya')
  const executeVerify = async (id) => {
    const loadingToast = toast.loading("Memproses...");
    try {
      await apiClient.patch(`/krama/${id}/verify`);
      toast.success("Krama berhasil diverifikasi!", { id: loadingToast });
      fetchKrama(pagination.currentPage);
    } catch (err) {
      toast.error("Gagal memverifikasi data.", { id: loadingToast });
    }
  };

  // 2. Handler Tombol Verifikasi (Munculkan Toast Konfirmasi)
  const handleVerify = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-800">
          Verifikasi data krama ini valid?
        </span>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeVerify(id); // Panggil fungsi eksekusi di atas
            }}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
          >
            Ya, Valid
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
          >
            Batal
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: '❓' });
  };

  // 3. Fungsi EKSEKUSI Hapus (yang dipanggil tombol 'Hapus')
  const executeDelete = async (id) => {
    const loadingToast = toast.loading("Menghapus...");
    try {
      await apiClient.delete(`/krama/${id}`);
      toast.success("Data berhasil dihapus!", { id: loadingToast });
      fetchKrama(pagination.currentPage);
    } catch (err) {
      toast.error("Gagal menghapus data.", { id: loadingToast });
    }
  };

  // 4. Handler Tombol Hapus (Munculkan Toast Konfirmasi)
  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-800">
          Yakin hapus data ini? Permanen.
        </span>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(id); // Panggil fungsi eksekusi di atas
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
          >
            Hapus
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
          >
            Batal
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: '⚠️' });
  };

  // --- FORM HANDLERS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error modal
    const loadingToast = toast.loading("Menyimpan data...");

    try {
      if (editingId) {
        await apiClient.put(`/krama/${editingId}`, formData);
        toast.success("Data berhasil diperbarui!", { id: loadingToast });
      } else {
        await apiClient.post("/krama", formData);
        toast.success(isAdmin ? "Data tersimpan!" : "Data dikirim ke Admin!", { id: loadingToast });
      }
      setIsModalOpen(false);
      fetchKrama(pagination.currentPage);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan data.";
      toast.error(msg, { id: loadingToast });
      setError(msg); // Tampilkan juga di modal
    }
  };

  const openModalAdd = () => {
    setFormData({ 
      name: "", 
      nik: "", 
      gender: "Laki-laki", 
      status_krama: "krama_desa", 
      banjar_id: banjarList[0]?.id || "",
      email: "",
      phone: ""
    });
    setEditingId(null);
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (k) => {
    setFormData({
      name: k.name,
      nik: k.nik,
      gender: k.gender,
      status_krama: k.status_krama,
      banjar_id: k.banjar_id || "",
      email: k.user ? k.user.email : "",
      phone: k.user ? k.user.phone : ""
    });
    setEditingId(k.id);
    setError("");
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-full">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg relative">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            {isAdmin ? "Kelola Seluruh Krama" : "Data Keluarga Saya"}
          </h2>
          
          <button 
            onClick={openModalAdd}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition-all transform hover:scale-105"
          >
            <BsPlusLg className="mr-2" /> 
            {isAdmin ? "Tambah Krama" : "Tambah Keluarga"}
          </button>
        </div>

        {/* TABEL DATA */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Nama / Status</th>
                <th className="p-4">NIK</th>
                <th className="p-4">Banjar</th>
                {isAdmin && <th className="p-4">Dibuat Oleh</th>}
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kramaList.length > 0 ? (
                kramaList.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Status Badge */}
                    <td className="p-4">
                        {k.status_verifikasi === 'terverifikasi' ? (
                            <span className="flex items-center text-green-700 text-xs font-bold uppercase bg-green-100 px-3 py-1 rounded-full w-fit">
                                <BsCheckCircleFill className="mr-1.5"/> Valid
                            </span>
                        ) : (
                            <span className="flex items-center text-yellow-700 text-xs font-bold uppercase bg-yellow-100 px-3 py-1 rounded-full w-fit">
                                <BsClockHistory className="mr-1.5"/> Pending
                            </span>
                        )}
                    </td>

                    <td className="p-4">
                        <div className="font-semibold text-gray-900">{k.name}</div>
                        <div className="text-xs text-gray-500 capitalize mt-0.5">{k.status_krama?.replace('_', ' ')}</div>
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{k.nik}</td>
                    <td className="p-4 text-gray-600">{k.banjar?.nama_banjar || "-"}</td>
                    
                    {/* Created By (Admin Only) */}
                    {isAdmin && (
                        <td className="p-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <BsPersonBadge className="mr-2 text-gray-400"/>
                                {k.pembuat ? k.pembuat.name : <span className="italic text-gray-400">User</span>}
                            </div>
                        </td>
                    )}

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {/* Tombol Verify (Admin Only & Pending Only) */}
                        {isAdmin && k.status_verifikasi === 'pending' && (
                            <button onClick={() => handleVerify(k.id)} className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-lg transition" title="Verifikasi">
                                <BsCheckCircleFill size={18}/>
                            </button>
                        )}

                        <button onClick={() => handleEdit(k)} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-2 rounded-lg transition" title="Edit">
                           <BsPencilSquare size={18} />
                        </button>
                        <button onClick={() => handleDelete(k.id)} className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg transition" title="Hapus">
                           <BsTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 italic bg-gray-50">
                    Belum ada data krama yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <span className="text-sm text-gray-600 font-medium">
              Halaman {pagination.currentPage} dari {pagination.lastPage}
          </span>
          <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)} 
                disabled={pagination.currentPage === 1} 
                className="flex items-center px-4 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                  <BsChevronLeft className="mr-2" /> Sebelumnya
              </button>
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)} 
                disabled={pagination.currentPage === pagination.lastPage} 
                className="flex items-center px-4 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                  Berikutnya <BsChevronRight className="ml-2" />
              </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL FORM ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up transform transition-all">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Data Krama" : "Tambah Krama Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <BsX size={32} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              
              {/* Pesan Error Modal */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm rounded">
                  <p className="font-bold">Gagal!</p>
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Field Utama */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Nama Lengkap</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required placeholder="Contoh: I Wayan Darma" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">NIK (Nomor Induk Kependudukan)</label>
                  <input type="text" value={formData.nik} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required placeholder="16 Digit Angka" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Jenis Kelamin</label>
                        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Status Krama</label>
                        <select value={formData.status_krama} onChange={(e) => setFormData({ ...formData, status_krama: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            <option value="krama_desa">Krama Desa</option>
                            <option value="krama_tamiu">Krama Tamiu</option>
                            <option value="tamiu">Tamu</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Banjar Adat</label>
                    <select value={formData.banjar_id} onChange={(e) => setFormData({ ...formData, banjar_id: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
                        <option value="">-- Pilih Banjar --</option>
                        {banjarList.map(b => (
                            <option key={b.id} value={b.id}>{b.nama_banjar}</option>
                        ))}
                    </select>
                </div>

                {/* EMAIL & HP (Hanya aktif saat Edit & jika user ada) */}
                <div className="pt-2 border-t border-dashed border-gray-300 mt-4">
                    <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Data Akun (Opsional)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Email Login</label>
                            <input 
                                type="email" 
                                value={formData.email} 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Kosongkan jika tidak ada"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">No. Telepon/WA</label>
                            <input 
                                type="text" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="08xxxxxx (Opsional)"
                            />
                        </div>
                    </div>
                    {!editingId && (
                        <p className="text-[10px] text-gray-500 mt-1 italic">*Jika email diisi, akun login otomatis dibuat dengan Password = NIK.</p>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 shadow-md transition transform active:scale-95">
                    Simpan Data
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}