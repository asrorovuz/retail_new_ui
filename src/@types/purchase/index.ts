export type DraftPurchaseSchema = {
  id?: number;
  isActive: boolean;
  items: DraftPurchaseItemSchema[];
  payout?: DraftPurchasePayoutSchema;
  discountAmount?: number;
  is_fiscalized?: boolean;
};

export type DraftPurchaseItemSchema = {
  id?: number;
  productId: number;
  productName: string;
  // productPackageId: number;
  productPackageName: string | null;
  priceAmount: number;
  priceTypeId: number;
  quantity: number;
  totalAmount: number;
  marks?: string[];
  catalogName?: string;
  catalogCode?: string;
};

export type DraftPurchasePayoutSchema = {
  amounts: DraftPurchasePayoutAmountSchema[];
};

export type DraftPurchasePayoutAmountSchema = {
  amount: number;
  paymentType: number;
};

export interface PurchaseStoreActions {
  addDraftPurchase: (payload: DraftPurchaseSchema) => void;
  activateDraftPurchase: (index: number) => void;
  updateDraftPurchaseItem: (payload: DraftPurchaseItemSchema) => void;
  updateDraftPurchaseDiscount: (discountAmount: number) => void;
  deleteDraftPurchase: (draftPurchaseIndex: number) => void;
  deleteDraftPurchaseItem: (draftPurchaseItemIndex: number) => void;
  completeActiveDraftPurchase: () => void;
  //   //   resetActiveDraftPurchase: () => void;
  //   //   addDraftPurchasePaymentAmount: (payload: DraftPurchasePayoutAmountSchema) => void;
  //   updateDraftPurchasePaymentAmounts: (
  //     paymentAmounts: DraftPurchasePayoutAmountSchema[]
  //   ) => void;
  addDraftPurchaseItem: (payload: DraftPurchaseItemSchema) => void;
  //   //   incrementDraftPurchaseItemQuantity: (draftPurchaseItemIndex: number) => void;
  //   //   decrementDraftPurchaseItemQuantity: (draftPurchaseItemIndex: number) => void;
  updateDraftPurchaseItemQuantity: (
    draftPurchaseItemIndex: number,
    quantity: number
  ) => void;
  updateDraftPurchaseItemPrice: (
    draftPurchaseItemIndex: number,
    priceAmount: number
  ) => void;
  updateDraftPurchaseItemTotalPrice: (
    draftPurchaseItemIndex: number,
    totalPrice: number
  ) => void;

  updateDraftPurchasePayout: (
    payout: DraftPurchasePayoutAmountSchema[]
  ) => void;
  deleteDraftPurchaseMark: (item: { productId: number; index: number }) => void;
}

export interface PurchaseStoreInitialState {
  draftPurchases: DraftPurchaseSchema[];
}

type PurchasePaymentModel = {
  notes?: number;
  debt_states: Money[];
  cash_box_states: MoneyMovement[];
};

export type RegisterPurchaseModel = {
  number?: string;
  date?: string;
  is_approved: boolean;
  contractor_id?: number;
  employee_id?: number;
  cash_box_id?: number | null;
  payout?: PurchasePaymentModel;
  exact_discount: Money[];
  percent_discount?: number;
  items: PurchaseItemModel[];
};

type Money = {
  amount: number;
  currency_code: number;
};

type MoneyMovement = Money & {
  type?: number;
};

export type PurchaseItemModel = {
  product_id: number;
  warehouse_id: number | null;
  quantity: number;
  price: Money;
  price_type_id: number;
  discount?: PurchaseItemDiscount;
  marks?: string[];
};

type PurchaseItemDiscount = {
  value: number;
  type: number;
};
