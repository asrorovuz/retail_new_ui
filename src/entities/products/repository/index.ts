import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  createFavouriteProductApi,
  createProductApi,
  createProductWithExcel,
  createRegisterApi,
  deleteFavoritProductApi,
  deleteProductApi,
  getAllFavoritProductApi,
  getAllProductApi,
  getAllProductCountApi,
  getCatalogSearchApi,
  getCatalogSearchFiscalApi,
  getCategoryApi,
  getCurrencyApi,
  getPriceTypeApi,
  getProductBarcodeApi,
  getProductByIdApi,
  getTableSettingsApi,
  updateAlertOnApi,
  updateCategoryApi,
  updateProductApi,
  updateTableSettingsApi,
} from "../api";
import type {
  AlertOntype,
  CategoryTypeModal,
  ProductColumnVisibility,
  RegisterType,
} from "@/@types/products";
import type { FavouriteProduct } from "@/features/modals/model";

//GET
export const useAllProductApi = (
  pageSize?: number,
  pageIndex?: number,
  search?: string,
  isLegal?: "all" | "white" | "black"
) => {
  return useQuery({
    queryKey: ["all-products", pageSize, pageIndex, search, isLegal],
    queryFn: () => getAllProductApi(pageSize, pageIndex, search, isLegal),
  });
};

export const useAllFavoritProductApi = () => {
  return useQuery({
    queryKey: ["all-favorit"],
    queryFn: () => getAllFavoritProductApi(),
  });
};

export const useAllProductCountApi = (search?: string, isLegal?: string) => {
  return useQuery({
    queryKey: ["all-products-count", search, isLegal],
    queryFn: () => getAllProductCountApi(search, isLegal),
  });
};

export const useProductByIdApi = (productId: number | null) => {
  return useQuery({
    queryKey: ["product-by-id", productId],
    queryFn: () => getProductByIdApi(productId),
    enabled: !!productId,
  });
};

export const useFindBarcode = (barcode: string | null) => {
  return useQuery({
    queryKey: ["find-barcode", barcode],
    queryFn: () => getProductBarcodeApi(barcode),
    enabled: !!barcode,
    retry: false,
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

export const useCatalogSearchApi = (query: string, isOpen: boolean) => {
  return useQuery({
    queryKey: ["catalog", query, isOpen],
    queryFn: () => getCatalogSearchApi(query),
    enabled: !!query && !!isOpen,
    // gcTime: 0,
    // staleTime: 0
  });
};

export const useCatalogSearchFiscalApi = (query: string) => {
  return useQuery({
    queryKey: ["catalog-fiscal", query],
    queryFn: () => getCatalogSearchFiscalApi(query),
    enabled: !!query,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AlertOntype) => updateAlertOnApi(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};

export const useCreateregister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterType) => createRegisterApi(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: any }) =>
      updateProductApi(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
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
      queryClient.invalidateQueries({ queryKey: ["all-favorit"] });
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

export const useCreateProductWithExcel = () => {
  return useMutation({
    mutationFn: (data: any) => createProductWithExcel(data)
  })
}

// DELETE
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProductApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      queryClient.invalidateQueries({ queryKey: ["all-products-count"] });
    },
  });
};

export const useDeleteFavoritproduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFavoritProductApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-favorit"] });
    },
  });
};
