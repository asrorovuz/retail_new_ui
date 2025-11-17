import {
  TOKEN,
} from "@/app/constants/app.constants";
import axios from "axios";
// import { useAuthContext } from "@/app/providers/AuthProvider";

const isProduction = import.meta.env.VITE_NODE_ENV === "production";
// const MAX_RETRIES = 3; // 🔹 maksimal so‘rov urinishlar soni
// let isRedirecting = false;

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
    // 🔸 har bir so‘rovga retry hisoblagichini qo‘shamiz
    // (config as any).__retryCount = (config as any).__retryCount || 0;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 401 va retry uchun interceptor
// AxiosBase.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const { logout } = useAuthContext();
//     const status = error?.response?.status;
//     const config = error.config;

//     // 🔸 401 bo‘lsa, login sahifasiga yo‘naltirish (faqat 1 marta)
//     if (status === 401 && !isRedirecting) {
//       isRedirecting = true;
//       logout();

//       setTimeout(() => {
//         window.location.replace("/login");
//       }, 300);

//       return Promise.reject(error);
//     }

//     // 🔸 Agar tarmoq xatosi yoki server xatosi (5xx) bo‘lsa — retry qilish
//     const shouldRetry =
//       (!status || (status >= 500 && status < 600)) &&
//       (config as any).__retryCount < MAX_RETRIES;

//     if (shouldRetry) {
//       (config as any).__retryCount += 1;
//       console.warn(
//         `🔁 Retry ${(config as any).__retryCount}/${MAX_RETRIES} → ${
//           config.url
//         }`
//       );
//       await new Promise((r) => setTimeout(r, 500)); // 0.5 soniya kutish
//       return AxiosBase(config); // qayta urinish
//     }

//     return Promise.reject(error);
//   }
// );

// IPC wrapper
export const ipcFetch = async <T>(request: {
  url: string;
  method?: string;
  params?: Record<string, any>;
  data?: any;
  responseType?: "json" | "blob" | "arraybuffer" | "document" | "text";
}): Promise<T> => {
  if (
    !window.astilectron ||
    typeof window.astilectron.sendMessage !== "function"
  ) {
    throw new Error("Astilectron is not available");
  }
  const token = sessionStorage.getItem(TOKEN) || "";
  return new Promise<T>((resolve, reject) => {
    window.astilectron!.sendMessage!(
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

          let result: any = data;
          if (typeof data === "string") {
            try {
              result = JSON.parse(data);
            } catch {
              result = data; // fallback
            }
          }
          if (status_code >= 400) {
            return reject(result || "Unknown error");
          }
          resolve(result as T);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

// 🔹 Avtomatik API so‘rov funksiyasi
export const apiRequest = async <T>(request: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, any>;
  data?: any;
  responseType?: "json" | "blob" | "arraybuffer" | "document" | "text";
}): Promise<T> => {
  if (isProduction) {
    return await ipcFetch<T>(request);
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
