import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchAuthStatus, fetchConfirmCode, globalLogin, login, register, registeration, registerOrg } from "../api"
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

export const useConfirmCode = () => {
  return useMutation<Organizationtype, Error, any>({
    mutationFn: (code: string) => fetchConfirmCode(code),
  })
}

export const useGlobalLogin = () => {
  return useMutation<Organizationtype, Error, GlobalLogin & { signal?: AbortSignal }>({
    mutationFn: globalLogin,
  })
}

export const useRegister = () => {
  return useMutation<Organizationtype, Error, GlobalLogin>({
    mutationFn: register,
  })
}

export const useRegisteration = () => {
  return useMutation<any, Error, any>({
    mutationFn: registeration,
  })
}

export const useRegisterOrg = () => {
  return useMutation<any, Error, any>({
    mutationFn: registerOrg,
  })
}

export const useRegisterOrgLocal = () => {
  return useMutation<any, Error, any>({
    mutationFn: registerOrg,
  })
}
