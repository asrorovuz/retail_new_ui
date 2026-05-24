import { TOKEN } from "@/app/constants/app.constants";
import axios from "axios";

const isProduction = import.meta.env.VITE_NODE_ENV === "production";

export const AxiosBase = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "X-ACCESS-KEY": "LocalPosRetail",
  },
});

AxiosBase.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(TOKEN) || "";
    if (token) {
      config.headers["Authorization"] = `Basic ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// IPC wrapper
export const ipcFetch = async <T>(request: {
  url: string;
  method?: string;
  params?: Record<string, any>;
  data?: any;
  responseType?: "json" | "blob" | "arraybuffer" | "document" | "text";
}): Promise<T> => {
  if (
    !window?.astilectron ||
    typeof window?.astilectron.sendMessage !== "function"
  ) {
    throw new Error("Astilectron is not available");
  }
  const token = sessionStorage.getItem(TOKEN) || "";

  return new Promise<T>((resolve, reject) => {
    window?.astilectron!.sendMessage!(
      {
        name: request.url,
        payload: {
          method: request.method || "GET",
          params: request.params || {},
          data: request.data || null,
          headers: {
            Authorization: `Basic ${token}`,
            "X-ACCESS-KEY": "LocalPosRetail",
          },
        },
      },
      (message) => {
        try {
          if (!message || !message.payload) {
            return reject(new Error("No response from Astilectron"));
          }

          const { status_code, data } = message.payload;

          let result: any = message.payload;
          if (typeof data === "string") {
            try {
              result = JSON.parse(data);
            } catch {
              result = data; // fallback
            }
          }

          // if (status_code === 401) {
          //   sessionStorage.removeItem(TOKEN);
          //   window.location.href = "/login";
          //   return reject("Unauthorized");
          // }

          if (status_code >= 400) {
            return reject(result || "Unknown error");
          }
          resolve(result as T);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
};

// =============================================================
// KASSA CONFIG — server/client rejimi IPC funksiyalari
// =============================================================

// AppConfigResponse — Go main.go dagi "hippo/config/get" handleri qaytaradigan tuzilma
export type AppConfigResponse = {
  configured: boolean;       // config.json mavjudmi?
  mode?: "server" | "client"; // mavjud bo’lsa — qaysi rejim
  ip?: string;               // mavjud bo’lsa — IP manzil
  localIP: string;           // bu kompyuterning lokal IP si (server mode uchun ko’rsatiladi)
};

// getAppConfig — Go dan joriy config ni so’raydi.
// Production (Electron): IPC orqali main.go ga "hippo/config/get" yuboradi.
// Development: setup ekranini ko’rsatmaslik uchun "configured: true" qaytaradi.
export const getAppConfig = (): Promise<AppConfigResponse> => {
  return new Promise((resolve) => {
    if (
      !window?.astilectron ||
      typeof window?.astilectron.sendMessage !== "function"
    ) {
      // Dev mode — setup ekranini o’tkazib yuboramiz
      resolve({ configured: true, localIP: "localhost" });
      return;
    }

    window.astilectron.sendMessage(
      // Payload bo’sh — Go tomonida payload o’qilmaydi
      { name: "hippo/config/get", payload: {} },
      (message: any) => {
        if (message?.payload) {
          resolve(message.payload as AppConfigResponse);
        } else {
          // Javob kelmasdi — xavfsiz default
          resolve({ configured: true, localIP: "localhost" });
        }
      },
    );
  });
};

// saveAppConfig — tanlangan rejim va IP ni Go ga yuboradi, config.json ga yoziladi.
// Go proxyService.SetHost() ni ham yangilaydi — restart kerak emas.
export const saveAppConfig = (config: {
  mode: "server" | "client";
  ip: string;
}): Promise<{ ok: boolean; host: string }> => {
  return new Promise((resolve, reject) => {
    if (
      !window?.astilectron ||
      typeof window?.astilectron.sendMessage !== "function"
    ) {
      // Dev mode — simulyatsiya
      resolve({ ok: true, host: "http://localhost:7071" });
      return;
    }

    window.astilectron.sendMessage(
      // Payload to’g’ridan-to’g’ri AppConfig formatida — Go json.Unmarshal qiladi
      { name: "hippo/config/save", payload: config },
      (message: any) => {
        if (message?.payload?.ok) {
          resolve(message.payload);
        } else {
          reject(new Error("Config saqlashda xatolik"));
        }
      },
    );
  });
};

// 🔹 Avtomatik API so’rov funksiyasi
export const apiRequest = async <T>(request: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, any>;
  data?: any;
  responseType?: "json" | "blob" | "arraybuffer" | "document" | "text";
}): Promise<T | any> => {
  if (isProduction) {
    return ipcFetch<T>(request);
  }

  const response = await AxiosBase.request<T>({
    url: request.url,
    method: request.method || "GET",
    params: request.params,
    data: request.data,
    responseType: request.responseType || "json",
  });

  return response.data;
};