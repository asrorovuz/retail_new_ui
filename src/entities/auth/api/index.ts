import type { GlobalLogin, LoginPayload, LoginResponse, Organizationtype, StatusResponse } from "@/@types/auth/login";
import { AxiosBase } from "@/app/config/axios";
import { pathServices } from "@/entities/path";


export const fetchAuthStatus = async (): Promise<StatusResponse> => {
  const { data } = await AxiosBase.get(pathServices.auth.auth);
  return data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await AxiosBase.post(pathServices.auth.login, payload);
  return data;
};

export const globalLogin = async (payload: GlobalLogin): Promise<Organizationtype> => {
  const { data } = await AxiosBase.post(pathServices.auth.globalLogin, payload);
  return data;
};

export const register = async (payload: GlobalLogin): Promise<Organizationtype> => {
  const { data } = await AxiosBase.post(pathServices.auth.register, payload);
  return data;
};
