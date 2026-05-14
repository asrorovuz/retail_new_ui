import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCashboxCategoryApi, createCategoryApi, deleteCashboxCategoryApi, deleteCategoryApi, getCashboxCategoryApi, getCategoryApi, getCategoryTreeApi, updateCashboxCategoryApi, updateCategoryApi } from "../api";
import type { CategoryTypeModal } from "@/@types/products";

// GET 
export const useCategoryApi = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: getCategoryApi,
  });
};

export const useCategoryTreeApi = () => {
  return useQuery({
    queryKey: ["category-tree"],
    queryFn: getCategoryTreeApi,
  });
};

export const useCashboxCategoryApi = () => {
  return useQuery({
    queryKey: ["cashbox-category"],
    queryFn: getCashboxCategoryApi,
  });
};

// DELETE 
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
    },
  });
};

export const useDeleteCashboxCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCashboxCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashbox-category"] });
    },
  });
};

// UPDATE 
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryTypeModal }) =>
      updateCategoryApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
    },
  });
};

export const useUpdateCashboxCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateCashboxCategoryApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashbox-category"] });
    },
  });
};

// CREATE 
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryTypeModal) => createCategoryApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
    },
  });
};

export const useCreateCashboxCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createCashboxCategoryApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashbox-category"] });
    },
  });
};