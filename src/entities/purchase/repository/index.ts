import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getContractorByIdApi,
  registerPurchaseApi,
  updateOtherPurchasePriceApi,
  updatePurchaseApi,
  updatePurchasePriceApi,
} from "../api";
import type { RegisterPurchaseModel } from "@/@types/purchase";

export const useContractorByIdApi = (
  id: number | null,
) => {
  return useQuery({
    queryKey: ["contractor-products-id", id],
    queryFn: () => getContractorByIdApi(id),
    enabled: !!id,
  });
};

export const useRegisterPurchaseApi = () => {
  return useMutation({
    mutationFn: (data: RegisterPurchaseModel) => registerPurchaseApi(data),
  });
};

export const useUpdatePurchasedApi = () => {
  return useMutation({
    mutationFn: ({ id, payload }: any) => updatePurchaseApi(id, payload),
  });
};

export const useUpdatePurchasedPriceApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => updatePurchasePriceApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};

export const useOtherUpdatePurchasedPriceApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, id }: { payload: any; id: number }) =>
      updateOtherPurchasePriceApi(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};
