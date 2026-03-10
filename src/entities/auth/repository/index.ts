import type { GlobalLogin, LoginPayload, LoginResponse, Organizationtype } from "@/@types/auth/login";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContractorApi, deleteContractorApi, fetchAuthStatus, fetchConfirmCode, globalLogin, login, register, registeration, registerOrg, updateContractorApi } from "../api";


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

export const useConfirmCode = () => {
  return useMutation<Organizationtype, Error, any>({
    mutationFn: (code: string) => fetchConfirmCode(code),
  })
}

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
