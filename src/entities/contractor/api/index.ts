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

export const getPayout = async (params: any): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;

    return await apiRequest<any>({
        url: pathServices.contractor.getPayoutPath,
        method: "GET",
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
    });
};

export const getPayoutCount = async (params: any): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;

    return await apiRequest<any>({
        url: pathServices.contractor.getPayouttCountPath,
        method: "GET",
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
    });
};

export const getActReportExcelApi = async (
    id: number | null,
    params: any,
): Promise<any> => {
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: pathServices.contractor.getActReportExcel + id,
        method: "POST",
        data: { ...param },
        responseType: "arraybuffer",
    });
};

export const deletePayout = async (id: number): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.contractor.deletePayout + id,
    method: "POST",
  });
};