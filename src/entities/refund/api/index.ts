import type { RegisterRefundModel } from "@/@types/refund";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

export const registerRefundApi = async (payload: RegisterRefundModel) => {
  return await apiRequest({
    url: pathServices.refund.register,
    method: "POST",
    data: payload,
  });
};

export const getCheckRefundApi = async (params: string) => {
  return await apiRequest({
    url: pathServices.refund.getCheck,
    method: "GET",
    params: {
      data: params,
    },
  });
};

// Update
export const updateRefundApi = async (id: number | null, payload: any) => {
  return await apiRequest({
    url: pathServices.refund.updateRefundPath + id,
    method: "POST",
    data: payload,
  });
};
