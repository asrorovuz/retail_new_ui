import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTransactionsApi,
  getContragentApi,
  getContragentByIdApi,
  getEmployeeApi,
  getOperationCountApi,
  getPurchaseApi,
  getPurchaseIdApi,
  getRefundApi,
  getRefundIdApi,
  getReturnPurchaseApi,
  getReturnPurchaseCountApi,
  getReturnPurchaseIdApi,
  getSellApi,
  getSellIdApi,
} from "../api";

export const useContragentApi = (isOpen?: boolean) => {
  return useQuery({
    queryKey: ["contragent", isOpen],
    queryFn: getContragentApi,
  });
};

export const useContragentByIdApi = (id: number | null) => {
  return useQuery({
    queryKey: ["contragent", id],
    queryFn: () => getContragentByIdApi(id),
    enabled: !!id
  });
};

export const useEmployeeApi = (isOpen?: boolean) => {
  return useQuery({
    queryKey: ["employee", isOpen],
    queryFn: getEmployeeApi,
    enabled: isOpen,
  });
};

export const useSellApi = (params: any) => {
  return useQuery({
    queryKey: ["history-sale", params],
    queryFn: () => getSellApi(params),
  });
};

export const useSellIdApi = (id: any) => {
  return useQuery({
    queryKey: ["history-sale-id", id],
    queryFn: () => getSellIdApi(id),
    enabled: !!id,
  });
};

export const useRefundApi = (params: any) => {
  return useQuery({
    queryKey: ["history-refund", params],
    queryFn: () => getRefundApi(params),
  });
};

export const useRefundIdApi = (id: any) => {
  return useQuery({
    queryKey: ["history-refund-id", id],
    queryFn: () => getRefundIdApi(id),
    enabled: !!id,
  });
};

export const usePurchaseApi = (params: any) => {
  return useQuery({
    queryKey: ["history-purchase", params],
    queryFn: () => getPurchaseApi(params),
  });
};

export const usePurchaseIdApi = (id: any) => {
  return useQuery({
    queryKey: ["history-purchase-id", id],
    queryFn: () => getPurchaseIdApi(id),
    enabled: !!id,
  });
};

export const useReturnPurchaseApi = (params: any) => {
  return useQuery({
    queryKey: ["history-return-purchase", params],
    queryFn: () => getReturnPurchaseApi(params),
  });
};

export const useReturnPurchaseIdApi = (id: any) => {
  return useQuery({
    queryKey: ["history-return-purchase-id", id],
    queryFn: () => getReturnPurchaseIdApi(id),
    enabled: !!id,
  });
};

export const useReturnPurchaseCountApi = (params: any) => {
  return useQuery({
    queryKey: ["transaction-count-return-purchase", params],
    queryFn: () => getReturnPurchaseCountApi(params),
  });
};

export const useOperationCountApi = (
  params: any,
  type: "sale" | "refund" | "purchase"
) => {
  return useQuery({
    queryKey: ["transaction-count", params, type],
    queryFn: () => getOperationCountApi(params, type),
  });
};

// DELETE
export const useDeleteTransactions = (type: "sale" | "refund" | "purchase" | "return_purchase") => {
  const queryClient = useQueryClient();
  const ref =
    type === "sale"
      ? "history-sale"
      : type === "refund"
      ? "history-refund"
      : type === "return_purchase"
      ? "history-return-purchase"
      : "history-purchase";

  return useMutation({
    mutationFn: (id: number) => deleteTransactionsApi(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ref] });
      queryClient.invalidateQueries({ queryKey: ["transaction-count"] });
    },
  });
};
