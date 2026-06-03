import { useEffect, useState } from "react";
import { AuthProvider } from "./providers";
import MessageDispatcher from "@/shared/lib/dispatcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./config/routes";
import { queryConfig } from "./config/app.config";
import { KeyboardProvider } from "./providers/KeyboardProvider";
import { AppExitConfirmModal } from "@/features/modals";
import { getAppConfig } from "./config/axios";
import type { AppConfigResponse } from "./config/axios";
import { SetupPage } from "@/pages/setup/SetupPage";

function App() {
  const queryClient = new QueryClient(queryConfig);

  // setupState — ilovaning holatini boshqaradi:
  // checked: false  → hali config tekshirilmagan (yuklanmoqda)
  // checked: true, configured: false → config.json yo'q → SetupPage ko'rsatiladi
  // checked: true, configured: true  → config bor → asosiy ilova ko'rsatiladi
  const [setupState, setSetupState] = useState<{
    checked: boolean;
    configured: boolean;
    setupCompleted: boolean;
    mode?: "server" | "client";
    ip?: string;
    localIP: string;
  }>({
    checked: false,
    configured: false,
    setupCompleted: false,
    localIP: "",
  });

  useEffect(() => {
    // Ilova ishga tushganda Go dan config holatini so'raymiz
    getAppConfig().then((cfg: AppConfigResponse) => {
      setSetupState({
        checked: true,
        configured: cfg.configured,
        setupCompleted: false,
        mode: cfg.mode,
        ip: cfg.ip,
        localIP: cfg.localIP,
      });
    });
  }, []);

  // Config tekshirilgunga qadar — bo'sh ekran (qisqa, sezilarli emas)
  if (!setupState.checked) {
    return null;
  }

  // SetupPage ko'rsatish shartlari:
  // 1. Birinchi marta (config.json yo'q)
  // 2. Client mode — har restart da IP ni tasdiqlash/o'zgartirish imkoniyati
  // (setupCompleted = true bo'lsa, bu sessiyada setup o'tgan, asosiy ilovaga o'tamiz)
  if (!setupState.setupCompleted && (!setupState.configured || setupState.mode === "client")) {
    return (
      <SetupPage
        localIP={setupState.localIP}
        currentMode={setupState.mode}
        currentIP={setupState.ip}
        onComplete={() =>
          setSetupState((prev) => ({ ...prev, setupCompleted: true }))
        }
      />
    );
  }

  // Config bor — odatdagi asosiy ilova
  return (
    <MessageDispatcher>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppRouter />
            <AppExitConfirmModal />
          </AuthProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </MessageDispatcher>
  );
}

export default App;
