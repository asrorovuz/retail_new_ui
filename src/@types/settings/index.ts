export type SettingsType = {
  date_format: string;
  lang: string;
  number_format: "comma" | "dot" | "decimal" | "money";
  printer_name: string | "";
  scale: number;
  receipt_size: "80" | "58";
  fiscalization_enabled: boolean;
  auto_print_receipt: boolean;
  enable_create_unknown_product: boolean;
  shift: {
    shift_enabled: boolean;
  };
};

export type TableColumnSetting = {
  key: string;
  visible?: boolean;
  color?: string;
  defaultColor?: string;
};

export type SettingsStoreInitialState = {
  settings: SettingsType | null;
  tableSettings: TableColumnSetting[];
  wareHouseId: null | number;
};

export type SettingsStoreActions = {
  setSettings: (payload: SettingsType | null) => void;
  setTableSettings: (payload: TableColumnSetting[]) => void;
  setWareHouseId: (payload: number) => void;
};

export type WareHouseDataType = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
};
