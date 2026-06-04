import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { RegisterReturnPurchaseModel } from "@/@types/return-purchase";

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
