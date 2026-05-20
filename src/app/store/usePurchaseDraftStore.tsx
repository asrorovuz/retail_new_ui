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
            discountAmount: "0",
            contractor_id: null,
            payout: {
                amounts: PaymentTypes.map((paymentType) => {
                    return { amount: "0", paymentType: paymentType.type };
                }),
            },
        },
    ],
    products: [],
};

export const useDraftPurchaseStore = create<
    PurchaseStoreInitialState & PurchaseStoreActions
>()(
    immer((set) => ({
        ...initialState,
        addDraftPurchase: (draftPurchase) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s: DraftPurchaseSchema) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.isActive = false;
                }

                draftPurchase.isActive = true;

                if (draftPurchase.id) {
                    const existIndex = state.draftPurchases.findIndex(
                        (s: DraftPurchaseSchema) => s.id === draftPurchase.id,
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
                    const activePurchase = state.draftPurchases.find(
                        (s) => s.isActive,
                    );
                    if (activePurchase) {
                        activePurchase.isActive = false;
                    }
                }

                state.draftPurchases[draftPurchaseIndex].isActive = true;
            }),

        deleteDraftPurchaseItem: (draftPurchaseItemIndex: number) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.items.splice(draftPurchaseItemIndex, 1);
                }
            }),
        deleteDraftPurchase: (draftPurchaseIndex: number) =>
            set((state) => {
                if (
                    state.draftPurchases.length === 1 &&
                    draftPurchaseIndex === 0
                ) {
                    const newDraftPurchase: DraftPurchaseSchema = {
                        items: [],
                        isActive: true,
                        discountAmount: "0",
                        payout: {
                            amounts: PaymentTypes.map((paymentType) => {
                                return {
                                    amount: "0",
                                    paymentType: paymentType.type,
                                };
                            }),
                        },
                    };
                    state.draftPurchases = [newDraftPurchase];
                } else {
                    let items = state.draftPurchases.filter(
                        (_, index) => index !== draftPurchaseIndex,
                    );
                    if (draftPurchaseIndex === 0) items[0].isActive = true;
                    else items[draftPurchaseIndex - 1].isActive = true;
                    state.draftPurchases = items;
                }
            }),
        updateDraftPurchaseItem: (draftItem: DraftPurchaseItemSchema) =>
            set((state) => {
                const activePurchase = state.draftPurchases?.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    const draftPurchaseItem = activePurchase.items.find((i) => {
                        return i.productId === draftItem.productId;
                    });

                    if (draftPurchaseItem) {
                        draftPurchaseItem.priceAmount = draftItem.priceAmount;
                        draftPurchaseItem.priceTypeId = draftItem.priceTypeId;

                        if (draftItem.quantity <= 0) {
                            const draftPurchaseItemIndex =
                                activePurchase.items.findIndex((i) => {
                                    return i.productId === draftItem.productId;
                                });
                            if (draftPurchaseItemIndex >= 0) {
                                activePurchase.items.splice(
                                    draftPurchaseItemIndex,
                                    1,
                                );
                            }
                        } else {
                            draftPurchaseItem.quantity = draftItem.quantity;
                            draftPurchaseItem.totalAmount =
                                draftItem.totalAmount;
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
            quantity: number,
        ) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.items[draftPurchaseItemIndex].quantity =
                        quantity;
                }
            }),
        updateDraftPurchaseItemPrice: (
            draftPurchaseItemIndex: number,
            priceAmount: number,
        ) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.items[draftPurchaseItemIndex].priceAmount =
                        priceAmount;
                }
            }),
        updateDraftPurchaseItemTotalPrice: (
            draftPurchaseItemIndex: number,
            totalPrice: number,
        ) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.items[draftPurchaseItemIndex].totalAmount =
                        totalPrice;
                }
            }),
        updateDraftPurchasePayout: (payment) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.payout = { amounts: payment };
                }
            }),
        updateDraftPurchaseDiscount: (discountAmount: string) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.discountAmount = discountAmount;
                }
            }),
        // completeActiveDraftPurchase: () =>

        //     set((state) => {
        //         const activePurchaseIndex = state.draftPurchases.findIndex(
        //             (s) => s.isActive,
        //         );

        //         if (state.draftPurchases.length > 1) {
        //             state.draftPurchases.splice(activePurchaseIndex, 1);

        //             const previousPurchaseIndex =
        //                 state.draftPurchases.length - 1;
        //             state.draftPurchases[previousPurchaseIndex].isActive = true;
        //         } else {
        //             const activePurchase = state.draftPurchases.find(
        //                 (s) => s.isActive,
        //             );
        //             if (activePurchase) {
        //                 if (activePurchase.id) {
        //                     const newDraftPurchase: DraftPurchaseSchema = {
        //                         items: [],
        //                         isActive: true,
        //                         discountAmount: "0",
        //                         payout: {
        //                             amounts: PaymentTypes.map((paymentType) => {
        //                                 return {
        //                                     amount: "0",
        //                                     paymentType: paymentType.type,
        //                                 };
        //                             }),
        //                         },
        //                     };
        //                     state.draftPurchases = [newDraftPurchase];
        //                 } else {
        //                     activePurchase.items = [];
        //                     activePurchase.discountAmount = "0";
        //                     if (activePurchase.payout) {
        //                         activePurchase.payout.amounts.forEach(
        //                             (a) => (a.amount = "0"),
        //                         );
        //                     }
        //                 }
        //             }
        //         }
        //     }),
        completeActiveDraftPurchase: () => {
            set((state) => {
                const freshDraft: DraftPurchaseSchema = {
                    id: undefined,
                    isActive: true,
                    contractor_id: null,
                    discountAmount: "0",
                    items: [],
                    payout: {
                        amounts: PaymentTypes?.map((paymentType) => ({
                            amount: "0",
                            paymentType: paymentType.type,
                        })),
                    },
                };

                return {
                    // active draftni yangi bilan almashtir, qolganlarni saqla
                    draftPurchases: state.draftPurchases.map((draft) =>
                        draft.isActive ? freshDraft : draft,
                    ),
                    products: [],
                };
            });
        },
        deleteDraftPurchaseMark: (item) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.items
                        .find((i) => i.productId === item?.productId)
                        ?.marks?.splice(item.index, 1);
                }
            }),
        addDraftPurchaseItem: (draftItem) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                const [mark] = draftItem.marks ?? [];

                if (activePurchase) {
                    const existPurchaseItem = activePurchase.items.find((i) => {
                        return i.productId === draftItem.productId;
                    });

                    if (existPurchaseItem) {
                        existPurchaseItem.quantity += 1;
                        existPurchaseItem.totalAmount =
                            existPurchaseItem.quantity *
                            existPurchaseItem.priceAmount;
                        if (mark) {
                            existPurchaseItem.marks ??= [];

                            const isExist = existPurchaseItem.marks.some(
                                (existing) => existing === mark,
                            );

                            if (!isExist) {
                                existPurchaseItem.marks.push(mark);
                            }
                        }
                    } else {
                        const newPurchaseItem: DraftPurchaseItemSchema = {
                            id: draftItem.productId,
                            productId: draftItem.productId,
                            productName: draftItem.productName,
                            productPackageName: draftItem.productPackageName,
                            priceAmount: draftItem.priceAmount,
                            priceTypeId: draftItem.priceTypeId,
                            quantity: draftItem.quantity,
                            totalAmount: draftItem.totalAmount,
                            catalogName: draftItem.catalogName,
                            catalogCode: draftItem.catalogCode,
                            ...(mark ? { marks: [mark] } : {}),
                        };
                        activePurchase.items.unshift(newPurchaseItem);
                    }
                }
            }),
        addProducts: (product: any) =>
            set((state: any) => {
                const exist = state.products.some(
                    (p: any) => p.productId === product.id,
                );

                if (exist) return;

                state.products.push({
                    productId: product.id,
                    prices: product.prices?.map((el: any) => {
                        return {
                            ...el,
                            amount: String(el?.amount),
                        };
                    }),
                });
            }),
        updatePrices: (product: any, amount: string) =>
            set((state: any) => ({
                products: state.products.map((p: any) => {
                    if (p.productId !== product.id) return p;

                    return {
                        ...p,
                        prices: p.prices.map((price: any) =>
                            price.id === product.price_id
                                ? { ...price, amount }
                                : price,
                        ),
                    };
                }),
            })),

        setContractorId: (contractorId: number | null) =>
            set((state) => {
                const activePurchase = state.draftPurchases.find(
                    (s) => s.isActive,
                );
                if (activePurchase) {
                    activePurchase.contractor_id = contractorId;
                }
            }),
    })),
);
