// import type { PaymentType } from "../common";

export type DraftSaleSchema = {
  id?: number;
  isActive: boolean;
  contractor_id?: number | null;
  comment?: string;
  items: DraftSaleItemSchema[];
  payment?: DraftSalePaymentSchema;
  discountAmount?: string;
  is_fiscalized?: boolean;
};

export type SaleItemModel = {
  product_id: number;
  warehouse_id: number | null;
  quantity: number;
  price: Money;
  price_type_id: number;
  discount?: SaleItemDiscount;
  marks?: string[];
};

export type SaleItemDiscount = {
  value: number;
  type: number;
};
export type SalePaymentModel = {
  notes?: number;
  debt_states: Money[];
  cash_box_states: MoneyMovement[];
};

export type Money = {
  amount: number;
  currency_code: number;
};

export type MoneyMovement = Money & {
  type?: number;
};

export type RegisterSaleModel = {
  number?: string;
  date?: string;
  is_approved: boolean;
  contractor_id?: number;
  comment: string;
  employee_id?: number;
  cash_box_id?: number | null;
  payment?: SalePaymentModel;
  exact_discount: Money[];
  percent_discount?: number;
  items: SaleItemModel[];
};

export type DraftSaleItemSchema = {
  id?: number;
  productId: number;
  productName: string;
  productPackageName: any;
  priceAmount: number;
  priceAmoutBulk?: number;
  priceTypeId: number;
  quantity: number;
  totalAmount: number;
  marks?: string[];
  isMark?: boolean;
  catalogCode?: string;
  catalogName?: string;
};

type DraftSalePaymentSchema = {
  amounts: DraftSalePaymentAmountSchema[];
};
export type DraftSalePaymentAmountSchema = {
  amount: string;
  paymentType: number;
};

export interface SaleStoreActions {
  addDraftSale: (payload: DraftSaleSchema) => void;
  activateDraftSale: (index: number) => void;
  updateDraftSaleItem: (payload: DraftSaleItemSchema | any) => void;
  resetActiveDraftSale: () => void;
  deleteDraftSale: (draftSaleIndex: number) => void;
  deleteDraftSaleItem: (draftSaleItemIndex: number) => void;
  updateDraftSaleItemPrice: (
    draftSaleItemIndex: number,
    priceAmount: number
  ) => void;
  updateDraftSaleItemQuantity: (
    draftSaleItemIndex: number,
    quantity: number
  ) => void;
  updateDraftSaleItemTotalPrice: (
    draftSaleItemIndex: number,
    totalPrice: number
  ) => void;
  updateDraftSaleDiscount: (discountAmount: string) => void;
  updateDraftSalePayment: (payment: DraftSalePaymentAmountSchema[]) => void;
  completeActiveDraftSale: () => void;

  // addDraftSalePaymentAmount: (payload: DraftSalePaymentAmountSchema) => void
  // updateDraftSalePaymentAmounts: (payload: DraftSalePaymentAmountSchema[]) => void

  // addDraftSaleItem: (payload: DraftSaleItemSchema) => void;
}

export interface SaleStoreInitialState {
  draftSales: DraftSaleSchema[];
}

export type PaymeProviderType = {
  id: number;
  type: number;
  is_enabled: boolean;
  info:
    | {
        service_id: number;
        merchant_id: number;
        merchant_user_id: number;
        secret_key: string;
      }
    | {
        cash_box_id: string;
        cash_box_name: string;
      };
};
