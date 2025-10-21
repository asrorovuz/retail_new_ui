import type { Product, ProductColumnVisibility } from "@/@types/products";
import type { TableColumnSetting } from "@/@types/settings";
import { AxiosBase } from "@/app/config/axios";
import { pathServices } from "@/entities/path";
import type { FavouriteProduct } from "@/features/modals/model";
import type { AxiosResponse } from "axios";

export const getAllProductApi = async (
  size?: number,
  index?: number,
  search?: string
): Promise<Product[] | []> => {
  const skip = (index && size) ? (index - 1) * size : "";

  const { data } = await AxiosBase.get(pathServices.products.getAllProductsPath, {
    params: {
      limit: size,
      skip: skip,
      query: search
    },
  });

  return data;
};
export const getAllProductCountApi = async (): Promise<number> => {
  const { data } = await AxiosBase.get(pathServices.products.getAllProductsCountPath);
  return data;
};

export const getTableSettingsApi = async (): Promise<any> => {
  const { data } = await AxiosBase.get(pathServices.products.getTableSettingsPath);
  return data;
};

export const getPriceTypeApi = async (): Promise<any> => {
  const { data } = await AxiosBase.get(pathServices.products.getPriceTypesList);
  return data;
};


//UPDATE
export const updateTableSettingsApi = async (payload: ProductColumnVisibility): Promise<TableColumnSetting> => {
  const { data }: AxiosResponse<TableColumnSetting> = await AxiosBase.post(
    pathServices.products.updateTableSettingsPath,
    payload
  );
  return data;
};


// POST 
export const createFavouriteProductApi = async (payload: FavouriteProduct): Promise<FavouriteProduct> => {
  const { data }: AxiosResponse<FavouriteProduct> = await AxiosBase.post(
    pathServices.products.createFavouriteProductPath,
    payload
  );
  return data;
};


// DELETE 
export const deleteProductApi = async (id: number) => {
   const response = await AxiosBase.post(
      `${pathServices.products.deleteProductPath}/${id}`,
   );
   return response;
};