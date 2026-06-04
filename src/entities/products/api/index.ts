import type {
    AlertOntype,
    AlertOntypeResponse,
    Currency,
    FavouriteProductType,
    Product,
    ProductColumnVisibility,
    ProductPriceType,
} from "@/@types/products";
import type { FavouriteProduct } from "@/features/modals/model";
import type { ProductFormType } from "@/features/product-form/model";
import { apiRequest } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { TableColumnSetting } from "@/@types/settings";

/* ------------------------------ GET APIs ------------------------------ */

export const getAllProductApi = async (
    size?: number,
    index?: number,
    search?: string,
    filterParams?: any,
): Promise<Product[]> => {
    const skip = index && size ? (index - 1) * size : 0;

    return await apiRequest<Product[]>({
        url: pathServices.products.getAllProductsPath,
        method: "GET",
        params: {
            limit: size ?? 20,
            skip,
            query: search,
            ...filterParams,
        },
    });
};

export const getAllProductIKPUApi = async (): Promise<Product[]> => {
    return await apiRequest<Product[]>({
        url: pathServices.products.getAllProductsPath,
        method: "GET",
    });
};

export const getAllInfoProductApi = async (
    size?: number,
    index?: number,
    search?: string,
    filterParams?: any,
): Promise<Product[]> => {
    const skip = index && size ? (index - 1) * size : 0;

    return await apiRequest<Product[]>({
        url: pathServices.products.getAllInfoProductsPath,
        method: "GET",
        params: {
            limit: size ?? 20,
            skip,
            query: search,
            ...filterParams,
        },
    });
};

export const getAllFavoritProductApi = async (): Promise<
    FavouriteProductType[]
> => {
    return await apiRequest<FavouriteProductType[]>({
        url: pathServices.products.getFavoritProduct,
        method: "GET",
    });
};

export const exportProductScaleApi = async (params: any): Promise<any[]> => {
    return await apiRequest<any[]>({
        url: pathServices.products.exportProductScale,
        method: "GET",
        params,
        responseType: "arraybuffer",
    });
};

export const getAllProductCountApi = async (
    search?: string,
    filterParams?: any,
): Promise<number> => {
    const is_legal =
        filterParams?.isLegal === "white"
            ? true
            : filterParams?.isLegal === "black"
              ? false
              : null;

    return await apiRequest<number>({
        url: pathServices.products.getAllProductsCountPath,
        method: "GET",
        params: { query: search, is_legal, ...filterParams },
    });
};

export const getCurrencyApi = async (): Promise<Currency[]> => {
    return await apiRequest<Currency[]>({
        url: pathServices.products.getCurrencyPath,
        method: "GET",
    });
};

export const getTableSettingsApi = async (): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.products.getTableSettingsPath,
        method: "GET",
    });
};

export const getPriceTypeApi = async (): Promise<ProductPriceType[]> => {
    return await apiRequest<ProductPriceType[]>({
        url: pathServices.products.getPriceTypesList,
        method: "GET",
    });
};

export const getCatalogSearchApi = async (query: string): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.products.catalogSearch,
        method: "GET",
        params: { query },
    });
};

export const getCatalogSearchFiscalApi = async (
    query: string,
): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.products.catalogSearch,
        method: "GET",
        params: { query },
    });
};

export const getProductByIdApi = async (
    productId: number | null,
): Promise<Product> => {
    return await apiRequest<Product>({
        url: `${pathServices.products.getByIdPath}${productId}`,
        method: "GET",
    });
};

export const getProductBarcodeApi = async (
    barcode: string | null,
): Promise<Product> => {
    return await apiRequest<Product>({
        url: `${pathServices.products.findByBarcode}${barcode}`,
        method: "GET",
    });
};

export const getProductBarcodeProductApi = async (
    barcode: string | null,
): Promise<any> => {
    return await apiRequest<any>({
        url: `${pathServices.products.findByBarcodeProduct}${barcode}`,
        method: "GET",
    });
};

/* ------------------------------ UPDATE APIs ------------------------------ */

export const updateTableSettingsApi = async (
    payload: ProductColumnVisibility,
): Promise<TableColumnSetting> => {
    return await apiRequest<TableColumnSetting>({
        url: pathServices.products.updateTableSettingsPath,
        method: "POST",
        data: payload,
    });
};

