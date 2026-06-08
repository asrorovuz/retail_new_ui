import { immer } from "zustand/middleware/immer";
import { PaymentTypes } from "../constants/payment.types";
import { create } from "zustand";
import type {
    DraftReturnPurchaseItemSchema,
    DraftReturnPurchaseSchema,
    ReturnPurchaseStoreActions,
    ReturnPurchaseStoreInitialState,
} from "@/@types/return-purchase";

const initialState: ReturnPurchaseStoreInitialState = {
    draftReturnPurchases: [
        {
            isActive: true,
            items: [],
            discountAmount: "0",
            contractor_id: null,
            payment: {
                amounts: PaymentTypes.map((paymentType) => ({
                    amount: "0",
                    paymentType: paymentType.type,
                })),
            },
        },
    ],
};

export const useReturnPurchaseDraftStore = create<
    ReturnPurchaseStoreInitialState & ReturnPurchaseStoreActions
>()(
    immer((set) => ({
        ...initialState,

        addDraftReturnPurchase: (draftReturnPurchase) =>
            set((state) => {
                const active = state.draftReturnPurchases.find(
                    (s: DraftReturnPurchaseSchema) => s.isActive,
                );
                if (active) active.isActive = false;

                draftReturnPurchase.isActive = true;

                if (draftReturnPurchase.id) {
                    const existIndex = state.draftReturnPurchases.findIndex(
                        (s: DraftReturnPurchaseSchema) =>
                            s.id === draftReturnPurchase.id,
                    );
                    if (existIndex !== -1) {
                        state.draftReturnPurchases[existIndex].isActive = true;
                        if (!state.draftReturnPurchases[existIndex].items) {
                            state.draftReturnPurchases[existIndex].items = [];
                        }
                        return;
                    }
                }

                state.draftReturnPurchases.push(draftReturnPurchase);
            }),

        activateDraftReturnPurchase: (index: number) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.isActive = false;
                state.draftReturnPurchases[index].isActive = true;
            }),

        deleteDraftReturnPurchase: (index: number) =>
            set((state) => {
                if (state.draftReturnPurchases.length === 1 && index === 0) {
                    state.draftReturnPurchases = [
                        {
                            items: [],
                            isActive: true,
                            discountAmount: "0",
                            contractor_id: null,
                            payment: {
                                amounts: PaymentTypes.map((pt) => ({
                                    amount: "0",
                                    paymentType: pt.type,
                                })),
                            },
                        },
                    ];
                } else {
                    let items = state.draftReturnPurchases.filter(
                        (_, i) => i !== index,
                    );
                    if (index === 0) items[0].isActive = true;
                    else items[index - 1].isActive = true;
                    state.draftReturnPurchases = items;
                }
            }),

        deleteDraftReturnPurchaseItem: (index: number) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.items.splice(index, 1);
            }),

        updateDraftReturnPurchaseItem: (draftItem: DraftReturnPurchaseItemSchema) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (!active) return;

                const existing = active.items.find(
                    (i) => i.productId === draftItem.productId,
                );

                if (existing) {
                    existing.priceAmount = draftItem.priceAmount;
                    existing.priceTypeId = draftItem.priceTypeId;

                    if (draftItem.quantity <= 0) {
                        const idx = active.items.findIndex(
                            (i) => i.productId === draftItem.productId,
                        );
                        if (idx >= 0) active.items.splice(idx, 1);
                    } else {
                        existing.quantity = draftItem.quantity;
                        existing.totalAmount = draftItem.totalAmount;
                    }
                } else {
                    if (draftItem.quantity < 0) return;
                    active.items.unshift(draftItem);
                }
            }),

        addDraftReturnPurchaseItem: (draftItem: DraftReturnPurchaseItemSchema) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                const [mark] = draftItem.marks ?? [];

                if (!active) return;

                const existing = active.items.find(
                    (i) => i.productId === draftItem.productId,
                );

                if (existing) {
                    existing.quantity += 1;
                    existing.totalAmount = existing.quantity * existing.priceAmount;
                    if (mark) {
                        existing.marks ??= [];
                        const isExist = existing.marks.some((m) => m === mark);
                        if (!isExist) existing.marks.push(mark);
                    }
                } else {
                    const newItem: DraftReturnPurchaseItemSchema = {
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
                    active.items.unshift(newItem);
                }
            }),

        updateDraftReturnPurchaseItemQuantity: (index: number, quantity: number) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.items[index].quantity = quantity;
            }),

        updateDraftReturnPurchaseItemPrice: (index: number, priceAmount: number) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.items[index].priceAmount = priceAmount;
            }),

        updateDraftReturnPurchaseItemTotalPrice: (index: number, totalPrice: number) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.items[index].totalAmount = totalPrice;
            }),

        updateDraftReturnPurchasePayout: (payment) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.payment = { amounts: payment };
            }),

        updateDraftReturnPurchaseDiscount: (discountAmount: string) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.discountAmount = discountAmount;
            }),

        completeActiveDraftReturnPurchase: () =>
            set((state) => {
                const freshDraft: DraftReturnPurchaseSchema = {
                    id: undefined,
                    isActive: true,
                    contractor_id: null,
                    discountAmount: "0",
                    items: [],
                    payment: {
                        amounts: PaymentTypes.map((pt) => ({
                            amount: "0",
                            paymentType: pt.type,
                        })),
                    },
                };
                return {
                    draftReturnPurchases: state.draftReturnPurchases.map((draft) =>
                        draft.isActive ? freshDraft : draft,
                    ),
                };
            }),

        setReturnPurchaseContractorId: (contractorId: number | null) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) active.contractor_id = contractorId;
            }),

        deleteDraftReturnPurchaseMark: (item) =>
            set((state) => {
                const active = state.draftReturnPurchases.find((s) => s.isActive);
                if (active) {
                    active.items
                        .find((i) => i.productId === item.productId)
                        ?.marks?.splice(item.index, 1);
                }
            }),
    })),
);
