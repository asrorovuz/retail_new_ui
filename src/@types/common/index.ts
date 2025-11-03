export type DateSchema = string;

export type CurrencySchema = {
  code: number;
  created_at: DateSchema;
  updated_at: DateSchema;
  name: string;
  rate: number;
  is_national: boolean;
  is_active: boolean;
  is_default: boolean;
};

export interface CurrencyStoreActions {
  setCurrencies: (currencies: CurrencySchema[]) => void;
  setNationalCurrency: (currency: CurrencySchema) => void;
}

export interface CurrencyStoreInitialState {
  currencies: CurrencySchema[];
  nationalCurrency: CurrencySchema;
}

export type PaymentAmount = {
  amount: number;
  paymentType: number;
};

export type PrinterPostType = {
  sale_id: number | null;
  printer_name: string;
};

export type PaymentType = {
  cash_box_states: {
    amount: number;
    currency: {
      code: number;
      name: string;
      rate: number;
      is_active: boolean;
    };
    type: number;
  }[];
  debt_states: {
    amount: number;
    currency: {
      code: number;
      name: string;
      rate: number;
      is_active: boolean;
    };
  }[];
};
