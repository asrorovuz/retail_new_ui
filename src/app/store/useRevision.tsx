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
export type RevisionDraft = {
  items: ItemType[];
  payment?: {
    amounts: DraftSalePaymentAmountSchema[];
  };
  id?: number;
  number?: string;
};

interface RevisionStore {
  draftRevisions: RevisionDraft[];

  deleteDraftRevisionItem: (draftSaleItemIndex: number) => void;
  updateDraftRevisionItem: (draftItem: ItemType) => void;
  updateDraftRevisionItemQuantity: (index: number, quantity: number) => void;
  clearDraftRevision: () => void;
  updateDraftRevision: (updatedDraft: RevisionDraft) => void;
}

interface InitialStateType {
  draftRevisions: RevisionDraft[];
}

/* ================= Initial State ================= */

const initialState: InitialStateType = {
  draftRevisions: [
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

export const useRevisionStore = create<RevisionStore>()(
  immer((set) => ({
    ...initialState,

    deleteDraftRevisionItem: (draftSaleItemIndex: number) =>
      set((state) => {
        state.draftRevisions[0]?.items?.splice(draftSaleItemIndex, 1);
      }),

    updateDraftRevisionItem: (draftItem: ItemType) =>
      set((state) => {
        const activeSale = state.draftRevisions[0];
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
    updateDraftRevision: (updatedDraft: RevisionDraft) =>
      set((state) => {
        state.draftRevisions[0] = {
          ...state.draftRevisions[0], // mavjud draft qolgan maydonlarni saqlaydi
          id: updatedDraft.id,
          number: updatedDraft.number,
          items: [...updatedDraft.items],
        };
      }),
    clearDraftRevision: () =>
      set((state) => {
        state.draftRevisions[0] = {
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
    updateDraftRevisionItemQuantity: (
      draftSaleItemIndex: number,
      quantity: number,
    ) =>
      set((state) => {
        const activeSale = state.draftRevisions[0];
        if (activeSale) {
          activeSale.items[draftSaleItemIndex].quantity = quantity;
        }
      }),
  })),
);
