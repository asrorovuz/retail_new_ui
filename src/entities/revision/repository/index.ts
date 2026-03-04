import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRegisterApi, deleteRevisionApi, getRevisionApi, getRevisionCountApi } from "../api";
import type { RegisterType } from "@/@types/products";

export const useRevision = (
  pageSize?: number,
  pageIndex?: number,
  filterParams?: any,
) => {
  return useQuery({
    queryKey: ["revision", pageSize, pageIndex, filterParams],
    queryFn: () => getRevisionApi(pageSize, pageIndex, filterParams),
  });
};

export const useRevisionCount = (
  pageSize?: number,
  pageIndex?: number,
  filterParams?: any,
) => {
  return useQuery({
    queryKey: ["revision-count", pageSize, pageIndex, filterParams],
    queryFn: () => getRevisionCountApi(pageSize, pageIndex, filterParams),
  });
};

export const useCreateregister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterType) => createRegisterApi(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["revision"] });
      queryClient.invalidateQueries({ queryKey: ["revision-count"] });
    },
  });
};

export const useDeleteRevision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | null) => deleteRevisionApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revision"] });
      queryClient.invalidateQueries({ queryKey: ["revision-count"] });
    },
  });
};