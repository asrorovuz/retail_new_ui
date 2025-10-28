import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import type {
  DraftRefundItemSchema,
  RefundStoreActions,
  RefundStoreInitialState,
} from "@/@types/refund";

const initialState = {
  draftRefunds: [],
};

export const useDraftRefundStore = create<
  RefundStoreInitialState & RefundStoreActions
>()(
  immer((set) => ({
    ...initialState,
    addDraftRefund: (draftRefund) =>
      set((state) => {
        const activeRefund = state.draftRefunds.find((s) => s.isActive);
        if (activeRefund) {
          activeRefund.isActive = false;
        }

        draftRefund.isActive = true;

        if (draftRefund.id) {
          const existIndex = state.draftRefunds.findIndex(
            (s) => s.id === draftRefund.id
          );
          if (existIndex !== -1) {
            state.draftRefunds[existIndex].isActive = true;
            if (!state.draftRefunds[existIndex].items) {
              state.draftRefunds[existIndex].items = [];
            }
            return;
          }
        }

        state.draftRefunds.push(draftRefund);
      }),
    activateDraftRefund: (draftRefundIndex) =>
      set((state) => {
        if (state.draftRefunds.length > 0) {
          const activeRefund = state.draftRefunds.find((s) => s.isActive);
          if (activeRefund) {
            activeRefund.isActive = false;
          }
        }

        state.draftRefunds[draftRefundIndex].isActive = true;
      }),
    updateDraftRefundItem: (draftItem: DraftRefundItemSchema) =>
      set((state) => {
        const activeRefund = state.draftRefunds.find((s) => s.isActive);
        if (activeRefund) {
          const draftRefundItem = activeRefund.items.find((i) => {
            return (
              i.productId === draftItem.productId &&
              i.productPackageId === draftItem.productPackageId
            );
          });

          if (draftRefundItem) {
            draftRefundItem.priceAmount = draftItem.priceAmount;
            draftRefundItem.priceTypeId = draftItem.priceTypeId;

            if (draftItem.quantity <= 0) {
              const draftRefundItemIndex = activeRefund.items.findIndex((i) => {
                return (
                  i.productId === draftItem.productId &&
                  i.productPackageId === draftItem.productPackageId
                );
              });
              if (draftRefundItemIndex >= 0) {
                activeRefund.items.splice(draftRefundItemIndex, 1);
              }
            } else {
              draftRefundItem.quantity = draftItem.quantity;
            }
          } else {
            if (draftItem.quantity < 0) {
              return;
            }
            activeRefund.items.unshift(draftItem);
          }
        }
      })
    // deleteDraftRefund: (draftRefundIndex) => set((state) => {
    //     if (state.draftRefunds.length === 1 && draftRefundIndex === 0) {
    //         const newDraftRefund: DraftRefundSchema = {
    //             items: [],
    //             isActive: true,
    //             discountAmount: 0,
    //             payout: {
    //                 amounts: PaymentTypes.map(paymentType => {
    //                     return {amount: 0, paymentType: paymentType.type}
    //                 })
    //             }
    //         }
    //         state.draftRefunds = [newDraftRefund]
    //     } else {
    //         let items = state.draftRefunds.filter((_, index) => index !== draftRefundIndex)
    //         if (draftRefundIndex === 0) items[0].isActive = true
    //         else items[draftRefundIndex - 1].isActive = true
    //         state.draftRefunds = items
    //     }
    //     // let items = state.draftRefunds.filter((_, index) => index !== draftRefundIndex)
    //     // if (draftRefundIndex === 0) items[0].isActive = true
    //     // else items[draftRefundIndex - 1].isActive = true
    //     // state.draftRefunds = items
    // }),
    // completeActiveDraftRefund: () => set((state) => {
    //     const activeRefundIndex = state.draftRefunds.findIndex(s => s.isActive)

    //     if (state.draftRefunds.length > 1) {
    //         state.draftRefunds.splice(activeRefundIndex, 1)

    //         const previousRefundIndex = state.draftRefunds.length - 1
    //         state.draftRefunds[previousRefundIndex].isActive = true
    //     } else {
    //         const activeRefund = state.draftRefunds.find(s => s.isActive)
    //         if (activeRefund) {
    //             if (activeRefund.id) {
    //                 const newDraftRefund: DraftRefundSchema = {
    //                     items: [],
    //                     isActive: true,
    //                     discountAmount: 0,
    //                     payout: {
    //                         amounts: PaymentTypes.map(paymentType => {
    //                             return {amount: 0, paymentType: paymentType.type}
    //                         })
    //                     }
    //                 }
    //                 state.draftRefunds = [newDraftRefund]
    //             } else {
    //                 activeRefund.items = []
    //                 activeRefund.discountAmount = 0
    //                 if (activeRefund.payout) {
    //                     activeRefund.payout.amounts.forEach(a => a.amount = 0)
    //                 }
    //             }
    //         }
    //     }
    // }),
    // resetActiveDraftRefund: () => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.items = []
    //         activeRefund.discountAmount = 0
    //         if (activeRefund.payout) {
    //             activeRefund.payout.amounts.forEach(a => a.amount = 0)
    //         }
    //     }
    // }),
    // updateDraftRefundDiscount: (discountAmount) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.discountAmount = discountAmount
    //     }
    // }),
    // addDraftRefundPaymentAmount: (payload: DraftRefundPayoutAmountSchema) => set((state) => {

    // }),
    // updateDraftRefundPaymentAmounts: (paymentAmounts: DraftRefundPayoutAmountSchema[]) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (!activeRefund) return

    //     const newPaymentAmounts: DraftRefundPayoutAmountSchema[] = []
    //     for (let i = 0; i < paymentAmounts.length; i++) {
    //         newPaymentAmounts.push({
    //             amount: paymentAmounts[i].amount,
    //             paymentType: paymentAmounts[i].paymentType
    //         })
    //     }
    //     activeRefund.payout = { amounts: newPaymentAmounts }
    // }),
    // addDraftRefundItem: (draftItem) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     const [mark] = draftItem.marks ?? []

    //     if (activeRefund) {
    //         const existRefundItem = activeRefund.items.find(i => {
    //             return i.productId === draftItem.productId && i.productPackageId === draftItem.productPackageId
    //         })

    //         if (existRefundItem) {
    //             existRefundItem.quantity += draftItem.quantity
    //             existRefundItem.totalAmount += existRefundItem.totalAmount
    //             if (mark) {
    //                 existRefundItem.marks ??= []

    //                 const isExist = existRefundItem.marks.some(existing => existing === mark)

    //                 if (!isExist) {
    //                     existRefundItem.marks.push(mark)
    //                 }
    //             }
    //         } else {
    //             const newRefundItem: DraftRefundItemSchema = {
    //                 id: draftItem.productId,
    //                 productId: draftItem.productId,
    //                 productName: draftItem.productName,
    //                 productPackageId: draftItem.productPackageId,
    //                 productPackageName: draftItem.productPackageName,
    //                 priceAmount: draftItem.priceAmount,
    //                 priceTypeId: draftItem.priceTypeId,
    //                 quantity: draftItem.quantity,
    //                 totalAmount: draftItem.totalAmount,
    //                 ...(mark ? { marks: [mark] } : {}),
    //             }
    //             activeRefund.items.unshift(newRefundItem)
    //         }
    //     }

    // }),

    // deleteDraftRefundItem: (draftRefundItemIndex) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.items.splice(draftRefundItemIndex, 1)
    //     }
    // }),
    // incrementDraftRefundItemQuantity: (draftRefundItemIndex) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         const item = activeRefund.items[draftRefundItemIndex]
    //         const count = item.quantity + 1
    //         item.quantity = count
    //         item.totalAmount = item.priceAmount * count
    //     }
    // }),
    // decrementDraftRefundItemQuantity: (draftRefundItemIndex) => set((state) => {
    //     const activeRefund = state.draftRefunds.find((sale) => sale.isActive)
    //     if (activeRefund && activeRefund.items[draftRefundItemIndex].quantity > 1) {
    //         const item = activeRefund.items[draftRefundItemIndex]
    //         const count = item.quantity - 1
    //         item.quantity = count
    //         item.totalAmount = item.priceAmount * count
    //     }
    // }),
    // updateDraftRefundItemQuantity: (draftRefundItemIndex, quantity) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.items[draftRefundItemIndex].quantity = quantity
    //     }
    // }),
    // updateDraftRefundItemPrice: (draftRefundItemIndex, priceAmount) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.items[draftRefundItemIndex].priceAmount = priceAmount
    //     }
    // }),
    // updateDraftRefundItemTotalPrice: (draftRefundItemIndex, totalPrice) => set((state) => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.items[draftRefundItemIndex].totalAmount = totalPrice
    //     }
    // }),
    // updateDraftRefundPayout: payout => set(state => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.payout = { amounts: payout }
    //     }
    // }),
    // deleteDraftRefundMark: (item) => set(state => {
    //     const activeRefund = state.draftRefunds.find(s => s.isActive)
    //     if (activeRefund) {
    //         activeRefund.items.find(i => i.productId === item.productId)?.marks?.splice(item.index, 1)
    //     }
    // })
  }))
);
