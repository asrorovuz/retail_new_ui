import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerSaleApi } from "../api";
import type { RegisterSaleModel } from "@/@types/sale";

export const useRegisterSellApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterSaleModel) => registerSaleApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [""] });
    },
  });
};
