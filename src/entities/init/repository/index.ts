import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeShiftApi,
  createPrintApi,
  createShiftApi,
  getCashboxApi,
  getPrinterApi,
  getSettingsApi,
  getShiftApi,
  getShiftOperationApi,
  getVersionApi,
  getWarhouseApi,
} from "../api";
import type { PrinterPostType } from "@/@types/common";
// GET
export const useSettingsApi = () => {
  return useQuery({
    queryKey: ["init-settings"],
    queryFn: getSettingsApi,
  });
};

export const useWarehouseApi = () => {
  return useQuery({
    queryKey: ["warehouse"],
    queryFn: getWarhouseApi,
  });
};

export const usePrinterApi = () => {
  return useQuery({
    queryKey: ["printer"],
    queryFn: getPrinterApi,
  });
};

export const useVersionApi = () => {
  return useQuery({
    queryKey: ["version"],
    queryFn: getVersionApi,
  });
};

export const useCashboxApi = (isOpen?: boolean) => {
  return useQuery({
    queryKey: ["cashbox", isOpen],
    queryFn: getCashboxApi,
  });
};

export const useShiftOperationApi = (id: number | null, isOpen: boolean) => {
  return useQuery({
    queryKey: ["last-shift-operation", id, isOpen],
    queryFn: () => getShiftOperationApi(id),
    enabled: !!id && isOpen,
  });
};

export const useShiftApi = (isOpen: boolean) => {
  return useQuery({
    queryKey: ["shift", isOpen],
    queryFn: getShiftApi,
    retry: false,          // ❗ MUHIM
    gcTime: 0,          // ❗ MUHIM
    staleTime: 0,
  });
};

export const useCloseShiftApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => closeShiftApi(payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["shift"] });
    },
  });
};

export const useCreateShiftApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | null) => createShiftApi(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["shift"] });
    },
  });
};

export const useCreatePrintApi = () => {
  return useMutation({
    mutationFn: ({
      path,
      payload,
    }: {
      path: string;
      payload: PrinterPostType;
    }) => createPrintApi(path, payload),
  });
};

export const useCreatePdfPrintApi = () => {
  return useMutation({
    mutationFn: ({
      path,
      payload,
    }: {
      path: string;
      payload: PrinterPostType;
    }) => createPrintApi(path, payload),
  });
};
