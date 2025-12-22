import { useMutation } from "@tanstack/react-query";
import { registerPurchaseApi, updatePurchaseApi } from "../api";
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