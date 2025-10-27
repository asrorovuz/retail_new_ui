import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchAuthStatus, globalLogin, login, register } from "../api"
import type { GlobalLogin, LoginPayload, LoginResponse, Organizationtype } from "@/@types/auth/login";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
  })
}

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: fetchAuthStatus,
  });
};

export const useGlobalLogin = () => {
  return useMutation<Organizationtype, Error, GlobalLogin>({
    mutationFn: globalLogin,
  })
}

export const useRegister = () => {
  return useMutation<Organizationtype, Error, GlobalLogin>({
    mutationFn: register,
  })
}
