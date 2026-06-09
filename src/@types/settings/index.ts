import type { Shift } from "../shift/schema";

export type SettingsType = {
    date_format: string;
    lang: string;
    number_format: "comma" | "dot" | "decimal" | "money";
    printer_name: string | "";
    scale: number;
    receipt_size: "80" | "58";
    fiscalization_enabled: boolean;
    fiscalization_settings: any;
    auto_print_receipt: boolean;
    enable_create_unknown_product: boolean;
    organization_inn?: string;
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
    activeShift: Shift | null;
    warhouse: any;
    permissionList: number[];
    pendingShiftOpen: boolean;
};

export type SettingsStoreActions = {
    setSettings: (payload: SettingsType | null) => void;
    setTableSettings: (payload: TableColumnSetting[]) => void;
    setWareHouseId: (payload: number) => void;
    setWareHouse: (payload: any) => void;
    setActiveShift: (payload: Shift | null) => void;
    setPermissionList: (payload: number[]) => void;
    setPendingShiftOpen: (payload: boolean) => void;
};

export type WareHouseDataType = {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
};
