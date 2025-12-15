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
