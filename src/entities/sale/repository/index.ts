import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createFiscalizedApi,
    createFiscalizedRefundApi,
    fiscalDeviceApi,
    getAllContractorApi,
    getAllContractorCountApi,
    getSaleByIdApi,
    getTransferApi,
    paymentDebtsApi,
    paymentProviderApi,
    payoutDebtsApi,
    payoutUpdateDebtsApi,
    registerSaleApi,
    updateSellApi,
} from "../api";
import type { RegisterSaleModel } from "@/@types/sale";

export const useRegisterSellApi = () => {
    return useMutation({
        mutationFn: (data: RegisterSaleModel) => registerSaleApi(data),
    });
};

export const useFescalDeviceApi = (fiscalizedModal?: boolean) => {
    return useQuery({
        queryKey: ["fiscalized"],
        queryFn: fiscalDeviceApi,
        enabled: !!fiscalizedModal,
    });
};

export const usePaymentProviderApi = () => {
    return useQuery({
        queryKey: ["payment-provider"],
        queryFn: paymentProviderApi,
    });
};

export const useContractorApi = (
    isOpen: boolean,
    search: string,
    params?: any,
    pagination?: any,
) => {
    return useQuery({
        queryKey: ["contractor-all", isOpen, search, params, pagination],
        queryFn: () => getAllContractorApi(search, params, pagination),
        enabled: !!isOpen,
    });
};

export const useContractorCountApi = (
    isOpen: boolean,
    search: string,
    params?: any,
    pagination?: any,
) => {
    return useQuery({
        queryKey: ["contractor-count", isOpen, search, params, pagination],
        queryFn: () => getAllContractorCountApi(search, params, pagination),
        enabled: !!isOpen,
    });
};

export const useSellTransferApi = (params: any) => {
    return useQuery({
        queryKey: ["sell-transfer", params],
        queryFn: () => getTransferApi(params),
    });
};

export const useSaleByIdApi = (id: any) => {
    return useQuery({
        queryKey: ["sell-by-id", id],
        queryFn: () => getSaleByIdApi(id),
    });
};

export const useCreateFiscalizedApi = () => {
    return useMutation({
        mutationFn: (data: any) => createFiscalizedApi(data),
    });
};

export const useCreateFiscalizedRefundApi = () => {
    return useMutation({
        mutationFn: (data: any) => createFiscalizedRefundApi(data),
    });
};

export const usePaymentDebtsApi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => paymentDebtsApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contractor-all"] });
            queryClient.invalidateQueries({ queryKey: ["contractor-count"] });
        },
    });
};

export const usePayoutDebtsApi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => payoutDebtsApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contractor-all"] });
            queryClient.invalidateQueries({ queryKey: ["contractor-count"] });
            queryClient.invalidateQueries({ queryKey: ["payout-all"] });
            queryClient.invalidateQueries({ queryKey: ["payout-all-count"] });
        },
    });
};

export const usePayoutDebtsUpdateApi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: any; payload: any }) =>
            payoutUpdateDebtsApi(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payout-all"] });
            queryClient.invalidateQueries({ queryKey: ["payout-all-count"] });
        },
    });
};

export const useUpdateSellApi = () => {
    return useMutation({
        mutationFn: ({ id, payload }: any) => updateSellApi(id, payload),
    });
};
