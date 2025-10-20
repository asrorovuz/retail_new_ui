
import { AxiosBase } from "@/app/config/axios";
import { pathServices } from "../../path";
import type { SettingsType } from "@/@types/settings";

export const getSettingsApi = async (): Promise<SettingsType> => {
  const { data } = await AxiosBase.get(pathServices.settings.getSettingsPath);
  return data;
};

export const getPrinterApi = async (): Promise<string[]> => {
  const { data } = await AxiosBase.get(pathServices.settings.getPrinterName);
  return data;
};


