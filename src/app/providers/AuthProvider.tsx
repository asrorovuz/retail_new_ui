import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { decode, encode } from "js-base64";
import { AxiosError } from "axios";
import type { LoginPayload } from "@/@types/auth/login";
import { PASSWORD_KEY, TOKEN, USERNAME_KEY } from "../constants/app.constants";
import { useLogin } from "@/entities/auth/repository";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const mutation = useLogin();

  /** 🔹 Login */
  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const res = await mutation.mutateAsync(payload);

        sessionStorage.setItem(USERNAME_KEY, encode(payload.username));
        sessionStorage.setItem(PASSWORD_KEY, encode(payload.password));
        sessionStorage.setItem(
          TOKEN,
          encode(`${payload.username}:${payload.password}`)
        );

        setUser(res);
        setIsAuthenticated(true);
      } catch (err) {
        const error = err as AxiosError;
        console.error("❌ Login error:", error.message);
        throw error;
      }
    },
    [mutation]
  );

  /** 🔹 Logout */
  const logout = useCallback(() => {
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(PASSWORD_KEY);
    sessionStorage.removeItem(TOKEN);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /** 🔹 Refresh holati */
  useEffect(() => {
    const encodedUsername = sessionStorage.getItem(USERNAME_KEY);
    const encodedPassword = sessionStorage.getItem(PASSWORD_KEY);

    if (encodedUsername && encodedPassword) {
      try {
        const username = decode(encodedUsername);

        // 🔹 Faqat localdan tiklaymiz
        setUser({ username });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []); // ❗️ [login] emas, bo‘sh dependency

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
