export interface WarehouseOperation {
  created_at: string;
  deleted_at: string;
  id: number;
  is_deleted: boolean;
  quantity: number;
  updated_at: string;
  warehouse_operation_from: WarehouseOperationFrom;
}

export interface WarehouseOperationFrom {
  id: number;
  product: Product;
  warehouse: Warehouse;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  sku: string;
  catalog_code: string;
  catalog_name: string;
  category_id: number;
  category: Category;
  barcodes: Barcode[];
  images: ProductImage[];
  package_measurements: PackageMeasurement[];
  prices: ProductPrice[];
  warehouse_items: WarehouseItem[];
  package_code: string;
  package_name: string;
  measurement_code: number;
  vat_rate: number;
  is_deleted: boolean;
  is_legal: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface Barcode {
  id: number;
  value: string;
  count: number;
}

export interface ProductImage {
  id: number;
  name: string;
  fs_url: string;
}

export interface PackageMeasurement {
  product_id: number;
  name: string;
  quantity: number;
}

export interface ProductPrice {
  id: number;
  amount: number;
  currency: Currency;
  product_price_type: ProductPriceType;
}

export interface Currency {
  code: number;
  name: string;
  rate: number;
  is_active: boolean;
  is_default: boolean;
  is_national: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPriceType {
  id: number;
  name: string;
  is_bulk: boolean;
  is_primary: boolean;
}

export interface WarehouseItem {
  id: number;
  alert_on: number;
  purchase_price_amount: number;
  purchase_price_currency: Currency;
  state: number;
  warehouse: Warehouse;
}

export interface Warehouse {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}