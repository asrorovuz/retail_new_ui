export interface VersionStoreActions {
  setVersions: (payload: { current_version: string }) => void;
}

export interface VersionStoreInitialState {
  versions: string;
}
import { create } from "zustand";

const initialState: VersionStoreInitialState = {
  versions: "", // string bo'lib saqlanadi
};

export const useVersionStore = create<
  VersionStoreInitialState & VersionStoreActions
>((set) => ({
  ...initialState,
  setVersions: (payload) => set(() => ({ versions: payload.current_version })),
}));
