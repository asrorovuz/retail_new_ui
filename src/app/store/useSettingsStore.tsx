import type {
  SettingsStoreActions,
  SettingsStoreInitialState,
  TableColumnSetting,
} from "@/@types/settings";
import type { Shift } from "@/@types/shift/schema";
import { create } from "zustand";

const initialState: SettingsStoreInitialState = {
  settings: null,
  activeShift: null,
  tableSettings: [
    { key: "name", visible: true, color: "" },
    { key: "totalRemainder", color: "!bg-green-100", visible: true },
    { key: "packInCount", visible: true, color: "" },
    { key: "package", visible: true, color: "" },
    { key: "price", visible: true, color: "" },
    // { key: "purchesPrice", visible: true, color: "" },
    { key: "sku", visible: true, color: "" },
    { key: "code", visible: true, color: "" },
  ],
  wareHouseId: null
};

export const useSettingsStore = create<SettingsStoreInitialState & SettingsStoreActions>(
  (set) => ({
    ...initialState,
    setSettings: (payload) => set({ settings: payload }),
    setTableSettings: (payload: TableColumnSetting[]) =>
      set(() => ({ tableSettings: payload })),
    setWareHouseId: (payload: number) => set({wareHouseId: payload}),
    setActiveShift: (payload: Shift | null) =>
        set(() => ({ activeShift: payload }))
  })
);
