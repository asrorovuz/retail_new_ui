import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRegisterApi, createWriteoffApi, deleteRevisionApi, deleteWriteoffApi, getRevisionApi, getRevisionCountApi, getWriteoffApi, getWriteoffCountApi } from "../api";
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


export const useWriteoff = (
  pageSize?: number,
  pageIndex?: number,
  filterParams?: any,
) => {
  return useQuery({
    queryKey: ["writeoff", pageSize, pageIndex, filterParams],
    queryFn: () => getWriteoffApi(pageSize, pageIndex, filterParams),
  });
};

export const useWriteoffCount = (
  pageSize?: number,
  pageIndex?: number,
  filterParams?: any,
) => {
  return useQuery({
    queryKey: ["writeoff-count", pageSize, pageIndex, filterParams],
    queryFn: () => getWriteoffCountApi(pageSize, pageIndex, filterParams),
  });
};

export const useCreateWriteoff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterType) => createWriteoffApi(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["writeoff"] });
      queryClient.invalidateQueries({ queryKey: ["writeoff-count"] });
    },
  });
};

export const useDeleteWriteoff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | null) => deleteWriteoffApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writeoff"] });
      queryClient.invalidateQueries({ queryKey: ["writeoff-count"] });
    },
  });
};