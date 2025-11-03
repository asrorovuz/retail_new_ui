// src/entities/settings/api/index.ts

import { apiRequest } from "@/app/config/axios";
import { pathServices } from "../../path";
import type { SettingsType, WareHouseDataType } from "@/@types/settings";
import type { CashboxType } from "@/@types/cashbox";
import type { PrinterPostType } from "@/@types/common";

// 🔹 Sozlamalarni olish
export const getSettingsApi = async (): Promise<SettingsType> => {
  return await apiRequest<SettingsType>({
    url: pathServices.settings.getSettingsPath,
    method: "GET",
  });
};

// 🔹 Printer nomlarini olish
export const getPrinterApi = async (): Promise<string[]> => {
  return await apiRequest<string[]>({
    url: pathServices.settings.getPrinterName,
    method: "GET",
  });
};

// 🔹 Omborlar ro‘yxatini olish
export const getWarhouseApi = async (): Promise<WareHouseDataType[]> => {
  return await apiRequest<WareHouseDataType[]>({
    url: pathServices.warhouse.getList,
    method: "GET",
  });
};

export const getCashboxApi = async (): Promise<CashboxType[]> => {
  return await apiRequest<CashboxType[]>({
    url: pathServices.cashbox.getAllCashbox,
    method: "GET",
  });
};

export const createPrintApi = async (path: string, payload: PrinterPostType): Promise<any> => {
  return await apiRequest<PrinterPostType>({
    url: pathServices.init.printPath + path,
    method: "POST",
    data: payload
  });
};
