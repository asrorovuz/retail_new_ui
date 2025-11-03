import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPrintApi,
  getCashboxApi,
  getPrinterApi,
  getSettingsApi,
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

export const useCashboxApi = () => {
  return useQuery({
    queryKey: ["cashbox"],
    queryFn: getCashboxApi,
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
