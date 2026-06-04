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

export const getContragentByIdApi = async (id: number | null): Promise<any> => {
    return await apiRequest<string[]>({
        url: pathServices.history.getContractorByIdPath + id,
        method: "GET",
    });
};

export const getSellApi = async (params: any): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: pathServices.history.getSellPath,
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
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
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: pathServices.history.getRefundPath,
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
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
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: pathServices.history.getPurchasePath,
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
        method: "GET",
    });
};

export const getPurchaseIdApi = async (id: any): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.history.getPurchaseIdPath + id,
        method: "GET",
    });
};

export const getReturnPurchaseApi = async (params: any): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: pathServices.returnPurchase.get,
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
        method: "GET",
    });
};

export const getReturnPurchaseIdApi = async (id: any): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.returnPurchase.getById + id,
        method: "GET",
    });
};

export const getReturnPurchaseCountApi = async (params: any): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: pathServices.returnPurchase.getCount,
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
        method: "GET",
    });
};

export const getOperationCountApi = async (
    params: any,
    type: "sale" | "refund" | "purchase",
): Promise<any> => {
    const skip =
        params?.pageIndex && params.pageSize
            ? (params?.pageIndex - 1) * params?.pageSize
            : 0;
    const { pageSize, pageIndex, ...param } = params;
    return await apiRequest<any>({
        url: `/api/${type}/get/count`,
        params: {
            limit: params?.pageSize ?? 20,
            skip,
            ...param,
        },
        method: "GET",
    });
};

// DELETE
export const deleteTransactionsApi = async (
    id: number,
    type: "sale" | "purchase" | "refund" | "return_purchase",
): Promise<any> => {
    const pathEndPoint =
        type === "sale"
            ? pathServices.history.deleteSalePath
            : type === "refund"
              ? pathServices.history.deleteRefundPath
              : type === "return_purchase"
                ? pathServices.returnPurchase.delete
                : pathServices.history.deletePurchasePath;

    return await apiRequest<any>({
        url: pathEndPoint + id,
        method: "POST",
    });
};
