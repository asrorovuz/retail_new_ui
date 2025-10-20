import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProductApi, getAllProductCountApi, getTableSettingsApi, updateTableSettingsApi } from "../api";
import type { ProductColumnVisibility } from "@/@types/products";

//GET
export const useAllProductApi = (pageSize: number, pageIndex: number, search: string) => {
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