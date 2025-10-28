import type {
  DraftSaleSchema,
  SaleStoreActions,
  SaleStoreInitialState,
  DraftSaleItemSchema,
} from "@/@types/sale";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PaymentTypes } from "../constants/payment.types";

const initialState: SaleStoreInitialState = {
  draftSales: [
    {
      items: [],
      isActive: true,
      discountAmount: 0,
      payment: {
        amounts: PaymentTypes.map((paymentType) => {
          return { amount: 0, paymentType: paymentType.type };
        }),
      },
    },
  ],
};

export const useDraftSaleStore = create<
  SaleStoreInitialState & SaleStoreActions
>()(
  immer((set) => ({
    ...initialState,
    addDraftSale: (draftSale) =>
      set((state) => {
        const activeSale = state.draftSales.find(
          (s: DraftSaleSchema) => s.isActive
        );
        if (activeSale) {
          activeSale.isActive = false;
        }

        draftSale.isActive = true;

        if (draftSale.id) {
          const existIndex = state.draftSales.findIndex(
            (s: DraftSaleSchema) => s.id === draftSale.id
          );
          if (existIndex !== -1) {
            state.draftSales[existIndex].isActive = true;
            if (!state.draftSales[existIndex].items) {
              state.draftSales[existIndex].items = [];
            }
            return;
          }
        }

        state.draftSales.push(draftSale);
      }),
    deleteDraftSale: (draftSaleIndex: number) =>
      set((state) => {
        if (state.draftSales.length === 1 && draftSaleIndex === 0) {
          const newDraftSale: DraftSaleSchema = {
            items: [],
            isActive: true,
            discountAmount: 0,
            payment: {
              amounts: PaymentTypes.map((paymentType) => {
                return { amount: 0, paymentType: paymentType.type };
              }),
            },
          };
          state.draftSales = [newDraftSale];
        } else {
          let items = state.draftSales.filter(
            (_, index) => index !== draftSaleIndex
          );
          if (draftSaleIndex === 0) items[0].isActive = true;
          else items[draftSaleIndex - 1].isActive = true;
          state.draftSales = items;
        }
      }),
    activateDraftSale: (draftSaleIndex: number) =>
      set((state) => {
        if (state.draftSales.length > 0) {
          const activeSale = state.draftSales.find((s) => s.isActive);
          if (activeSale) {
            activeSale.isActive = false;
          }
        }

        state.draftSales[draftSaleIndex].isActive = true;
      }),
    updateDraftSaleItem: (draftItem: DraftSaleItemSchema) =>
      set((state) => {
        const activeSale = state.draftSales?.find((s) => s.isActive);
        if (activeSale) {
          const draftSaleItem = activeSale.items.find((i) => {
            return (
              i.productId === draftItem.productId &&
              i.productPackageId === draftItem.productPackageId
            );
          });

          if (draftSaleItem) {
            draftSaleItem.priceAmount = draftItem.priceAmount;
            draftSaleItem.priceTypeId = draftItem.priceTypeId;

            if (draftItem.quantity <= 0) {
              const draftSaleItemIndex = activeSale.items.findIndex((i) => {
                return (
                  i.productId === draftItem.productId &&
                  i.productPackageId === draftItem.productPackageId
                );
              });
              if (draftSaleItemIndex >= 0) {
                activeSale.items.splice(draftSaleItemIndex, 1);
              }
            } else {
              draftSaleItem.quantity = draftItem.quantity;
              draftSaleItem.totalAmount = draftItem.totalAmount;
            }
          } else {
            if (draftItem.quantity < 0) {
              return;
            }
            activeSale.items.unshift(draftItem);
          }
        }
      }),
    resetActiveDraftSale: () =>
      set((state) => {
        const activeSale = state.draftSales.find((s) => s.isActive);
        if (activeSale) {
          activeSale.items = [];
          activeSale.discountAmount = 0;
          if (activeSale.payment) {
            activeSale.payment.amounts.forEach((a) => (a.amount = 0));
          }
        }
      }),
    deleteDraftSaleItem: (draftSaleItemIndex: number) =>
      set((state) => {
        const activeSale = state.draftSales.find((s) => s.isActive);
        if (activeSale) {
          activeSale.items.splice(draftSaleItemIndex, 1);
        }
      }),
    // completeActiveDraftSale: () => set((state) => {
    //     const activeSaleIndex = state.draftSales.findIndex(s => s.isActive)

    //     if (state.draftSales.length > 1) {
    //         state.draftSales.splice(activeSaleIndex, 1)

    //         const previousSaleIndex = state.draftSales.length - 1
    //         state.draftSales[previousSaleIndex].isActive = true
    //     } else {
    //         const activeSale = state.draftSales.find(s => s.isActive)
    //         if (activeSale) {
    //             if (activeSale.id) {
    //                 const newDraftSale: DraftSaleSchema = {
    //                     items: [],
    //                     isActive: true,
    //                     discountAmount: 0,
    //                     payment: {
    //                         amounts: PaymentTypes.map(paymentType => {
    //                             return {amount: 0, paymentType: paymentType.type}
    //                         })
    //                     }
    //                 }
    //                 state.draftSales = [newDraftSale]
    //             } else {
    //                 activeSale.items = []
    //                 activeSale.discountAmount = 0
    //                 if (activeSale.payment) {
    //                     activeSale.payment.amounts.forEach(a => a.amount = 0)
    //                 }
    //             }
    //         }
    //     }
    // }),

    // updateDraftSaleDiscount: (discountAmount) => set((state) => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     if (activeSale) {
    //         activeSale.discountAmount = discountAmount
    //     }
    // }),
    // addDraftSalePaymentAmount: (payload: DraftSalePaymentAmountSchema) => set((state) => {

    // }),
    // updateDraftSalePaymentAmounts: (paymentAmounts: DraftSalePaymentAmountSchema[]) => set((state) => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     if (!activeSale) return

    //     const newPaymentAmounts: DraftSalePaymentAmountSchema[] = []
    //     for (let i = 0; i < paymentAmounts.length; i++) {
    //         newPaymentAmounts.push({
    //             amount: paymentAmounts[i].amount,
    //             paymentType: paymentAmounts[i].paymentType
    //         })
    //     }
    //     activeSale.payment = { amounts: newPaymentAmounts }
    // }),

    // addDraftSaleItem: (draftItem) => set((state) => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     const [mark] = draftItem.marks ?? []

    //     if (activeSale) {
    //         const existSaleItem = activeSale.items.find(i => {
    //             return i.productId === draftItem.productId && i.productPackageId === draftItem.productPackageId
    //         })

    //         if (existSaleItem) {
    //             existSaleItem.quantity += draftItem.quantity
    //             existSaleItem.totalAmount += draftItem.totalAmount
    //             if (mark) {
    //                 existSaleItem.marks ??= []

    //                 const isExist = existSaleItem.marks.some(existing => existing === mark)

    //                 if (!isExist) {
    //                     existSaleItem.marks.push(mark)
    //                 }
    //             }
    //         } else {
    //             const newSaleItem: DraftSaleItemSchema = {
    //                 id: draftItem.productId,
    //                 productId: draftItem.productId,
    //                 productName: draftItem.productName,
    //                 productPackageId: draftItem.productPackageId,
    //                 productPackageName: draftItem.productPackageName,
    //                 priceAmount: draftItem.priceAmount,
    //                 priceTypeId: draftItem.priceTypeId,
    //                 quantity: draftItem.quantity,
    //                 totalAmount: draftItem.totalAmount,
    //                 catalogName: draftItem.catalogName,
    //                 catalogCode: draftItem.catalogCode,
    //                 ...(mark ? { marks: [mark] } : {}),
    //             }
    //             activeSale.items.unshift(newSaleItem)
    //         }
    //     }

    // }),

    // incrementDraftSaleItemQuantity: (index) => set((state) => {
    //     const active = state.draftSales.find(s => s.isActive)
    //     if (!active) return
    //     const item = active.items[index]
    //     item.quantity++
    //     item.totalAmount = item.priceAmount * item.quantity
    // }),
    // decrementDraftSaleItemQuantity: (index) => set((state) => {
    //     const active = state.draftSales.find(s => s.isActive)
    //     if (!active) return
    //     const item = active.items[index]
    //     if (item.quantity > 1) {
    //         item.quantity--
    //         item.totalAmount = item.priceAmount * item.quantity
    //     }
    // }),
    // updateDraftSaleItemQuantity: (draftSaleItemIndex, quantity) => set((state) => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     if (activeSale) {
    //         activeSale.items[draftSaleItemIndex].quantity = quantity
    //     }
    // }),
    // updateDraftSaleItemPrice: (draftSaleItemIndex, priceAmount) => set((state) => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     if (activeSale) {
    //         activeSale.items[draftSaleItemIndex].priceAmount = priceAmount
    //     }
    // }),
    // updateDraftSaleItemTotalPrice: (draftSaleItemIndex, totalPrice) => set((state) => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     if (activeSale) {
    //         activeSale.items[draftSaleItemIndex].totalAmount = totalPrice
    //     }
    // }),
    // updateDraftSalePayment: payment => set(state => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     if (activeSale) {
    //         activeSale.payment = { amounts: payment }
    //     }
    // }),
    // deleteDraftSaleMark: (item) => set(state => {
    //     const activeSale = state.draftSales.find(s => s.isActive)
    //     if (activeSale) {
    //         activeSale.items.find(i => i.productId === item.productId)?.marks?.splice(item.index, 1)
    //     }
    // })
  }))
);
