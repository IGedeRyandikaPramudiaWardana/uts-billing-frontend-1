import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowLeft, BsCreditCard, BsQrCode, BsCashStack, BsClipboard } from "react-icons/bs";
import apiClient from "../utils/apiClient";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";

function FormPembayaran() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  const [metode, setMetode] = useState("QRIS"); // Default QRIS
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  const daftarBank = [
    { kode: "BPD", nama: "BPD Bali", norek: "010 222 333 444", pemilik: "Desa Adat" },
    { kode: "BRI", nama: "BRI", norek: "1122 3344 5566", pemilik: "Desa Adat" },
  ];

  useEffect(() => {
    if (!data) navigate("/");
    // Generate QR Data Static
    if(data) {
        const payload = `TAGIHAN-${data.tagihan.id}-${data.tagihan.jumlah}`;
        setQrCodeData(payload);
    }
  }, [data]);

  if (!data) return null;

  const { identitas, tagihan } = data;

  const handleBayar = async () => {
    if (metode === "Transfer" && !bank) {
        toast.error("Silakan pilih bank tujuan.");
        return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Mengirim bukti pembayaran...");

    try {
      await apiClient.post("/pembayaran", {
        tagihan_id: tagihan.id,
        jumlah_bayar: tagihan.jumlah,
        metode: metode === "Transfer" ? `Transfer ${bank}` : metode,
      });
      
      toast.success("Berhasil! Menunggu verifikasi admin.", { id: loadingToast });
      setTimeout(() => navigate("/riwayat"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memproses.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor rekening disalin!");
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-gray-600 hover:text-blue-600 transition">
        <BsArrowLeft className="mr-2"/> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Struk */}
        <div className="bg-blue-600 p-6 text-white text-center">
            <h2 className="text-xl font-bold">Konfirmasi Pembayaran</h2>
            <p className="text-blue-100 text-sm mt-1">Desa Adat Suka Maju</p>
            <div className="mt-4">
                <p className="text-blue-200 text-xs uppercase tracking-wide">Total Tagihan</p>
                <p className="text-3xl font-bold font-mono">Rp {Number(tagihan.jumlah).toLocaleString("id-ID")}</p>
            </div>
        </div>

        <div className="p-6">
            {/* Rincian */}
            <div className="space-y-3 mb-6 border-b pb-6 border-dashed border-gray-300">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Nama Krama</span>
                    <span className="font-semibold text-gray-800">{identitas.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Jenis Tagihan</span>
                    <span className="font-semibold text-gray-800 capitalize">{tagihan.jenis_tagihan}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bulan</span>
                    <span className="font-semibold text-gray-800">
                        {new Date(tagihan.tgl_tagihan).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Pilihan Metode */}
            <h3 className="text-sm font-bold text-gray-700 mb-3">Pilih Metode Pembayaran</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
                {['QRIS', 'Transfer', 'Cash'].map((m) => (
                    <button
                        key={m}
                        onClick={() => setMetode(m)}
                        className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${
                            metode === m 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {m === 'QRIS' && <BsQrCode size={20}/>}
                        {m === 'Transfer' && <BsCreditCard size={20}/>}
                        {m === 'Cash' && <BsCashStack size={20}/>}
                        {m}
                    </button>
                ))}
            </div>

            {/* Konten Dinamis Berdasarkan Metode */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                {metode === "QRIS" && (
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                            <QRCodeCanvas value={qrCodeData} size={160} />
                        </div>
                        <p className="text-xs text-gray-500">Scan QRIS ini menggunakan E-Wallet Anda</p>
                    </div>
                )}

                {metode === "Transfer" && (
                    <div className="space-y-3">
                        {daftarBank.map((b) => (
                            <div key={b.kode} onClick={() => setBank(b.kode)} className={`p-3 rounded border cursor-pointer flex justify-between items-center ${bank === b.kode ? 'bg-white border-blue-500 shadow-sm' : 'border-transparent hover:bg-white'}`}>
                                <div>
                                    <p className="font-bold text-sm">{b.nama}</p>
                                    <p className="text-xs text-gray-500">{b.pemilik}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-sm font-semibold">{b.norek}</p>
                                    <button onClick={(e) => { e.stopPropagation(); copyToClipboard(b.norek); }} className="text-[10px] text-blue-600 hover:underline flex items-center justify-end gap-1">
                                        <BsClipboard/> Salin
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {metode === "Cash" && (
                    <div className="text-center text-gray-600 text-sm">
                        Silakan bayar langsung ke Kantor LPD atau Petugas Pungut Desa. <br/>
                        <span className="font-bold text-orange-600">Status akan Pending sampai petugas memverifikasi.</span>
                    </div>
                )}
            </div>

            <button 
                onClick={handleBayar}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
            >
                {loading ? "Memproses..." : `Konfirmasi Bayar Rp ${Number(tagihan.jumlah).toLocaleString("id-ID")}`}
            </button>
        </div>
      </div>
    </div>
  );
}

export default FormPembayaran;