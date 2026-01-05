export type DraftRefundSchema = {
  id?: number;
  isActive: boolean;
  items: DraftRefundItemSchema[];
  payout?: DraftRefundPayoutSchema;
  discountAmount?: number;
  is_fiscalized?: boolean;
};

export type DraftRefundItemSchema = {
  id?: number;
  productId: number;
  productName: string;
  // productPackageId: number;
  productPackageName: string;
  priceAmount: number;
  priceTypeId: number;
  quantity: number;
  totalAmount: number;
  marks?: string[];
  catalogName?: string;
  catalogCode?: string;
};

export type DraftRefundPayoutSchema = {
  amounts: DraftRefundPayoutAmountSchema[];
};

export type DraftRefundPayoutAmountSchema = {
  amount: number;
  paymentType: number;
};

export interface RefundStoreActions {
  addDraftRefund: (payload: DraftRefundSchema) => void;
  activateDraftRefund: (index: number) => void;
  updateDraftRefundItem: (payload: DraftRefundItemSchema) => void;
  updateDraftRefundDiscount: (discountAmount: number) => void;
  deleteDraftRefund: (draftRefundIndex: number) => void;
  deleteDraftRefundItem: (draftRefundItemIndex: number) => void;
  completeActiveDraftRefund: () => void;
  //   resetActiveDraftRefund: () => void;
  //   addDraftRefundPaymentAmount: (payload: DraftRefundPayoutAmountSchema) => void;
  updateDraftRefundPaymentAmounts: (
    paymentAmounts: DraftRefundPayoutAmountSchema[]
  ) => void;
  addDraftRefundItem: (payload: DraftRefundItemSchema) => void;
  //   incrementDraftRefundItemQuantity: (draftRefundItemIndex: number) => void;
  //   decrementDraftRefundItemQuantity: (draftRefundItemIndex: number) => void;
  updateDraftRefundItemQuantity: (
    draftRefundItemIndex: number,
    quantity: number
  ) => void;
  updateDraftRefundItemPrice: (
    draftRefundItemIndex: number,
    priceAmount: number
  ) => void;
  updateDraftRefundItemTotalPrice: (
    draftRefundItemIndex: number,
    totalPrice: number
  ) => void;
  updateDraftRefundPayout: (payout: DraftRefundPayoutAmountSchema[]) => void;
  deleteDraftRefundMark: (item: { productId: number; index: number }) => void;
}

export interface RefundStoreInitialState {
  draftRefunds: DraftRefundSchema[];
}

type RefundPaymentModel = {
  notes?: number;
  debt_states: Money[];
  cash_box_states: MoneyMovement[];
};

export type RegisterRefundModel = {
  number?: string;
  date?: string;
  is_approved: boolean;
  contractor_id?: number;
  employee_id?: number;
  cash_box_id?: number | null;
  payout?: RefundPaymentModel;
  exact_discount: Money[];
  percent_discount?: number;
  items: RefundItemModel[];
};

type Money = {
  amount: number;
  currency_code: number;
};

type MoneyMovement = Money & {
  type?: number;
};

export type RefundItemModel = {
  product_id: number;
  warehouse_id: number | null;
  quantity: number;
  price: Money;
  price_type_id: number;
  discount?: RefundItemDiscount;
  marks?: string[];
};

type RefundItemDiscount = {
  value: number;
  type: number;
};
