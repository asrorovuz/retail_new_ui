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
  productPackageId: number;
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
  //   deleteDraftRefund: (draftRefundIndex: number) => void;
  //   completeActiveDraftRefund: () => void;
  //   resetActiveDraftRefund: () => void;
  //   updateDraftRefundDiscount: (discountAmount: number) => void;
  //   addDraftRefundPaymentAmount: (payload: DraftRefundPayoutAmountSchema) => void;
  //   updateDraftRefundPaymentAmounts: (
  //     paymentAmounts: DraftRefundPayoutAmountSchema[]
  //   ) => void;
  //   addDraftRefundItem: (payload: DraftRefundItemSchema) => void;
  //   updateDraftRefundItem: (payload: DraftRefundItemSchema) => void;
  //   deleteDraftRefundItem: (draftRefundItemIndex: number) => void;
  //   incrementDraftRefundItemQuantity: (draftRefundItemIndex: number) => void;
  //   decrementDraftRefundItemQuantity: (draftRefundItemIndex: number) => void;
  //   updateDraftRefundItemQuantity: (
  //     draftRefundItemIndex: number,
  //     quantity: number
  //   ) => void;
  //   updateDraftRefundItemPrice: (
  //     draftRefundItemIndex: number,
  //     priceAmount: number
  //   ) => void;
  //   updateDraftRefundItemTotalPrice: (
  //     draftRefundItemIndex: number,
  //     totalPrice: number
  //   ) => void;
  //   updateDraftRefundPayout: (payout: DraftRefundPayoutAmountSchema[]) => void;
  //   deleteDraftRefundMark: (item: { productId: number; index: number }) => void;
}

export interface RefundStoreInitialState {
  draftRefunds: DraftRefundSchema[];
}
