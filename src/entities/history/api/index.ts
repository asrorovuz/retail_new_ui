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

export const getSellIdApi = async (id: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.history.getSellIdPath + id,
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

export const getRefundIdApi = async (id: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.history.getRefundIdPath + id,
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

export const getPurchaseIdApi = async (id: any): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.history.getPurchaseIdPath + id,
    method: "GET",
  });
};

export const getOperationCountApi = async (
  params: any,
  type: "sale" | "refund" | "purchase"
): Promise<any> => {
  return await apiRequest<any>({
    url: `/api/${type}/get/count`,
    params,
    method: "GET",
  });
};

// DELETE
export const deleteTransactionsApi = async (
  id: number,
  type: "sale" | "purchase" | "refund"
): Promise<any> => {
  const pathEndPoint =
    type === "sale"
      ? pathServices.history.deleteSalePath
      : type === "refund"
      ? pathServices.history.deleteRefundPath
      : pathServices.history.deletePurchasePath;

  return await apiRequest<any>({
    url: pathEndPoint + id,
    method: "POST",
  });
};
