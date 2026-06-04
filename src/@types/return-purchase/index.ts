export type DraftReturnPurchaseSchema = {
    id?: number;
    isActive: boolean;
    items: DraftReturnPurchaseItemSchema[];
    payout?: DraftReturnPurchasePayoutSchema;
    discountAmount?: string;
    contractor_id?: number | null;
};

export type DraftReturnPurchaseItemSchema = {
    id?: number;
    productId: number;
    productName: string;
    productPackageName: string | null;
    priceAmount: number;
    priceTypeId: number;
    quantity: number;
    totalAmount: number;
    marks?: string[];
    catalogName?: string;
    catalogCode?: string;
};

export type DraftReturnPurchasePayoutSchema = {
    amounts: DraftReturnPurchasePayoutAmountSchema[];
};

export type DraftReturnPurchasePayoutAmountSchema = {
    amount: string;
    paymentType: number;
};

export interface ReturnPurchaseStoreActions {
    addDraftReturnPurchase: (payload: DraftReturnPurchaseSchema) => void;
    activateDraftReturnPurchase: (index: number) => void;
    updateDraftReturnPurchaseItem: (payload: DraftReturnPurchaseItemSchema) => void;
    addDraftReturnPurchaseItem: (payload: DraftReturnPurchaseItemSchema) => void;
    updateDraftReturnPurchaseDiscount: (discountAmount: string) => void;
    deleteDraftReturnPurchase: (index: number) => void;
    deleteDraftReturnPurchaseItem: (index: number) => void;
    updateDraftReturnPurchaseItemQuantity: (index: number, quantity: number) => void;
    updateDraftReturnPurchaseItemPrice: (index: number, priceAmount: number) => void;
    updateDraftReturnPurchaseItemTotalPrice: (index: number, totalPrice: number) => void;
    updateDraftReturnPurchasePayout: (payout: DraftReturnPurchasePayoutAmountSchema[]) => void;
    completeActiveDraftReturnPurchase: () => void;
    setReturnPurchaseContractorId: (val: number | null) => void;
    deleteDraftReturnPurchaseMark: (item: { productId: number; index: number }) => void;
}

export interface ReturnPurchaseStoreInitialState {
    draftReturnPurchases: DraftReturnPurchaseSchema[];
}

type ReturnPurchaseMoney = {
    amount: number;
    currency_code: number;
};

type ReturnPurchaseMoneyMovement = ReturnPurchaseMoney & {
    type?: number;
};

type ReturnPurchasePaymentModel = {
    debt_states: ReturnPurchaseMoney[];
    cash_box_states: ReturnPurchaseMoneyMovement[];
};

export type ReturnPurchaseItemModel = {
    product_id: number;
    warehouse_id: number | null;
    quantity: number;
    price: ReturnPurchaseMoney;
    price_type_id: number;
};

export type RegisterReturnPurchaseModel = {
    number?: string;
    date?: string;
    is_approved: boolean;
    contractor_id?: number;
    cash_box_id?: number | null;
    payout?: ReturnPurchasePaymentModel;
    exact_discount: ReturnPurchaseMoney[];
    items: ReturnPurchaseItemModel[];
};
