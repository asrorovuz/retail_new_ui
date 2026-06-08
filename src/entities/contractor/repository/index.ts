import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePayout,
    getActReport,
    getPayment,
    getPaymentCount,
    getPayout,
    getPayoutCount,
} from "../api";

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

export const usePayoutAll = (params: any) => {
    return useQuery({
        queryKey: ["payout-all", params],
        queryFn: () => getPayout(params),
    });
};

export const usePayoutCount = (params: any) => {
    return useQuery({
        queryKey: ["payout-all-count", params],
        queryFn: () => getPayoutCount(params),
    });
};

export const useDeletePayout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: any) => deletePayout(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["payout-all"] });
            queryClient.invalidateQueries({ queryKey: ["payout-all-count"] });
        },
    });
};
