export interface Product {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  name: string;
  vat_rate: number | null;

  product_packages?: ProductPackage[];
  warehouse_items?: WarehouseItem[];
}

export interface ProductPackage {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  product_id: number;
  category: string | null;
  barcodes?: Barcode[];
  images?: any[];
  prices?: Price[];
  catalog_code: string | null;
  catalog_name: string | null;
  package_code: string | null;
  package_name: string | null;
  sku: string | null;
  code: string | null;
  measurement_name: string | null;
  count: number;
}

export interface Barcode {
  id: number;
  value: string;
}

export interface Price {
  id: number;
  product_price_type: ProductPriceType;
  currency: Currency;
  amount: number;
}

export interface ProductPriceType {
  id: number;
  name: string;
  is_primary: boolean;
  is_bulk: boolean;
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

export interface WarehouseItem {
  id: number;
  warehouse: Warehouse;
  state: number;
  alert_on: string | null;
  purchase_price_amount: number;
  purchase_price_currency: Currency;
}

export interface Warehouse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
}

export type ProductColumnVisibility = {
  article: { visible: boolean, color?: string };
  code: { visible: boolean, color?: string };
  measurement_name: { visible: boolean, color?: string };
  package_quantity: { visible: boolean; color?: string };
  primary_price: { visible: boolean, color?: string };
  product_name: { visible: boolean, color?: string };
  purchase_price: { visible: boolean, color?: string };
  total_warehouses_state: { visible: boolean, color?: string };
};

