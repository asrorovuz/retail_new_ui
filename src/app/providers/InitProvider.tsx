import { useEffect, type ReactNode } from "react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useSettingsApi, useWarehouseApi } from "@/entities/init/repository";
import { transformProductColumns } from "@/shared/lib/transformation-table";
import i18n from "../config/i18n";
import {
  useCurrancyApi,
  useProductTableSettingsApi,
} from "@/entities/products/repository";
import { useCurrencyStore } from "../store/useCurrencyStore";

export const InitProvider = ({ children }: { children: ReactNode }) => {
  const { setSettings, setTableSettings, setWareHouseId } = useSettingsStore();
  const { setNationalCurrency, setCurrencies } = useCurrencyStore();

  const { data: settings } = useSettingsApi();
  const { data: settingsTable } = useProductTableSettingsApi();
  const { data: wareHouseData } = useWarehouseApi();
  const { data: currency } = useCurrancyApi();

  // 🏬 Warehouse ID ni o‘rnatish
  useEffect(() => {
    if (wareHouseData && wareHouseData.length > 0) {
      setWareHouseId(wareHouseData[0].id);
    }
  }, [wareHouseData, setWareHouseId]);

  // ⚙️ Foydalanuvchi sozlamalari (til, boshqa configlar)
  useEffect(() => {
    if (settings) {
      setSettings(settings);

      if (settings.lang) {
        i18n.changeLanguage(settings.lang);
      }
    }
  }, [settings, setSettings]);

  // 📋 Jadval ustunlari sozlamalari
  useEffect(() => {
    if (settingsTable) {
      const result = transformProductColumns(settingsTable);
      setTableSettings(result);
    }
  }, [settingsTable, setTableSettings]);

  // Valyuta va milliy valyutani saqlash
  useEffect(() => {
    if (currency && currency.length > 0) {
      const nationalCurrency = currency.find((item) => item.is_national);
      setCurrencies(currency);

      if (nationalCurrency) {
        setNationalCurrency(nationalCurrency);
      }
    }
  }, [currency, setCurrencies, setNationalCurrency]);

  return <>{children}</>;
};
