import { useMutation, useQuery } from "@tanstack/react-query";
import { getActReport, getPayment, getPaymentCount } from "../api";

export const useActReport = () => {
    return useMutation({
        mutationFn: ({ id, params }: any) => getActReport(id, params),
    });
};


export const usePaymentAll = (params: any) => {
  return useQuery({
    queryKey: ["payment-all", params],
    queryFn: () => getPayment(params),
  });
};

export const usePaymentCount = (params: any) => {
  return useQuery({
    queryKey: ["payment-all-count", params],
    queryFn: () => getPaymentCount(params),
  });
};