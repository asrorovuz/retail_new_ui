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
    localIP: string;
  }>({
    checked: false,    // boshlang'ich holat — hali tekshirilmagan
    configured: false,
    localIP: "",
  });

  useEffect(() => {
    // Ilova ishga tushganda Go dan config holatini so'raymiz
    getAppConfig().then((cfg: AppConfigResponse) => {
      setSetupState({
        checked: true,
        configured: cfg.configured,
        localIP: cfg.localIP,
      });
    });
  }, []);

  // Config tekshirilgunga qadar — bo'sh ekran (qisqa, sezilarli emas)
  if (!setupState.checked) {
    return null;
  }

  // Config yo'q — foydalanuvchiga rejim tanlash ekranini ko'rsatamiz
  if (!setupState.configured) {
    return (
      <SetupPage
        localIP={setupState.localIP}
        // Setup tugagach — asosiy ilovaga o'tamiz (qayta tekshirishsiz)
        onComplete={() =>
          setSetupState((prev) => ({ ...prev, configured: true }))
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
