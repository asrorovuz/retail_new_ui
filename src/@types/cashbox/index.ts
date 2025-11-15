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
