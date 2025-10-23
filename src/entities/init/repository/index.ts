import { useQuery } from "@tanstack/react-query";
import { getSettingsApi, getWarhouseApi } from "../api";
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

