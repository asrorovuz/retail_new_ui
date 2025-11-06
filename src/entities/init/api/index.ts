// src/entities/settings/api/index.ts

import { apiRequest } from "@/app/config/axios";
import { pathServices } from "../../path";
import type { SettingsType, WareHouseDataType } from "@/@types/settings";
import type { CashboxType } from "@/@types/cashbox";
import type { PrinterPostType } from "@/@types/common";
import type { Shift, ShiftOperation } from "@/@types/shift/schema";

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

export const getLastShiftApi = async (id: number | null): Promise<Shift> => {
  return await apiRequest<Shift>({
    url: pathServices.init.lastShiftPath + id,
    method: "GET",
  });
};

export const closeShiftApi = async (payload: any): Promise<Shift> => {
  return await apiRequest<Shift>({
    url: pathServices.init.closeShiftPath,
    method: "POST",
    data: payload,
  });
};

export const getShiftOperationApi = async (id: number | null): Promise<ShiftOperation> => {
  return await apiRequest<ShiftOperation>({
    url: pathServices.init.getShiftoperation + id,
    method: "GET",
  });
};

export const getShiftApi = async (): Promise<Shift> => {
  return await apiRequest<Shift>({
    url: pathServices.init.getShiftPath,
    method: "GET",
  });
};

export const getCashboxApi = async (): Promise<CashboxType[]> => {
  return await apiRequest<CashboxType[]>({
    url: pathServices.cashbox.getAllCashbox,
    method: "GET",
  });
};

export const createPrintApi = async (
  path: string,
  payload: PrinterPostType
): Promise<any> => {
  return await apiRequest<PrinterPostType>({
    url: pathServices.init.printPath + path,
    method: "POST",
    data: payload,
  });
};

export const createShiftApi = async (id: number | null): Promise<Shift> => {
  return await apiRequest<Shift>({
    url: pathServices.init.shiftOpenApi,
    method: "POST",
    data: {
      cash_box_id: id,
    },
  });
};
