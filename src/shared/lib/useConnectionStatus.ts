import { useEffect } from "react";
import { ipcFetch } from "@/app/config/axios";
import { useOfflineStore } from "@/app/store/useOfflineStore";

const isProduction = import.meta.env.VITE_NODE_ENV === "production";

type ConnectionStatus = {
    online: boolean;
    queueLength: number;
};

export const useConnectionStatus = () => {
    const update = useOfflineStore((s) => s.update);

    useEffect(() => {
        if (!isProduction) return;

        const poll = async () => {
            try {
                const res = await ipcFetch<ConnectionStatus>({
                    url: "hippo/connection/status",
                    method: "GET",
                });
                update(res.online, res.queueLength);
            } catch {
                // Astilectron mavjud bo'lmasa yoki xato bo'lsa — holatni o'zgartirmaymiz
            }
        };

        poll();
        const id = setInterval(poll, 5000);
        return () => clearInterval(id);
    }, [update]);
};
