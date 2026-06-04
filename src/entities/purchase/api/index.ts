import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { RegisterPurchaseModel } from "@/@types/purchase";

export const getContractorByIdApi = async (id: number | null) => {
    return await apiRequest({
        url: pathServices.purchase.getContractorProductsById + id,
        method: "GET",
    });
};

export const registerPurchaseApi = async (payload: RegisterPurchaseModel) => {
    return await apiRequest({
        url: pathServices.purchase.register,
        method: "POST",
        data: payload,
    });
};

export const registerContractorProductApi = async (
    payload: RegisterPurchaseModel,
) => {
    return await apiRequest({
        url: pathServices.purchase.registerProduct,
        method: "POST",
        data: payload,
    });
};

// Update
export const updatePurchaseApi = async (id: number | null, payload: any) => {
    return await apiRequest({
        url: pathServices.purchase.updatePurchasePath + id,
        method: "POST",
        data: payload,
    });
};

export const updatePurchasePriceApi = async (payload: any) => {
    return await apiRequest({
        url: pathServices.purchase.updatePurchasePricePath,
        method: "POST",
        data: payload,
    });
};

export const updateOtherPurchasePriceApi = async (payload: any, id: number) => {
    return await apiRequest({
        url: pathServices.purchase.updateOtherPurchasePricePath + id,
        method: "POST",
        data: payload,
    });
};

export const deleteContractorProductApi = async (id: any) => {
    return await apiRequest({
        url: pathServices.purchase.deleteContractorProduct + id,
        method: "POST",
    });
};
