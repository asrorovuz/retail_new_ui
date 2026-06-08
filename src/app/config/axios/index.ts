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

const BINARY_PREFIX = "__binary__:";

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

          // Binary response (base64-encoded by Go proxy)
          if (typeof data === "string" && data.startsWith(BINARY_PREFIX)) {
            if (status_code >= 400) {
              return reject(new Error(`HTTP error ${status_code}`));
            }
            const base64 = data.slice(BINARY_PREFIX.length);
            const binaryStr = atob(base64);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }
            if (request.responseType === "blob") {
              return resolve(new Blob([bytes]) as unknown as T);
            }
            return resolve(bytes.buffer as unknown as T);
          }

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

// Go IPC javobini parse qilish:
// Regular API: { status_code, data: "json-string" }
// Config IPC:  to’g’ridan-to’g’ri { configured, localIP, ... }
// Ikki formatni ham qo’llab-quvvatlaydi
const parseIpcPayload = (message: any): any => {
  if (!message?.payload) return null;
  const raw = message.payload;
  if (typeof raw?.data === "string") {
    try { return JSON.parse(raw.data); } catch { return raw; }
  }
  return raw;
};

// getAppConfig — joriy config holatini so’raydi.
// Astilectron: IPC orqali Go main.go ga "hippo/config/get" yuboradi.
// Web: localStorage dan o’qiydi.
export const getAppConfig = (): Promise<AppConfigResponse> => {
  return new Promise((resolve) => {
    if (
      !window?.astilectron ||
      typeof window?.astilectron.sendMessage !== "function"
    ) {
      // Web mode — localStorage dan o’qiymiz
      const saved = localStorage.getItem("hippo_app_config");
      if (saved) {
        try {
          const cfg = JSON.parse(saved);
          resolve({
            configured: true,
            localIP: cfg.localIP ?? "",
            mode: cfg.mode,
            ip: cfg.ip,
          });
        } catch {
          resolve({ configured: false, localIP: window.location.hostname });
        }
      } else {
        resolve({ configured: false, localIP: window.location.hostname });
      }
      return;
    }

    window.astilectron.sendMessage(
      // Payload bo’sh — Go tomonida payload o’qilmaydi
      { name: "hippo/config/get", payload: {} },
      (message: any) => {
        const parsed = parseIpcPayload(message);
        if (parsed) {
          resolve(parsed as AppConfigResponse);
        } else {
          // Go javob bermadi — xavfsiz: setup ko’rsatish (configured: false)
          resolve({ configured: false, localIP: "" });
        }
      },
    );
  });
};

// scanServers — lokal tarmoqda HippoService ishlab turgan serverlarni qidiradi.
export const scanServers = (): Promise<{ servers: string[] }> => {
  return new Promise((resolve) => {
    if (
      !window?.astilectron ||
      typeof window?.astilectron.sendMessage !== "function"
    ) {
      resolve({ servers: [] });
      return;
    }
    window.astilectron.sendMessage(
      { name: "hippo/servers/scan", payload: {} },
      (message: any) => {
        const parsed = parseIpcPayload(message);
        resolve({ servers: parsed?.servers ?? [] });
      },
    );
  });
};

// saveAppConfig — tanlangan rejim va IP ni saqlaydi.
// Astilectron: Go ga yuboradi, config.json ga yoziladi.
// Web: localStorage ga yozadi va kerak bo’lsa Axios baseURL ni yangilaydi.
export const saveAppConfig = (config: {
  mode: "server" | "client";
  ip: string;
}): Promise<{ ok: boolean; host: string }> => {
  return new Promise((resolve, reject) => {
    if (
      !window?.astilectron ||
      typeof window?.astilectron.sendMessage !== "function"
    ) {
      // Web mode — localStorage ga saqlaymiz
      try {
        const toSave = {
          mode: config.mode,
          ip: config.ip,
          localIP: window.location.hostname,
        };
        localStorage.setItem("hippo_app_config", JSON.stringify(toSave));

        // Client modeda Axios baseURL ni remote serverga yo’naltiramiz
        if (config.mode === "client" && config.ip) {
          const currentUrl = new URL(import.meta.env.VITE_BASE_URL);
          AxiosBase.defaults.baseURL = `http://${config.ip}:${currentUrl.port}`;
        }

        const host =
          config.mode === "client"
            ? `http://${config.ip}:${new URL(import.meta.env.VITE_BASE_URL).port}`
            : import.meta.env.VITE_BASE_URL;

        resolve({ ok: true, host });
      } catch {
        reject(new Error("Config saqlashda xatolik"));
      }
      return;
    }

    window.astilectron.sendMessage(
      // Payload to’g’ridan-to’g’ri AppConfig formatida — Go json.Unmarshal qiladi
      { name: "hippo/config/save", payload: config },
      (message: any) => {
        const parsed = parseIpcPayload(message);
        if (parsed?.ok) {
          resolve(parsed);
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