import type { LoginPayload, LoginResponse, StatusResponse } from "@/@types/auth/login";
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
