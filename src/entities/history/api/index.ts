import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

export const getEmployeeApi = async (): Promise<any> => {
  return await apiRequest<string[]>({
    url: pathServices.history.getEmployePath,
    method: "GET",
  });
};

export const getContragentApi = async (): Promise<any> => {
  return await apiRequest<string[]>({
    url: pathServices.history.getContragentPath,
    method: "GET",
  });
};

export const getSellApi = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.history.getSellPath,
    params,
    method: "GET",
  });
};

export const getRefundApi = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.history.getRefundPath,
    params,
    method: "GET",
  });
};

export const getPurchaseApi = async (params: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.history.getPurchasePath,
    params,
    method: "GET",
  });
};

export const getOperationCountApi = async (params: any, type: "sale" | "refund" | "purchase"): Promise<any> => {
  return await apiRequest<any>({
    url: `/api/${type}/get/count`,
    params,
    method: "GET",
  });
};
