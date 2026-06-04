import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PriceDisplayMode = "both" | "retail" | "bulk";

interface SaleSettingsStore {
    priceDisplayMode: PriceDisplayMode;
    setPriceDisplayMode: (mode: PriceDisplayMode) => void;
}

export const useSaleSettingsStore = create<SaleSettingsStore>()(
    persist(
        (set) => ({
            priceDisplayMode: "both",
            setPriceDisplayMode: (mode) => set({ priceDisplayMode: mode }),
        }),
        { name: "sale-settings" },
    ),
);
