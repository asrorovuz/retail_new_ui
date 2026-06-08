import { useEffect, useState } from "react";
import { saveAppConfig, scanServers } from "@/app/config/axios";

type Mode = "server" | "client";

type Props = {
  localIP: string;
  currentMode?: Mode;
  currentIP?: string;
  onComplete: () => void;
};

export const SetupPage = ({ localIP, currentMode, currentIP, onComplete }: Props) => {
  const [mode, setMode] = useState<Mode | null>(currentMode ?? null);
  const [clientIP, setClientIP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [scanning, setScanning] = useState(false);
  const [servers, setServers] = useState<string[]>([]);
  const [scanned, setScanned] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const startScan = async () => {
    setScanning(true);
    setServers([]);
    setScanned(false);
    setClientIP("");
    setError("");
    const result = await scanServers();
    setServers(result.servers);
    setScanned(true);
    setScanning(false);
  };

  // Komponent mount bo'lganda client mode allaqachon saqlangan bo'lsa — skan boshlanadi
  useEffect(() => {
    if (currentMode === "client") {
      startScan();
    }
  }, []);

  const handleSelectMode = (selected: Mode) => {
    setMode(selected);
    setError("");
    if (selected === "client") {
      setManualMode(false);
      startScan();
    }
  };

  const handleSave = async () => {
    if (!mode) return;
    if (mode === "client" && !clientIP.trim()) {
      setError("Serverni tanlang yoki IP kiriting");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await saveAppConfig({
        mode,
        ip: mode === "server" ? localIP : clientIP.trim(),
      });
      await new Promise((r) => setTimeout(r, 500));
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
              ? "Server ulanishini tasdiqlang"
              : "Kassa rejimini tanlang"}
          </p>
        </div>

        {/* Rejim tanlash */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleSelectMode("server")}
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
            onClick={() => handleSelectMode("client")}
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

        {/* Server mode */}
        {mode === "server" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700 font-medium">
              Sizning IP manzilingiz:
            </p>
            <p className="text-2xl font-bold text-green-800 mt-1 tracking-wide">
              {localIP || "Aniqlanmadi"}
            </p>
            <p className="text-xs text-green-600 mt-2">
              Klient kassalarda shu IP manzilni tanlang
            </p>
          </div>
        )}

        {/* Client mode */}
        {mode === "client" && (
          <div className="mb-6">
            {/* Skanerlash jarayoni */}
            {scanning && (
              <div className="flex flex-col items-center justify-center py-6 gap-3 text-gray-500">
                <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm">Serverlar qidirilmoqda...</span>
              </div>
            )}

            {/* Topilgan serverlar ro'yxati */}
            {!scanning && scanned && !manualMode && (
              <>
                {servers.length > 0 ? (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Topilgan serverlar:
                    </p>
                    <div className="flex flex-col gap-2 mb-4">
                      {servers.map((ip) => (
                        <button
                          key={ip}
                          onClick={() => setClientIP(ip)}
                          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-left transition-all ${
                            clientIP === ip
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full flex-shrink-0 ${clientIP === ip ? "bg-blue-500" : "bg-gray-300"}`} />
                          <span className="font-mono text-base">{ip}</span>
                          {currentIP === ip && (
                            <span className="ml-auto text-xs text-gray-400">oxirgi</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-5 text-gray-500 bg-gray-50 rounded-xl mb-4">
                    <span className="text-2xl">⚠️</span>
                    <span className="text-sm">Server topilmadi</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={startScan}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <span>🔄</span> Qayta skanerlash
                  </button>
                  <button
                    onClick={() => { setManualMode(true); setClientIP(currentIP ?? ""); }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <span>✏️</span> IP qo'lda kiriting
                  </button>
                </div>
              </>
            )}

            {/* Qo'lda IP kiritish */}
            {!scanning && manualMode && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => { setManualMode(false); setClientIP(""); }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ← Orqaga
                  </button>
                  <span className="text-sm font-medium text-gray-700">IP manzilni kiriting</span>
                </div>
                <input
                  type="text"
                  placeholder="192.168.1.45"
                  value={clientIP}
                  onChange={(e) => { setClientIP(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Faqat IP manzil (masalan: 192.168.1.45)
                </p>
              </>
            )}
          </div>
        )}

        {/* Xatolik */}
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Saqlash tugmasi */}
        {mode && !scanning && (
          <button
            onClick={handleSave}
            disabled={loading || (mode === "client" && !clientIP.trim())}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Saqlanmoqda..." : "Davom etish →"}
          </button>
        )}
      </div>
    </div>
  );
};
