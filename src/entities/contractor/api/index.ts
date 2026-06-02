import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

export const getActReport = async (
    id: number | null,
    params: any,
): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: pathServices.contractor.getActReport + id,
        method: "POST",
        data: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
    });
};

export const getPayment = async (params: any): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;

    return await apiRequest<any>({
        url: pathServices.contractor.getPaymentPath,
        method: "GET",
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
    });
};

export const getPaymentCount = async (params: any): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;

    return await apiRequest<any>({
        url: pathServices.contractor.getPaymentCountPath,
        method: "GET",
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
    });
};
