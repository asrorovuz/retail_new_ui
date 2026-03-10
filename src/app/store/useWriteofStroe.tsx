import type { DraftSalePaymentAmountSchema } from "@/@types/sale";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PaymentTypes } from "../constants/payment.types";

type ItemType = {
  productId: number;
  quantity: number;
  warehouseId: number;
  productName: string;
  priceAmount: number;
  priceAmoutBulk: number;
  productPackageName: string;
};
/* ================= Types ================= */
export type WriteOfDraft = {
  items: ItemType[];
  payment?: {
    amounts: DraftSalePaymentAmountSchema[];
  };
  id?: number;
  number?: string;
};

interface WriteOfStore {
  draftWriteOfs: WriteOfDraft[];

  deleteDraftWriteOfItem: (draftSaleItemIndex: number) => void;
  updateDraftWriteOfItem: (draftItem: ItemType) => void;
  updateDraftWriteOfItemQuantity: (index: number, quantity: number) => void;
  clearDraftWriteOf: () => void;
  updateDraftWriteOf: (updatedDraft: WriteOfDraft) => void;
}

interface InitialStateType {
  draftWriteOfs: WriteOfDraft[];
}

/* ================= Initial State ================= */

const initialState: InitialStateType = {
  draftWriteOfs: [
    {
      items: [],
      payment: {
        amounts: PaymentTypes.map((paymentType) => {
          return { amount: "0", paymentType: paymentType.type };
        }),
      },
    },
  ],
};

/* ================= Store ================= */

export const useWriteOfStore = create<WriteOfStore>()(
  immer((set) => ({
    ...initialState,

    deleteDraftWriteOfItem: (draftSaleItemIndex: number) =>
      set((state) => {
        state.draftWriteOfs[0]?.items?.splice(draftSaleItemIndex, 1);
      }),

    updateDraftWriteOfItem: (draftItem: ItemType) =>
      set((state) => {
        const activeSale = state.draftWriteOfs[0];
        if (activeSale) {
          const draftSaleItem = activeSale.items.find((i) => {
            return i.productId === draftItem.productId;
          });

          if (draftSaleItem) {
            draftSaleItem.priceAmount = draftItem.priceAmount;

            if (draftItem.quantity <= 0) {
              const draftSaleItemIndex = activeSale.items.findIndex((i) => {
                return i.productId === draftItem.productId;
              });
              if (draftSaleItemIndex >= 0) {
                activeSale.items.splice(draftSaleItemIndex, 1);
              }
            } else {
              draftSaleItem.quantity = draftItem.quantity;
            }
          } else {
            if (draftItem.quantity < 0) {
              return;
            }
            activeSale.items.unshift(draftItem);
          }
        }
      }),
    updateDraftWriteOf: (updatedDraft: WriteOfDraft) =>
      set((state) => {
        state.draftWriteOfs[0] = {
          ...state.draftWriteOfs[0], // mavjud draft qolgan maydonlarni saqlaydi
          id: updatedDraft.id,
          number: updatedDraft.number,
          items: [...updatedDraft.items],
        };
      }),
    clearDraftWriteOf: () =>
      set((state) => {
        state.draftWriteOfs[0] = {
          items: [],
          payment: {
            amounts: PaymentTypes.map((paymentType) => ({
              amount: "0",
              paymentType: paymentType.type,
            })),
          },
          id: undefined,
          number: undefined,
        };
      }),
    updateDraftWriteOfItemQuantity: (
      draftSaleItemIndex: number,
      quantity: number,
    ) =>
      set((state) => {
        const activeSale = state.draftWriteOfs[0];
        if (activeSale) {
          activeSale.items[draftSaleItemIndex].quantity = quantity;
        }
      }),
  })),
);
