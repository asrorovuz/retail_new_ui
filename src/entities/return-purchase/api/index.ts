import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { RegisterReturnPurchaseModel } from "@/@types/return-purchase";


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

export const updateReturnPurchaseApi = async (id: number | null, payload: any) => {
    return await apiRequest({
        url: pathServices.returnPurchase.update + id,
        method: "POST",
        data: payload,
    });
};

export const registerReturnPurchaseApi = async (
    payload: RegisterReturnPurchaseModel,
) => {
    return await apiRequest({
        url: pathServices.returnPurchase.register,
        method: "POST",
        data: payload,
    });
};
