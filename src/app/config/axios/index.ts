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
  (error) => Promise.reject(error)
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
