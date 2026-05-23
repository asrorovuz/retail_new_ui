import type { RegisterRefundModel } from "@/@types/refund";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCheckRefundApi, operationItemGetApi, registerRefundApi, updateRefundApi } from "../api";

export const useRegisterRefundApi = () => {
  return useMutation({
    mutationFn: (data: RegisterRefundModel) => registerRefundApi(data),
  });
};

export const useCheckRefundApi = (params: string) => {
  return useQuery({
    queryKey: ["check-refund", params],
    queryFn: () => getCheckRefundApi(params),
    enabled: !!params
  });
};

export const useUpdateRefundApi = () => {
  return useMutation({
    mutationFn: ({id, payload}: any) => updateRefundApi(id, payload),
  });
};

export const useOperationItemGetApi = (params: any) => {
  return useQuery({
    queryKey: ["init-settings", params],
    queryFn: () => operationItemGetApi(params),
  });
};