import type {
  GlobalLogin,
  LoginPayload,
  LoginResponse,
  Organizationtype,
  StatusResponse,
} from "@/@types/auth/login";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

// 🔹 Auth statusni olish
export const fetchAuthStatus = async (): Promise<StatusResponse> => {
  return await apiRequest<StatusResponse>({
    url: pathServices.auth.auth,
    method: "GET",
  });
};

// 🔹 Login
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return await apiRequest<LoginResponse>({
    url: pathServices.auth.login,
    method: "POST",
    data: payload,
  });
};

// 🔹 Global login
export const globalLogin = async (
  data: GlobalLogin & { signal?: AbortSignal }
): Promise<Organizationtype> => {
  const { signal, ...payload } = data;
  return await apiRequest<Organizationtype>({
    url: pathServices.auth.globalLogin,
    method: "POST",
    data: payload,
  });
};

// 🔹 Register
export const register = async (
  payload: GlobalLogin
): Promise<Organizationtype> => {
  return await apiRequest<Organizationtype>({
    url: pathServices.auth.register,
    method: "POST",
    data: payload,
  });
};
