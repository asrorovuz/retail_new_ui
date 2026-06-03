import { useState } from "react";
import { saveAppConfig } from "@/app/config/axios";

// SetupPage — kassa rejimini tanlash ekrani.
// Faqat birinchi marta ishga tushganda (config.json yo'q bo'lganda) ko'rsatiladi.
// Foydalanuvchi rejimni tanlab "Davom etish" bosganidan keyin onComplete() chaqiriladi.

type Mode = "server" | "client";

type Props = {
  // Bu kompyuterning lokal IP si — server modeda foydalanuvchiga ko'rsatiladi
  localIP: string;
  // Mavjud bo'lsa — oldingi config dagi rejim (client mode restart da)
  currentMode?: Mode;
  // Mavjud bo'lsa — oldingi config dagi IP (client mode restart da pre-fill)
  currentIP?: string;
  // Setup tugagach App.tsx da chaqiriladi — asosiy ilovaga o'tish uchun
  onComplete: () => void;
};

export const SetupPage = ({ localIP, currentMode, currentIP, onComplete }: Props) => {
  const [mode, setMode] = useState<Mode | null>(currentMode ?? null);
  const [clientIP, setClientIP] = useState(currentIP ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    // Validatsiya
    if (!mode) return;
    if (mode === "client" && !clientIP.trim()) {
      setError("Server IP manzilini kiriting");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Go main.go ga config yuboramiz:
      // - server modeda: ip = bu kompyuterning lokal IP si
      // - client modeda: ip = foydalanuvchi kiritgan remote IP
      await saveAppConfig({
        mode,
        ip: mode === "server" ? localIP : clientIP.trim(),
      });

      // Go proxy to'liq tayyor bo'lishi uchun kichik pauza
      await new Promise((r) => setTimeout(r, 500));

      // Muvaffaqiyatli — asosiy ilovaga o'tamiz
      onComplete();
    } catch {
      setError("Saqlashda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Sarlavha */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Hippo Retail POS</h1>
          <p className="text-gray-500 mt-1">
            {currentMode === "client"
              ? "Server IP manzilini tasdiqlang yoki yangilang"
              : "Kassa rejimini tanlang"}
          </p>
        </div>

        {/* Rejim tanlash tugmalari */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setMode("server");
              setError("");
            }}
            className={`flex-1 flex flex-col items-center gap-2 py-5 rounded-xl border-2 font-medium transition-all ${
              mode === "server"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="text-3xl">🖥️</span>
            <span>Asosiy Server</span>
            <span className="text-xs font-normal opacity-70">
              Boshqa kassalar shu kompyuterga ulanadi
            </span>
          </button>

          <button
            onClick={() => {
              setMode("client");
              setError("");
            }}
            className={`flex-1 flex flex-col items-center gap-2 py-5 rounded-xl border-2 font-medium transition-all ${
              mode === "client"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="text-3xl">📱</span>
            <span>Klient Kassa</span>
            <span className="text-xs font-normal opacity-70">
              Asosiy serverga ulanadi
            </span>
          </button>
        </div>

        {/* Server mode: lokal IP ko'rsatish */}
        {mode === "server" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700 font-medium">
              Sizning IP manzilingiz:
            </p>
            <p className="text-2xl font-bold text-green-800 mt-1 tracking-wide">
              {localIP || "Aniqlanmadi"}
            </p>
            <p className="text-xs text-green-600 mt-2">
              Klient kassalarda shu IP manzilni kiriting
            </p>
          </div>
        )}

        {/* Client mode: remote server IP kiritish */}
        {mode === "client" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asosiy server IP manzili
            </label>
            <input
              type="text"
              placeholder="192.168.1.45"
              value={clientIP}
              onChange={(e) => {
                setClientIP(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              Faqat IP manzil (masalan: 192.168.1.45)
            </p>
          </div>
        )}

        {/* Xatolik xabari */}
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Saqlash tugmasi — faqat rejim tanlangandan keyin ko'rinadi */}
        {mode && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saqlanmoqda..." : "Davom etish →"}
          </button>
        )}
      </div>
    </div>
  );
};
