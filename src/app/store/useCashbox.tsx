import { create } from "zustand";

const initialState = {
  type: 1,
  cashbox: null,
};

export const useCashboxStore = create<any>()((set) => ({
  ...initialState,
  setType: (type: number) => set(() => ({ type })),
  setCashbox: (cashbox: any) => set(() => ({ cashbox })),
}));
