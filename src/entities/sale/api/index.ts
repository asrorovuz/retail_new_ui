import type { PaymeProviderType, RegisterSaleModel } from "@/@types/sale";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { FizcalResponsetype } from "../model";

export const registerSaleApi = async (payload: RegisterSaleModel) => {
  return await apiRequest({
    url: pathServices.sale.register,
    method: "POST",
    data: payload,
  });
};

export const fiscalDeviceApi = async (): Promise<FizcalResponsetype[]> => {
  return await apiRequest({
    url: pathServices.sale.getFiscaldevice,
    method: "GET",
  });
};

export const paymentProviderApi = async (): Promise<PaymeProviderType[]> => {
  return await apiRequest({
    url: pathServices.sale.getPaymentPath,
    method: "GET",
  });
};

export const createFiscalizedApi = async (payload: any) => {
  return await apiRequest({
    url: pathServices.sale.createFiscalized,
    method: "POST",
    data: payload,
  });
};

// Update 
export const updateSellApi = async (id: number | null, payload: any) => {
  return await apiRequest({
    url: pathServices.sale.updateSellPath+id,
    method: "POST",
    data: payload,
  });
};