
import { AxiosBase } from "@/app/config/axios";
import { pathServices } from "../../path";
import type { SettingsType, WareHouseDataType } from "@/@types/settings";

export const getSettingsApi = async (): Promise<SettingsType> => {
  const { data } = await AxiosBase.get(pathServices.settings.getSettingsPath);
  return data;
};

export const getPrinterApi = async (): Promise<string[]> => {
  const { data } = await AxiosBase.get(pathServices.settings.getPrinterName);
  return data;
};

export const getWarhouseApi = async (): Promise<WareHouseDataType[]> => {
  const { data } = await AxiosBase.get(pathServices.warhouse.getList);
  return data;
};


