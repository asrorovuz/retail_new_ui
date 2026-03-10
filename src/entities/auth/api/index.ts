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

export const fetchConfirmCode = async (code: string): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.auth.confirmCode,
    data: {
      username: code
    },
    method: "POST",
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

export const createContractorApi = async (
  payload: any,
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.auth.contractor,
    method: "POST",
    data: payload,
  });
};

export const updateContractorApi = async (
  payload: any,
  id: number
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.auth.updateContractor+id,
    method: "POST",
    data: payload,
  });
};

export const deleteContractorApi = async (
  id: number
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.auth.deleteContractor+id,
    method: "POST",
  });
};
export const registeration = async (
  payload: any
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.auth.registeration,
    method: "POST",
    data: payload,
  });
};

export const registerOrg = async (
  payload: any
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.auth.registerOrgPath,
    method: "POST",
    data: payload,
  });
};

export const registerOrgLocal = async (
  payload: any
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.auth.registerOrgLocalPath,
    method: "POST",
    data: payload,
  });
};