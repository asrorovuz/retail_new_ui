import type { PaymentType } from "../common";

export type DraftSaleSchema = {
  id?: number;
  isActive: boolean;
  items: DraftSaleItemSchema[];
  payment?: DraftSalePaymentSchema;
  discountAmount?: number;
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

export type SaleListItemType = {
  // TODO implement this type based on the API response
  created_at: string;
  contractor: ContractorType;
  cash_box: CashBoxType;
  updated_at: string;
  date: string;
  exact_discounts: {
    amount: number;
    currency: SaleListItemProductPriceCurrencyType;
  }[];
  id: number;
  is_approved: boolean;
  is_deleted: boolean;
  is_fiscalized: boolean;
  is_for_debt: boolean;
  number: string;
  type: number;
  used_warehouses: any[];
  employee: CashBoxType;
  total: number;
  percent_discount: number;
  totals: {
    amount: number;
    currency: SaleListItemProductPriceCurrencyType;
  }[];
  payment: PaymentType;
  payout: PaymentType;
  payment_id: number;
  payout_id: number;
  net_price: {
    amount: number;
    currency: SaleListItemProductPriceCurrencyType;
  }[];
  debts: {
    amount: number;
    currency: SaleListItemProductPriceCurrencyType;
  }[];
  items: SaleListItemProductType[];
};

type ContractorType = {
  id: number;
  name: string;
  is_customer: boolean;
  is_default: boolean;
  is_deleted: boolean;
  is_supplier: boolean;
};

type CashBoxType = {
  id: number;
  name: string;
};

type SaleListItemProductType = {
  created_at: string;
  deleted_at: string | null;
  discount: SaleListItemProductDiscountType;
  discount_id: number;
  id: number;
  is_deleted: boolean;
  price_amount: number;
  price_currency: SaleListItemProductPriceCurrencyType;
  price_currency_code: number;
  price_type: SaleListItemProductPriceType;
  price_type_id: number;
  quantity: number;
  warehouse_item_from_id: number;
  warehouse_item_to_id: number | null;
  warehouse_operation_from: SaleListItemProductWarehouseOperationFromType;
  warehouse_operation_id: number;
  warehouse_operation_to: null;
  marks?: string[];
};

type SaleListItemProductDiscountType = {
  id: number;
  type: number;
  value: number;
  amount: number;
};

type SaleListItemProductPriceCurrencyType = {
  code: number;
  name: string;
  rate: number;
};

type SaleListItemProductPriceType = {
  id: number;
  is_bulk: boolean;
  is_primary: boolean;
  name: string;
};

type SaleListItemProductWarehouseOperationFromType = {
  id: number;
  product_package: SaleListItemProductPackageType;
  warehouse: SaleListItemWarehouseType;
};

type SaleListItemProductPackageType = {
  id: number;
  catalog_code: string | null;
  catalog_name: string | null;
  code: number | null;
  count: number;
  measurement_name: string;
  package_code: number | null;
  package_name: string | null;
  product_id: number;
  product: SaleListItemWarehouseProductType;
  sku: string | null;
};

type SaleListItemWarehouseType = {
  id: number;
  created_at: string;
  name: string;
};

type SaleListItemWarehouseProductType = {
  id: number;
  is_deleted: boolean;
  name: string;
};

export type RegisterSaleModel = {
  number?: string;
  date?: string;
  is_approved: boolean;
  contractor_id?: number;
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
  // productPackageId: number;
  productPackageName: string;
  priceAmount: number;
  priceTypeId: number;
  quantity: number;
  totalAmount: number;
  marks?: string[];
  catalogCode?: string;
  catalogName?: string;
};

type DraftSalePaymentSchema = {
  amounts: DraftSalePaymentAmountSchema[];
};
export type DraftSalePaymentAmountSchema = {
  amount: number;
  paymentType: number;
};

export interface SaleStoreActions {
  addDraftSale: (payload: DraftSaleSchema) => void;
  activateDraftSale: (index: number) => void;
  updateDraftSaleItem: (payload: DraftSaleItemSchema) => void;
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
  updateDraftSaleDiscount: (discountAmount: number) => void;
  updateDraftSalePayment: (payment: DraftSalePaymentAmountSchema[]) => void;
  completeActiveDraftSale: () => void

  // addDraftSalePaymentAmount: (payload: DraftSalePaymentAmountSchema) => void
  // updateDraftSalePaymentAmounts: (payload: DraftSalePaymentAmountSchema[]) => void

  // addDraftSaleItem: (payload: DraftSaleItemSchema) => void
  // incrementDraftSaleItemQuantity: (draftSaleItemIndex: number) => void
  // decrementDraftSaleItemQuantity: (draftSaleItemIndex: number) => void
  // deleteDraftSaleMark: (item: { productId: number, index: number }) => void
}

export interface SaleStoreInitialState {
  draftSales: DraftSaleSchema[];
}

export type PaymeProviderType = {
  id: number;
  type: number;
  is_enabled: boolean;
  info: {
    service_id: number;
    merchant_id: number;
    merchant_user_id: number;
    secret_key: string;
  } | {
    cash_box_id: string;
    cash_box_name: string;
  }
}