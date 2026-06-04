import { create } from "zustand";

type OfflineState = {
    isOnline: boolean;
    queueLength: number;
    update: (isOnline: boolean, queueLength: number) => void;
};

export const useOfflineStore = create<OfflineState>()((set) => ({
    isOnline: true,
    queueLength: 0,
    update: (isOnline, queueLength) => set({ isOnline, queueLength }),
}));
