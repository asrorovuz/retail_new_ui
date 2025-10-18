import type { SettingsType } from "@/@types/settings";
import { create } from "zustand";

interface SettingsState {
  settings: SettingsType | null;
  setSettings: (payload: SettingsType | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (payload) => set({ settings: payload }),
}));
