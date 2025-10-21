import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createFavouriteProductApi,
  deleteProductApi,
  getAllProductApi,
  getAllProductCountApi,
  getPriceTypeApi,
  getTableSettingsApi,
  updateTableSettingsApi,
} from "../api";
import type { ProductColumnVisibility } from "@/@types/products";
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

export const useAllProductCountApi = () => {
  return useQuery({
    queryKey: ["all-products-count"],
    queryFn: getAllProductCountApi,
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

export const useUpdateTableSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductColumnVisibility) => updateTableSettingsApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-table-settings"] });
    },
  });
};

export const useAddFavouriteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FavouriteProduct) => createFavouriteProductApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [""] });
    },
  });
};

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
