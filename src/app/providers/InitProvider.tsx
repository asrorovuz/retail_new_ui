import { useEffect, type ReactNode } from "react";
import { useSettingsStore } from "../store/useSettingsStore";
import {
  useSettingsApi,
} from "@/entities/init/repository";
import { transformProductColumns } from "@/shared/lib/transformation-table";
import i18n from "../config/i18n";
import { useProductTableSettingsApi } from "@/entities/products/repository";

export const InitProvider = ({ children }: { children: ReactNode }) => {
  const setSettings = useSettingsStore((s) => s.setSettings);
  const setSettingstable = useSettingsStore((s) => s.setTableSettings);

  const { data: settings } = useSettingsApi();
  const { data: settingsTable } = useProductTableSettingsApi();

  useEffect(() => {
    if (settings) {
      setSettings(settings);

      if (settings.lang) {
        i18n.changeLanguage(settings.lang || "ru");
      }
    }

    if (settingsTable) {
      console.log(setSettingstable);
      
      const result = transformProductColumns(settingsTable);
      setSettingstable(result);
    }
  }, [settings, setSettings, i18n]);

  return <>{children}</>;
};
