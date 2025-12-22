import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { RegisterPurchaseModel } from "@/@types/purchase";

export const registerPurchaseApi = async (payload: RegisterPurchaseModel) => {
  return await apiRequest({
    url: pathServices.purchase.register,
    method: "POST",
    data: payload,
  });
};

// Update
export const updatePurchaseApi = async (id: number | null, payload: any) => {
  return await apiRequest({
    url: pathServices.purchase.updatePurchasePath + id,
    method: "POST",
    data: payload,
  });
};