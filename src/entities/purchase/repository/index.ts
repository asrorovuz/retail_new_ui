import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerPurchaseApi, updatePurchaseApi, updatePurchasePriceApi } from "../api";
import type { RegisterPurchaseModel } from "@/@types/purchase";

export const useRegisterPurchaseApi = () => {
  return useMutation({
    mutationFn: (data: RegisterPurchaseModel) => registerPurchaseApi(data),
  });
};

export const useUpdatePurchasedApi = () => {
  return useMutation({
    mutationFn: ({id, payload}: any) => updatePurchaseApi(id, payload),
  });
};

export const useUpdatePurchasedPriceApi = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => updatePurchasePriceApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["all-products"]})
    }
  });
};