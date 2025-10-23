import type {
  AlertOntype,
  AlertOntypeResponse,
  CategoryResponse,
  CategoryTypeModal,
  Currency,
  Product,
  ProductColumnVisibility,
  ProductResponse,
} from "@/@types/products";
import type { TableColumnSetting } from "@/@types/settings";
import { AxiosBase } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { FavouriteProduct } from "@/features/modals/model";
import type { ProductFormType } from "@/features/product-form/model";
import type { AxiosResponse } from "axios";

export const getAllProductApi = async (
  size?: number,
  index?: number,
  search?: string
): Promise<Product[] | []> => {
  const skip = index && size ? (index - 1) * size : "";

  const { data } = await AxiosBase.get(
    pathServices.products.getAllProductsPath,
    {
      params: {
        limit: size,
        skip: skip,
        query: search,
      },
    }
  );

  return data;
};
export const getAllProductCountApi = async (
  search?: string
): Promise<number> => {
  const { data } = await AxiosBase.get(
    pathServices.products.getAllProductsCountPath,
    {
      params: {
        query: search,
      },
    }
  );
  return data;
};

export const getCurrencyApi = async (): Promise<Currency[]> => {
  const { data } = await AxiosBase.get(pathServices.products.getCurrencyPath);
  return data;
};

export const getTableSettingsApi = async (): Promise<any> => {
  const { data } = await AxiosBase.get(
    pathServices.products.getTableSettingsPath
  );
  return data;
};

export const getPriceTypeApi = async (): Promise<any> => {
  const { data } = await AxiosBase.get(pathServices.products.getPriceTypesList);
  return data;
};

export const getCategoryApi = async (): Promise<any> => {
  const { data } = await AxiosBase.get(pathServices.products.getCategory);
  return data;
};

export const getCatalogSearchApi = async (query: string): Promise<any> => {
  const { data } = await AxiosBase.get(pathServices.products.catalogSearch, {
    params: {
      query: query,
    },
  });
  return data;
};

//UPDATE
export const updateTableSettingsApi = async (
  payload: ProductColumnVisibility
): Promise<TableColumnSetting> => {
  const { data }: AxiosResponse<TableColumnSetting> = await AxiosBase.post(
    pathServices.products.updateTableSettingsPath,
    payload
  );
  return data;
};

export const updateAlertOnApi = async (
  payload: AlertOntype
): Promise<AlertOntypeResponse> => {
  const { data }: AxiosResponse<AlertOntypeResponse> = await AxiosBase.post(
    pathServices.products.updateAlertOn,
    payload
  );
  return data;
};

export const updateCategoryApi = async (
  id: number,
  payload: CategoryTypeModal
): Promise<CategoryResponse> => {
  const { data }: AxiosResponse<CategoryResponse> = await AxiosBase.post(
    `${pathServices.products.updateCategory}${id}`,
    payload
  );
  return data;
};

// POST
export const createFavouriteProductApi = async (
  payload: FavouriteProduct
): Promise<FavouriteProduct> => {
  const { data }: AxiosResponse<FavouriteProduct> = await AxiosBase.post(
    pathServices.products.createFavouriteProductPath,
    payload
  );
  return data;
};

export const createCategoryApi = async (
  payload: CategoryTypeModal
): Promise<CategoryResponse> => {
  const { data }: AxiosResponse<CategoryResponse> = await AxiosBase.post(
    pathServices.products.addCategory,
    payload
  );
  return data;
};

export const createProductApi = async (
  payload: ProductFormType
): Promise<ProductResponse> => {
  const { data }: AxiosResponse<ProductResponse> = await AxiosBase.post(
    pathServices.products.createProductPath,
    payload
  );
  return data;
};

// DELETE
export const deleteProductApi = async (id: number) => {
  const response = await AxiosBase.post(
    `${pathServices.products.deleteProductPath}/${id}`
  );
  return response;
};
