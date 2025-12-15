import { immer } from "zustand/middleware/immer";
import { PaymentTypes } from "../constants/payment.types";
import { create } from "zustand";
import type {
  DraftPurchaseItemSchema,
  DraftPurchaseSchema,
  PurchaseStoreActions,
  PurchaseStoreInitialState,
} from "@/@types/purchase";

const initialState = {
  draftPurchases: [
    {
      isActive: true,
      items: [],
      discountAmount: 0,
      payout: {
        amounts: PaymentTypes.map((paymentType) => {
          return { amount: 0, paymentType: paymentType.type };
        }),
      },
    },
  ],
};

export const useDraftPurchaseStore = create<
  PurchaseStoreInitialState & PurchaseStoreActions
>()(
  immer((set) => ({
    ...initialState,
    addDraftPurchase: (draftPurchase) =>
      set((state) => {
        const activePurchase = state.draftPurchases.find(
          (s: DraftPurchaseSchema) => s.isActive
        );
        if (activePurchase) {
          activePurchase.isActive = false;
        }

        draftPurchase.isActive = true;

        if (draftPurchase.id) {
          const existIndex = state.draftPurchases.findIndex(
            (s: DraftPurchaseSchema) => s.id === draftPurchase.id
          );
          if (existIndex !== -1) {
            state.draftPurchases[existIndex].isActive = true;
            if (!state.draftPurchases[existIndex].items) {
              state.draftPurchases[existIndex].items = [];
            }
            return;
          }
        }

        state.draftPurchases.push(draftPurchase);
      }),
    activateDraftPurchase: (draftPurchaseIndex: number) =>
      set((state) => {
        if (state.draftPurchases.length > 0) {
          const activePurchase = state.draftPurchases.find((s) => s.isActive);
          if (activePurchase) {
            activePurchase.isActive = false;
          }
        }

        state.draftPurchases[draftPurchaseIndex].isActive = true;
      }),

    deleteDraftPurchaseItem: (draftPurchaseItemIndex: number) =>
      set((state) => {
        const activePurchase = state.draftPurchases.find((s) => s.isActive);
        if (activePurchase) {
          activePurchase.items.splice(draftPurchaseItemIndex, 1);
        }
      }),
    deleteDraftPurchase: (draftPurchaseIndex: number) =>
      set((state) => {
        if (state.draftPurchases.length === 1 && draftPurchaseIndex === 0) {
          const newDraftPurchase: DraftPurchaseSchema = {
            items: [],
            isActive: true,
            discountAmount: 0,
            payout: {
              amounts: PaymentTypes.map((paymentType) => {
                return { amount: 0, paymentType: paymentType.type };
              }),
            },
          };
          state.draftPurchases = [newDraftPurchase];
        } else {
          let items = state.draftPurchases.filter(
            (_, index) => index !== draftPurchaseIndex
          );
          if (draftPurchaseIndex === 0) items[0].isActive = true;
          else items[draftPurchaseIndex - 1].isActive = true;
          state.draftPurchases = items;
        }
      }),
    updateDraftPurchaseItem: (draftItem: DraftPurchaseItemSchema) =>
      set((state) => {
        const activePurchase = state.draftPurchases?.find((s) => s.isActive);
        if (activePurchase) {
          const draftPurchaseItem = activePurchase.items.find((i) => {
            return (
              i.productId === draftItem.productId
            );
          });

          if (draftPurchaseItem) {
            draftPurchaseItem.priceAmount = draftItem.priceAmount;
            draftPurchaseItem.priceTypeId = draftItem.priceTypeId;

            if (draftItem.quantity <= 0) {
              const draftPurchaseItemIndex = activePurchase.items.findIndex(
                (i) => {
                  return (
                    i.productId === draftItem.productId
                  );
                }
              );
              if (draftPurchaseItemIndex >= 0) {
                activePurchase.items.splice(draftPurchaseItemIndex, 1);
              }
            } else {
              draftPurchaseItem.quantity = draftItem.quantity;
              draftPurchaseItem.totalAmount = draftItem.totalAmount;
            }
          } else {
            if (draftItem.quantity < 0) {
              return;
            }
            activePurchase.items.unshift(draftItem);
          }
        }
      }),
    updateDraftPurchaseItemQuantity: (
      draftPurchaseItemIndex: number,
      quantity: number
    ) =>
      set((state) => {
        const activePurchase = state.draftPurchases.find((s) => s.isActive);
        if (activePurchase) {
          activePurchase.items[draftPurchaseItemIndex].quantity = quantity;
        }
      }),
    updateDraftPurchaseItemPrice: (
      draftPurchaseItemIndex: number,
      priceAmount: number
    ) =>
      set((state) => {
        const activePurchase = state.draftPurchases.find((s) => s.isActive);
        if (activePurchase) {
          activePurchase.items[draftPurchaseItemIndex].priceAmount =
            priceAmount;
        }
      }),
    updateDraftPurchaseItemTotalPrice: (
      draftPurchaseItemIndex: number,
      totalPrice: number
    ) =>
      set((state) => {
        const activePurchase = state.draftPurchases.find((s) => s.isActive);
        if (activePurchase) {
          activePurchase.items[draftPurchaseItemIndex].totalAmount = totalPrice;
        }
      }),
    updateDraftPurchasePayout: (payment) =>
      set((state) => {
        const activePurchase = state.draftPurchases.find((s) => s.isActive);
        if (activePurchase) {
          activePurchase.payout = { amounts: payment };
        }
      }),
    updateDraftPurchaseDiscount: (discountAmount: number) =>
      set((state) => {
        const activePurchase = state.draftPurchases.find((s) => s.isActive);
        if (activePurchase) {
          activePurchase.discountAmount = discountAmount;
        }
      }),
    completeActiveDraftPurchase: () =>
      set((state) => {
        const activePurchaseIndex = state.draftPurchases.findIndex(
          (s) => s.isActive
        );

        if (state.draftPurchases.length > 1) {
          state.draftPurchases.splice(activePurchaseIndex, 1);

          const previousPurchaseIndex = state.draftPurchases.length - 1;
          state.draftPurchases[previousPurchaseIndex].isActive = true;
        } else {
          const activePurchase = state.draftPurchases.find((s) => s.isActive);
          if (activePurchase) {
            if (activePurchase.id) {
              const newDraftPurchase: DraftPurchaseSchema = {
                items: [],
                isActive: true,
                discountAmount: 0,
                payout: {
                  amounts: PaymentTypes.map((paymentType) => {
                    return { amount: 0, paymentType: paymentType.type };
                  }),
                },
              };
              state.draftPurchases = [newDraftPurchase];
            } else {
              activePurchase.items = [];
              activePurchase.discountAmount = 0;
              if (activePurchase.payout) {
                activePurchase.payout.amounts.forEach((a) => (a.amount = 0));
              }
            }
          }
        }
      }),
  }))
);
