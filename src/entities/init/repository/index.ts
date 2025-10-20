import { useQuery } from "@tanstack/react-query";
import { getSettingsApi } from "../api";
// GET 
export const useSettingsApi = () => {
  return useQuery({
    queryKey: ["init-settings"],
    queryFn: getSettingsApi,
  });
};

