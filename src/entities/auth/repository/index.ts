import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchAuthStatus, login } from "../api"
import type { LoginPayload, LoginResponse } from "@/@types/auth/login";

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
