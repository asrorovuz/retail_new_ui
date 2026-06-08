import type { PaymeProviderType, RegisterSaleModel } from "@/@types/sale";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { FizcalResponsetype } from "../model";

export const registerSaleApi = async (payload: RegisterSaleModel) => {
    return await apiRequest({
        url: pathServices.sale.register,
        method: "POST",
        data: payload,
    });
};

export const fiscalDeviceApi = async (): Promise<FizcalResponsetype[]> => {
    return await apiRequest({
        url: pathServices.sale.getFiscaldevice,
        method: "GET",
    });
};

export const getAllContractorApi = async (
    search: string,
    params?: any,
    pagination?: any,
): Promise<any> => {
    const skip =
        pagination?.pageIndex && pagination.pageSize
            ? (pagination?.pageIndex - 1) * pagination?.pageSize
            : 0;
    return await apiRequest({
        url: pathServices.sale.getContractorPath,
        method: "GET",
        params: {
            name: search,
            limit: pagination?.pageSize ?? 20,
            skip,
            ...params,
        },
    });
};

export const getAllContractorCountApi = async (
    search: string,
    params?: any,
    pagination?: any,
): Promise<any> => {
    const skip =
        pagination?.pageIndex && pagination.pageSize
            ? (pagination?.pageIndex - 1) * pagination?.pageSize
            : 0;
    return await apiRequest({
        url: pathServices.sale.getContractorCountPath,
        method: "GET",
        params: {
            name: search,
            limit: pagination?.pageSize ?? 20,
            skip,
            ...params,
        },
    });
};

export const getTransferApi = async (params: any): Promise<any> => {
    return await apiRequest({
        url: pathServices.history.sellTransferPath,
        method: "GET",
        params,
    });
};

export const getSaleByIdApi = async (id: any): Promise<any> => {
    return await apiRequest({
        url: pathServices.sale.getSaleById + id,
        method: "GET",
    });
};

export const paymentProviderApi = async (): Promise<PaymeProviderType[]> => {
    return await apiRequest({
        url: pathServices.sale.getPaymentPath,
        method: "GET",
    });
};

export const createFiscalizedApi = async (payload: any) => {
    return await apiRequest({
        url: pathServices.sale.createFiscalized,
        method: "POST",
        data: payload,
    });
};

export const createFiscalizedRefundApi = async (payload: any) => {
    return await apiRequest({
        url: pathServices.sale.createFiscalizedRefund,
        method: "POST",
        data: payload,
    });
};

export const paymentDebtsApi = async (payload: any) => {
    return await apiRequest({
        url: pathServices.sale.getPaymentDebts,
        method: "POST",
        data: payload,
    });
};

export const payoutDebtsApi = async (payload: any) => {
    return await apiRequest({
        url: pathServices.sale.getPayoutDebts,
        method: "POST",
        data: payload,
    });
};

export const payoutUpdateDebtsApi = async (id: any, payload: any) => {
    return await apiRequest({
        url: pathServices.sale.getPayoutDebtsUpdate + id,
        method: "POST",
        data: payload,
    });
};

// Update
export const updateSellApi = async (id: number | null, payload: any) => {
    return await apiRequest({
        url: pathServices.sale.updateSellPath + id,
        method: "POST",
        data: payload,
    });
};
