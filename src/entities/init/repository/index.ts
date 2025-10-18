import { useQuery } from "@tanstack/react-query";
import { getSettingsApi } from "../api";
// GET 
export const useSettingsApi = () => {
  return useQuery({
    queryKey: ["init-settings"],
    queryFn: getSettingsApi,
  });
};

// export const useSettingsPrinterApi = () => {
//   return useQuery({
//     queryKey: ["init-settings-printer"],
//     queryFn: getPrinterApi,
//   });
// };

