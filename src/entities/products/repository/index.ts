import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  createFavouriteProductApi,
  createProductApi,
  deleteProductApi,
  getAllProductApi,
  getAllProductCountApi,
  getCatalogSearchApi,
  getCategoryApi,
  getCurrencyApi,
  getPriceTypeApi,
  getTableSettingsApi,
  updateAlertOnApi,
  updateCategoryApi,
  updateTableSettingsApi,
} from "../api";
import type {
  AlertOntype,
  CategoryTypeModal,
  ProductColumnVisibility,
} from "@/@types/products";
import type { FavouriteProduct } from "@/features/modals/model";

//GET
export const useAllProductApi = (
  pageSize?: number,
  pageIndex?: number,
  search?: string
) => {
  return useQuery({
    queryKey: ["all-products", pageSize, pageIndex, search],
    queryFn: () => getAllProductApi(pageSize, pageIndex, search),
  });
};

export const useAllProductCountApi = (search?: string) => {
  return useQuery({
    queryKey: ["all-products-count", search],
    queryFn: () => getAllProductCountApi(search),
  });
};

export const useCurrancyApi = () => {
  return useQuery({
    queryKey: ["currancy"],
    queryFn: getCurrencyApi,
  });
};

export const useCategoryApi = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: getCategoryApi,
  });
};

export const useCatalogSearchApi = (query: string) => {
  return useQuery({
    queryKey: ["catalog", query],
    queryFn: () => getCatalogSearchApi(query),
    enabled: !!query,
    staleTime: 0,
    gcTime: 0
  });
};

export const usePriceTypeApi = () => {
  return useQuery({
    queryKey: ["price-type"],
    queryFn: getPriceTypeApi,
  });
};

export const useProductTableSettingsApi = () => {
  return useQuery({
    queryKey: ["product-table-settings"],
    queryFn: getTableSettingsApi,
  });
};

// UPDATE
export const useUpdateTableSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductColumnVisibility) => updateTableSettingsApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-table-settings"] });
    },
  });
};

export const useUpdateAlertOn = () => {
  return useMutation({
    mutationFn: (data: AlertOntype) => updateAlertOnApi(data),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryTypeModal }) =>
      updateCategoryApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
};

// CREATE
export const useAddFavouriteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FavouriteProduct) => createFavouriteProductApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [""] });
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryTypeModal) => createCategoryApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createProductApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      queryClient.invalidateQueries({ queryKey: ["all-products-count"] });
    },
  });
};


// DELETE
export const useDeleteTransacton = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProductApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      queryClient.invalidateQueries({ queryKey: ["all-products-count"] });
    },
  });
};
