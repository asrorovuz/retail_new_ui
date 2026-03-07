import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContractorApi,
  deleteContractorApi,
  fetchAuthStatus,
  globalLogin,
  login,
  register,
  updateContractorApi,
} from "../api";
import type {
  GlobalLogin,
  LoginPayload,
  LoginResponse,
  Organizationtype,
} from "@/@types/auth/login";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
  });
};

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: fetchAuthStatus,
  });
};

export const useGlobalLogin = () => {
  return useMutation<
    Organizationtype,
    Error,
    GlobalLogin & { signal?: AbortSignal }
  >({
    mutationFn: globalLogin,
  });
};

export const useRegister = () => {
  return useMutation<Organizationtype, Error, GlobalLogin>({
    mutationFn: register,
  });
};

export const useCreateContractor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createContractorApi(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["contractor-all"] });
    },
  });
};

export const useUpdateContractor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) =>
      updateContractorApi(data, id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["contractor-all"] });
    },
  });
};

export const useDeleteContractor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteContractorApi(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["contractor-all"] });
    },
  });
};
