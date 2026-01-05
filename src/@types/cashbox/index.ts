export type CurrencyType = {
  code: number;
  name: string;
  is_active: boolean;
  is_default: boolean;
  is_national: boolean;
  rate: number;
  created_at: string;
  updated_at: string;
};

export type AmountType = {
  id: number;
  amount: number;
  currency: CurrencyType;
  money_type: number;
};

export type CashboxType = {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  is_deleted: boolean;
  name: string;
  amounts: AmountType[];
};

export const paymentTypes: Record<number | string, string> = {
  1: "Наличные",
  cash: "Наличные",
  2: "Uzcard",
  uzcard: "Uzcard",
  3: "Humo",
  humo: "Humo",
  4: "Перечисление",
  bankTransfer: "Перечисление",
  5: "Click",
  click: "Click",
  6: "Payme",
  payme: "Payme",
  7: "Visa",
  visa: "Visa",
};
