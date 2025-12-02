import type {
  AlertOntype,
  AlertOntypeResponse,
  CategoryResponse,
  CategoryTypeModal,
  Currency,
  FavouriteProductType,
  Product,
  ProductColumnVisibility,
  ProductPriceType,
  RegisterType,
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
  search?: string
): Promise<Product[]> => {
  const skip = index && size ? (index - 1) * size : undefined;

  return await apiRequest<Product[]>({
    url: pathServices.products.getAllProductsPath,
    method: "GET",
    params: {
      limit: size,
      skip,
      query: search,
    },
  });
};

export const getAllFavoritProductApi = async (): Promise<FavouriteProductType[]> => {
  return await apiRequest<FavouriteProductType[]>({
    url: pathServices.products.getFavoritProduct,
    method: "GET",
  });
};

export const getAllProductCountApi = async (search?: string): Promise<number> => {
  return await apiRequest<number>({
    url: pathServices.products.getAllProductsCountPath,
    method: "GET",
    params: { query: search },
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

export const getCategoryApi = async (): Promise<CategoryResponse[]> => {
  return await apiRequest<CategoryResponse[]>({
    url: pathServices.products.getCategory,
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

export const getProductByIdApi = async (productId: number | null): Promise<Product> => {
  return await apiRequest<Product>({
    url: `${pathServices.products.getByIdPath}${productId}`,
    method: "GET",
  });
};

export const getProductBarcodeApi = async (barcode: string | null): Promise<Product> => {
  return await apiRequest<Product>({
    url: `${pathServices.products.findByBarcode}${barcode}`,
    method: "GET",
  });
};

/* ------------------------------ UPDATE APIs ------------------------------ */

export const updateTableSettingsApi = async (
  payload: ProductColumnVisibility
): Promise<TableColumnSetting> => {
  return await apiRequest<TableColumnSetting>({
    url: pathServices.products.updateTableSettingsPath,
    method: "POST",
    data: payload,
  });
};

export const updateAlertOnApi = async (
  payload: AlertOntype
): Promise<AlertOntypeResponse> => {
  return await apiRequest<AlertOntypeResponse>({
    url: pathServices.products.updateAlertOn,
    method: "POST",
    data: payload,
  });
};

export const updateProductApi = async (
  productId: number,
  payload: ProductFormType
): Promise<Product> => {
  return await apiRequest<Product>({
    url: `${pathServices.products.updateProduct}${productId}`,
    method: "POST",
    data: payload,
  });
};

export const updateCategoryApi = async (
  id: number,
  payload: CategoryTypeModal
): Promise<CategoryResponse> => {
  return await apiRequest<CategoryResponse>({
    url: `${pathServices.products.updateCategory}${id}`,
    method: "POST",
    data: payload,
  });
};

/* ------------------------------ CREATE APIs ------------------------------ */

export const createFavouriteProductApi = async (
  payload: FavouriteProduct
): Promise<FavouriteProduct> => {
  return await apiRequest<FavouriteProduct>({
    url: pathServices.products.createFavouriteProductPath,
    method: "POST",
    data: payload,
  });
};

export const createRegisterApi = async (
  payload: RegisterType
): Promise<any> => {
  return await apiRequest<any>({
    url: pathServices.products.createRegister,
    method: "POST",
    data: payload,
  });
};

export const createCategoryApi = async (
  payload: CategoryTypeModal
): Promise<CategoryResponse> => {
  return await apiRequest<CategoryResponse>({
    url: pathServices.products.addCategory,
    method: "POST",
    data: payload,
  });
};

export const createProductApi = async (
  payload: ProductFormType
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
    data: payload
  })
}

/* ------------------------------ DELETE APIs ------------------------------ */

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
