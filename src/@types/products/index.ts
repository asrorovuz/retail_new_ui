interface CategoryType {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  name: string;
  parent_id: number | null;
}

export interface Barcode {
  id: number;
  value: string;
}

export interface Currency {
  code: number;
  created_at: string;
  updated_at: string;
  name: string;
  rate: number;
  is_national: boolean;
  is_active: boolean;
  is_default: boolean;
}

export interface ProductPriceType {
  id: number;
  name: string;
  is_primary: boolean;
  is_bulk: boolean;
}

export interface Price {
  id: number;
  product_price_type: ProductPriceType;
  currency: Currency;
  amount: number;
}

export interface Warehouse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
}

export interface WarehouseItem {
  id: number;
  warehouse: Warehouse;
  state: number;
  alert_on: string | null;
  purchase_price_amount: number;
  purchase_price_currency: Currency;
}

export interface Product {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  name: string;
  vat_rate: number | null;
  measurement_name?: string | null;
  measurement_code: number;
  count: number;
  state?: number;
  package?: any;
  category_id: number | null;
  catalog_code: string | null;
  catalog_name: string | null;
  package_code: string | null;
  package_name: string | null;
  sku: string | null;
  code: string | null;
  category: CategoryType | null;
  barcodes?: Barcode[] | [];
  images?:
    | {
        id: number;
        img?: string;
        name: string;
        fs_url?: string;
      }[]
    | [];
  prices?: Price[];
  warehouse_items?: WarehouseItem[];
}

export interface FavouriteProductType {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  key_code: null | number | string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  product: Product;
}

export type ProductColumnVisibility = {
  article: { visible: boolean; color?: string };
  code: { visible: boolean; color?: string };
  measurement_name: { visible: boolean; color?: string };
  package_quantity: { visible: boolean; color?: string };
  primary_price: { visible: boolean; color?: string };
  product_name: { visible: boolean; color?: string };
  purchase_price: { visible: boolean; color?: string };
  total_warehouses_state: { visible: boolean; color?: string };
};

export type CategoryTypeModal = {
  name: string;
  parent_id: number;
};

export type CategoryResponse = {
  created_at: Date | string;
  deleted_at: string | null;
  id: number;
  is_deleted: boolean;
  name: string;
  parent_id: number;
  updated_at: Date | string;
};

export type VatRateSelectorOption = {
  label: string;
  value: number | null;
};

export type AlertOntype = {
  warehouse_id: number;
  product_id: number;
  alert_on: number;
};

export type AlertOntypeResponse = {
  id: number;
  warehouse_id: number;
  product_id: number;
  state: number;
  purchase_price_amount: number;
  alert_on: number;
  purchase_price_currency_code: number;
};

export type RegisterType = {
  is_approved: boolean;
  items: {
    product_id: number;
    warehouse_id: number | null;
    quantity: number;
  }[];
};
