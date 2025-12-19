import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTransactionsApi,
  getContragentApi,
  getEmployeeApi,
  getOperationCountApi,
  getPurchaseApi,
  getPurchaseIdApi,
  getRefundApi,
  getRefundIdApi,
  getSellApi,
  getSellIdApi,
} from "../api";

export const useContragentApi = (isOpen?: boolean) => {
  return useQuery({
    queryKey: ["contragent", isOpen],
    queryFn: getContragentApi,
    enabled: isOpen,
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
export const useDeleteTransactions = (type: "sale" | "refund" | "purchase") => {
  const queryClient = useQueryClient();
  const ref =
    type === "sale"
      ? "history-sale"
      : type === "refund"
      ? "history-refund"
      : "history-purchase";

  return useMutation({
    mutationFn: (id: number) => deleteTransactionsApi(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ref] });
      queryClient.invalidateQueries({ queryKey: ["transaction-count"] });
    },
  });
};
