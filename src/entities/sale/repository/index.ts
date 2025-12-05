import { useMutation, useQuery } from "@tanstack/react-query";
import { createFiscalizedApi, fiscalDeviceApi, paymentProviderApi, registerSaleApi } from "../api";
import type { RegisterSaleModel } from "@/@types/sale";

export const useRegisterSellApi = () => {
  return useMutation({
    mutationFn: (data: RegisterSaleModel) => registerSaleApi(data),
  });
};

export const useFescalDeviceApi = (fiscalizedModal?: boolean) => {
  return useQuery({
    queryKey: ["fiscalized"],
    queryFn: fiscalDeviceApi,
    enabled: !!fiscalizedModal,
  });
};

export const usePaymentProviderApi = () => {
  return useQuery({
    queryKey: ["payment-provider"],
    queryFn: paymentProviderApi,
  });
};

export const useCreateFiscalizedApi = () => {
  return useMutation({
    mutationFn: (data: any) => createFiscalizedApi(data),
  });
};
