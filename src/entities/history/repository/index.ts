import { useQuery } from "@tanstack/react-query";
import { getContragentApi, getEmployeeApi, getOperationCountApi, getPurchaseApi, getRefundApi, getSellApi } from "../api";

export const useContragentApi = (isOpen?: boolean) => {
  return useQuery({
    queryKey: ["contragent", isOpen],
    queryFn: getContragentApi,
    enabled: isOpen
  });
};

export const useEmployeeApi = (isOpen?: boolean) => {
  return useQuery({
    queryKey: ["employee", isOpen],
    queryFn: getEmployeeApi,
    enabled: isOpen
  });
};

export const useSellApi = (params: any) => {
  return useQuery({
    queryKey: ["history-sale", params],
    queryFn: () => getSellApi(params)
  });
};

export const useRefundApi = (params: any) => {
  return useQuery({
    queryKey: ["history-refund", params],
    queryFn: () => getRefundApi(params)
  });
};

export const usePurchaseApi = (params: any) => {
  return useQuery({
    queryKey: ["history-purchase", params],
    queryFn: () => getPurchaseApi(params)
  });
};

export const useOperationCountApi = (params: any, type: "sale" | "refund" | "purchase") => {
  return useQuery({
    queryKey: ["employee", params, type],
    queryFn: () => getOperationCountApi(params, type)
  });
};

