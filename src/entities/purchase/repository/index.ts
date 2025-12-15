import { useMutation } from "@tanstack/react-query";
import { registerPurchaseApi } from "../api";
import type { RegisterPurchaseModel } from "@/@types/purchase";

export const useRegisterPurchaseApi = () => {
  return useMutation({
    mutationFn: (data: RegisterPurchaseModel) => registerPurchaseApi(data),
  });
};