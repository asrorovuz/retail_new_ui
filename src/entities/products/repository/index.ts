import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  bulkDeleteProductApi,
  createFavouriteProductApi,
  createProductApi,
  createProductWithExcel,
  deleteFavoritProductApi,
  deleteProductApi,
  exportProductScaleApi,
  exportProductWithExcel,
  getAllFavoritProductApi,
  getAllInfoProductApi,
  getAllProductApi,
  getAllProductCountApi,
  getAllProductIKPUApi,
  getCatalogSearchApi,
  getCatalogSearchFiscalApi,
  getCurrencyApi,
  getPriceTypeApi,
  getProductBarcodeApi,
  getProductBarcodeProductApi,
  getProductByIdApi,
  getTableSettingsApi,
  updateAlertOnApi,
  updateProductApi,
  updateProductCatalogCodeApi,
  updateTableSettingsApi,
} from "../api";
import type {
  AlertOntype,
  ProductColumnVisibility,
} from "@/@types/products";
import type { FavouriteProduct } from "@/features/modals/model";

//GET
export const useAllProductApi = (
  pageSize?: number,
  pageIndex?: number,
  search?: string,
  filterParams?: any
) => {
  return useQuery({
    queryKey: ["all-products", pageSize, pageIndex, search, filterParams],
    queryFn: () => getAllProductApi(pageSize, pageIndex, search, filterParams),
  });
};

export const useAllProductIKPUApi = (
  isOpen: boolean,
) => {
  return useQuery({
    queryKey: ["all-products-ikpu", isOpen],
    queryFn: () => getAllProductIKPUApi(),
    enabled: !!isOpen,
  });
};

export const useAllInfoProductApi = (
  pageSize?: number,
  pageIndex?: number,
  search?: string,
  filterParams?: any
) => {
  return useQuery({
    queryKey: ["all-info-products", pageSize, pageIndex, search, filterParams],
    queryFn: () => getAllInfoProductApi(pageSize, pageIndex, search, filterParams),
  });
};

export const useAllFavoritProductApi = () => {
  return useQuery({
    queryKey: ["all-favorit"],
    queryFn: () => getAllFavoritProductApi(),
  });
};

export const useExportProductScaleApi = () => {
  return useMutation({
    mutationFn: exportProductScaleApi,
  });
};

export const useAllProductCountApi = (search?: string, filterParams?: any) => {
  return useQuery({
    queryKey: ["all-products-count", search, filterParams],
    queryFn: () => getAllProductCountApi(search, filterParams),
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

export const useFindBarcodeProduct = (barcode: string | null) => {
  return useQuery({
    queryKey: ["find-barcode-product", barcode],
    queryFn: () => getProductBarcodeProductApi(barcode),
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

/**
 * Ketma-ket catalog qidirish:
 * 1. /catalog/search?query={barcode}  → topilsa tayyor
 * 2. Topilmasa → /product-dictionary/find-by-barcode/{barcode} → catalogCode
 * 3. /catalog/search?query={catalogCode} → tayyor
 */
export const useCatalogByBarcode = (
  query: string | null,
  isOpen: boolean,
) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || !isOpen) {
      setData([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const run = async () => {
      try {
        // 1-qadam: barcode bilan to'g'ridan catalog search
        let direct: any[] = [];
        try {
          const res = await getCatalogSearchApi(query);
          if (Array.isArray(res)) direct = res;
        } catch {
          // endpoint barcode uchun ishlamadi — 2-qadamga o'tamiz
        }

        if (cancelled) return;

        if (direct.length > 0) {
          setData(direct);
          return;
        }

        // 2-qadam: local file (product-dictionary) dan catalogCode olish
        let catalogCode: string | null = null;
        try {
          const dict = await getProductBarcodeProductApi(query);
          if (dict?.catalog_code) {
            catalogCode = dict.catalog_code;
          }
        } catch {
          // local dictionary da topilmadi
        }

        if (!catalogCode) {
          // Ne barcode, ne dictionary — catalog topilmadi
          if (!cancelled) setData([]);
          return;
        }

        // 3-qadam: catalogCode bilan catalog search
        if (cancelled) return;
        try {
          const result = await getCatalogSearchApi(catalogCode);
          if (!cancelled) {
            setData(Array.isArray(result) ? result : []);
          }
        } catch {
          // catalog server ishlamayapti, lekin catalogCode topilgani saqlansin
          if (!cancelled) setData([]);
        }
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [query, isOpen]);

  return { data, isLoading };
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

export const useUpdateProductCatalogCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number }) => updateProductCatalogCodeApi(data?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-catalog-update"] });
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

export const useExportProductWithExcel = () => {
  return useMutation({
    mutationFn: (params: any) => exportProductWithExcel(params)
  })
}

export const useBulkDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { product_ids: number[] }) =>
      bulkDeleteProductApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      queryClient.invalidateQueries({ queryKey: ["all-products-count"] });
    },
  });
};

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
