import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";
import { BsSearch, BsPerson, BsArrowLeft } from "react-icons/bs";

function BuatTagihan() {
  // --- STATE PENCARIAN ---
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedKrama, setSelectedKrama] = useState(null); // Menyimpan Krama yang dipilih

  // --- STATE FORM TAGIHAN ---
  const [bulan, setBulan] = useState("");
  const [jenisTagihan, setJenisTagihan] = useState("iuran");
  const [jumlah, setJumlah] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- FUNGSI CARI KRAMA ---
  // Menggunakan Debounce (tunggu ketik selesai baru cari) biar tidak spam server
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.length > 2) { // Cari jika minimal 3 huruf
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500); // Delay 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      // Panggil endpoint yang sudah kita update tadi
      const res = await apiClient.get(`/krama?search=${search}`);
      setSearchResults(res.data.data);
    } catch (error) {
      console.error("Gagal mencari", error);
    } finally {
      setIsSearching(false);
    }
  };

  // --- FUNGSI PILIH KRAMA ---
  const handleSelectKrama = (krama) => {
    setSelectedKrama(krama);
    setSearch(""); // Reset search
    setSearchResults([]); // Bersihkan hasil
  };

  // --- FUNGSI RESET PILIHAN ---
  const handleResetSelection = () => {
    setSelectedKrama(null);
    setJumlah("");
    setBulan("");
  };

  // --- FUNGSI SUBMIT TAGIHAN ---
  const handleCreateTagihan = (e) => {
    e.preventDefault();
    
    if (!selectedKrama || !bulan || !jumlah) {
        toast.error("Mohon lengkapi semua data.");
        return;
    }

    const loadingToast = toast.loading("Menyimpan tagihan...");
    setIsLoading(true);

    const dataBaru = {
      nik: selectedKrama.nik, // Ambil NIK dari object yang dipilih
      bulan: bulan,
      jenis_tagihan: jenisTagihan, 
      jumlah: parseInt(jumlah)
    };

    apiClient
      .post("/tagihan", dataBaru)
      .then((response) => {
        setIsLoading(false);
        toast.success(response.data.message || "Tagihan berhasil dibuat!", { id: loadingToast });
        
        // Redirect
        setTimeout(() => navigate("/admin/laporan"), 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        const errMsg = err.response?.data?.message || "Gagal membuat tagihan.";
        toast.error(errMsg, { id: loadingToast });
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* JUDUL HALAMAN */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Buat Tagihan Baru</h1>
        <p className="text-gray-500 text-sm mt-1">Cari Krama terlebih dahulu, lalu buatkan tagihan.</p>
      </div>

      {/* ================= FASE 1: PENCARIAN ================= */}
      {!selectedKrama && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cari Krama (Nama atau NIK)</label>
          
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik nama atau NIK..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
              autoFocus
            />
            <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* LOADING INDICATOR */}
          {isSearching && <p className="text-center text-gray-500 mt-4 text-sm">Mencari data...</p>}

          {/* HASIL PENCARIAN */}
          <div className="mt-4 space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((k) => (
                <div 
                  key={k.id} 
                  onClick={() => handleSelectKrama(k)}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition group"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4 group-hover:bg-blue-200">
                      <BsPerson size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{k.name}</h4>
                      <p className="text-sm text-gray-500">NIK: {k.nik} • {k.banjar?.nama_banjar}</p>
                    </div>
                  </div>
                  <button className="text-sm bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-full font-medium group-hover:bg-blue-600 group-hover:text-white transition">
                    Pilih
                  </button>
                </div>
              ))
            ) : (
              search.length > 2 && !isSearching && (
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                  Data tidak ditemukan.
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ================= FASE 2: FORM TAGIHAN ================= */}
      {selectedKrama && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-fade-in-up">
          
          {/* Header Kartu Terpilih */}
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full text-green-700 mr-3">
                    <BsPerson size={24} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tagihan Untuk:</p>
                    <h2 className="text-xl font-bold text-gray-900">{selectedKrama.name}</h2>
                    <p className="text-sm text-gray-600 font-mono">{selectedKrama.nik}</p>
                </div>
            </div>
            <button onClick={handleResetSelection} className="text-sm text-red-500 hover:text-red-700 hover:underline flex items-center">
                <BsArrowLeft className="mr-1"/> Ganti Orang
            </button>
          </div>

          {/* Form Input */}
          <form onSubmit={handleCreateTagihan} className="space-y-5">
            
            {/* Input Bulan/Tanggal */}
            <div>
              <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Tagihan
              </label>
              <input
                type="date"
                id="bulan"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dropdown Jenis */}
                <div>
                  <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Tagihan
                  </label>
                  <div className="relative">
                      <select
                          id="jenis"
                          value={jenisTagihan}
                          onChange={(e) => setJenisTagihan(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition cursor-pointer"
                      >
                          <option value="iuran">💰 Iuran Wajib</option>
                          <option value="dedosan">⚠️ Dedosan (Denda)</option>
                          <option value="peturunan">🙏 Peturunan</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                  </div>
                </div>

                {/* Input Nominal */}
                <div>
                  <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    id="jumlah"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    placeholder="Contoh: 50000"
                    required
                    min="1000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3.5 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : "Simpan Tagihan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default BuatTagihan;