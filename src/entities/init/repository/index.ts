import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeShiftApi,
  createPrintApi,
  createShiftApi,
  getCashboxApi,
  getLastShiftApi,
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

export const useCashboxApi = () => {
  return useQuery({
    queryKey: ["cashbox"],
    queryFn: getCashboxApi,
  });
};

export const useLastShiftApi = (id: number | null) => {
  return useQuery({
    queryKey: ["last-shift"],
    queryFn: () => getLastShiftApi(id),
    enabled: !!id,
  });
};

export const useShiftOperationApi = (id: number | null, isOpen: boolean) => {
  return useQuery({
    queryKey: ["last-shift-operation", id, isOpen],
    queryFn: () => getShiftOperationApi(id),
    enabled: !!id && isOpen,
  });
};

export const useShiftApi = (id: number | null) => {
  return useQuery({
    queryKey: ["shift", id],
    queryFn: getShiftApi
  });
};

export const useCloseShiftApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => closeShiftApi(payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["shift"] });
      queryClient.invalidateQueries({ queryKey: ["last-shift"] });
    },
  });
}

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

export const useCreateShiftApi = () => {
  return useMutation({
    mutationFn: (id: number | null) => createShiftApi(id),
  });
};
