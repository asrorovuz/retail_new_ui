import type { RegisterSaleModel } from "@/@types/sale";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

export const registerSaleApi = async (payload: RegisterSaleModel) => {
  return await apiRequest({
    url: pathServices.sale.register,
    method: "POST",
    data: payload
  });
};
