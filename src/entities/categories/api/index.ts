import type { CategoryResponse, CategoryTypeModal } from "@/@types/products";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";

// GET 
export const getCategoryApi = async (): Promise<CategoryResponse[]> => {
    return await apiRequest<CategoryResponse[]>({
        url: pathServices.categories.getCategory,
        method: "GET",
    });
};

export const getCategoryTreeApi = async (): Promise<any[]> => {
    return await apiRequest<any[]>({
        url: pathServices.categories.getCategoryTree,
        method: "GET",
    });
};

export const getCashboxCategoryApi = async (): Promise<CategoryResponse[]> => {
    return await apiRequest<CategoryResponse[]>({
        url: pathServices.categories.getCashboxCategory,
        method: "GET",
    });
};

// DELETE 
export const deleteCategoryApi = async (id: number): Promise<any> => {
    return await apiRequest<any>({
        url: `${pathServices.categories.deleteCategoryPath}/${id}`,
        method: "POST",
    });
};

export const deleteCashboxCategoryApi = async (id: number): Promise<any> => {
    return await apiRequest<any>({
        url: `${pathServices.categories.deleteCashboxCategory}/${id}`,
        method: "POST",
    });
};

// UPDATE 
export const updateCategoryApi = async (
    id: number,
    payload: CategoryTypeModal,
): Promise<CategoryResponse> => {
    return await apiRequest<CategoryResponse>({
        url: `${pathServices.categories.updateCategory}${id}`,
        method: "POST",
        data: payload,
    });
};

export const updateCashboxCategoryApi = async (
    id: number,
    payload: any,
): Promise<any> => {
    return await apiRequest<any>({
        url: `${pathServices.categories.updateCashboxCategory}${id}`,
        method: "POST",
        data: payload,
    });
};

// CREATE 
export const createCategoryApi = async (
    payload: CategoryTypeModal,
): Promise<CategoryResponse> => {
    return await apiRequest<CategoryResponse>({
        url: pathServices.categories.addCategory,
        method: "POST",
        data: payload,
    });
};

export const createCashboxCategoryApi = async (
    payload: any,
): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.categories.addCashboxCategory,
        method: "POST",
        data: payload,
    });
};