export const updateProductCatalogCodeApi = async (id: number): Promise<any> => {
    return await apiRequest<any>({
        url: `${pathServices.products.updateProductCatalogCode}/${id}`,
        method: "POST",
        data: null,
    });
};

export const updateAlertOnApi = async (
    payload: AlertOntype,
): Promise<AlertOntypeResponse> => {
    return await apiRequest<AlertOntypeResponse>({
        url: pathServices.products.updateAlertOn,
        method: "POST",
        data: payload,
    });
};

export const updateProductApi = async (
    productId: number,
    payload: any,
): Promise<Product> => {
    return await apiRequest<Product>({
        url: `${pathServices.products.updateProduct}${productId}`,
        method: "POST",
        data: payload,
    });
};

/* ------------------------------ CREATE APIs ------------------------------ */

export const createFavouriteProductApi = async (
    payload: FavouriteProduct,
): Promise<FavouriteProduct> => {
    return await apiRequest<FavouriteProduct>({
        url: pathServices.products.createFavouriteProductPath,
        method: "POST",
        data: payload,
    });
};

export const createProductApi = async (
    payload: ProductFormType,
): Promise<Product> => {
    return await apiRequest<Product>({
        url: pathServices.products.createProductPath,
        method: "POST",
        data: payload,
    });
};

export const createProductWithExcel = async (payload: any): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.products.createExcelFileProduct,
        method: "POST",
        data: payload,
    });
};

export const exportProductWithExcel = async (params: any): Promise<any> => {
    return await apiRequest<any>({
        url: pathServices.products.exportExcelFileProduct,
        method: "POST",
        responseType: "blob",
        data: null,
        params: params,
    });
};

export interface BulkJobFailure {
    index: number;
    name: string;
    error_code: string;
    error_message: string;
}

export interface BulkJobStatus {
    job_id: string;
    status: string;
    total: number;
    processed: number;
    success_count: number;
    failure_count: number;
    failures: BulkJobFailure[];
}

export const bulkCreateProductApi = async (payload: {
    products: any[];
}): Promise<{ job_id: string }> => {
    return await apiRequest<{ job_id: string }>({
        url: pathServices.products.bulkCreateProduct,
        method: "POST",
        data: payload,
    });
};

export const getBulkJobStatusApi = async (
    jobId: string,
): Promise<BulkJobStatus> => {
    return await apiRequest<BulkJobStatus>({
        url: pathServices.products.bulkJobStatus + jobId,
        method: "GET",
    });
};

export const bulkUpdateProductApi = async (payload: {
    products: any[];
}): Promise<{ job_id: string }> => {
    return await apiRequest<{ job_id: string }>({
        url: pathServices.products.bulkUpdateProduct,
        method: "POST",
        data: payload,
    });
};

/* ------------------------------ DELETE APIs ------------------------------ */

export interface BulkDeleteFailure {
    id: number;
    error_code: string;
    error_message: string;
}

export interface BulkDeleteResult {
    success_count: number;
    failure_count: number;
    total: number;
    failures: BulkDeleteFailure[];
}

export const bulkDeleteProductApi = async (payload: {
    product_ids: number[];
}): Promise<BulkDeleteResult> => {
    return await apiRequest<BulkDeleteResult>({
        url: pathServices.products.bulkDeleteProductPath,
        method: "POST",
        data: payload,
    });
};

export interface PackageInfoByMarkingResponse {
    marks: string[];
    product: Product;
    quantity: number;
}

export const getPackageInfoByMarkingApi = async (
    marking: string,
): Promise<PackageInfoByMarkingResponse> => {
    return await apiRequest<PackageInfoByMarkingResponse>({
        url: pathServices.products.packageInfoByMarking,
        method: "POST",
        data: { product_package_marking: marking },
    });
};

export const deleteProductApi = async (id: number): Promise<any> => {
    return await apiRequest<any>({
        url: `${pathServices.products.deleteProductPath}/${id}`,
        method: "POST",
    });
};

export const deleteFavoritProductApi = async (id: number): Promise<any> => {
    return await apiRequest<any>({
        url: `${pathServices.products.deleteFavoritProductPath}/${id}`,
        method: "POST",
    });
};
