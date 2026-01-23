import type { WarehouseItem } from "@/@types/products";

export type FavouriteProduct = {
  product_id: number | null;
};

export type ProductPriceType = {
  id: number;
  name: string;
  is_primary: boolean;
  is_bulk: boolean;
};

export type ProductModalProps = {
  type: "add" | "edit" | "print";
  pageType?: string;
  barcode: string | null;
  setBarcode: (val: string | null) => void;
  productPriceType: ProductPriceType[];
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
};

export type ProductTableProps = {
  type?: "add" | "edit" | "print";
  barcode: string | null;
  isLegal?: "all" | "white" | "black";
  setBarcode: (val: string | null) => void;
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  productPriceType: ProductPriceType[];
};

// 🪙 Valyuta tipi
interface CurrencyType {
  code: number;
  name: string;
  rate: number;
}

// 💵 Narx tipi
export interface PriceType {
  amount: number | null;
  price_type: {
    id: number;
    name: string;
    is_primary: boolean;
    is_bulk: boolean;
  }; // agar bu object bo‘lsa, shunga qarab o‘zgartiramiz
  currency: CurrencyType;
}

export interface Package {
  code: number;
  name_ru: string;
  name_uz: string;
  name_lat: string;
}

export interface CatalogItem {
  barcode: string;
  class_code: string;
  name: string;
  group_name: string;
  class_name: string;
  position_name: string;
  sub_position_name: string;
  package_names: Package[] | [];
  lgotas: any | null; // agar kelajakda aniq tip bo‘lsa, uni o‘zgartirish mumkin
  use_package: boolean;
  use_count: boolean;
}

// 🏷️ Asosiy mahsulot tipi
export interface ProductDefaultValues {
  id?: number | null;
  name?: string;
  state?: number;
  purchase_price: {
    amount: number | null;
    currency: {
      code: number;
      name: string;
      rate: number;
    };
  };
  warehouse_items?: WarehouseItem[];
  vat_rate?: number | null;
  barcodes: any[];
  catalog_code?: string | null;
  catalog_name?: string | null;
  package_code: string | null;
  package_name: string | null;
  images: any[];
  category: any;
  is_legal: boolean;
  isActive?: boolean;
  sku: string | null;
  code: string | null;
  measurement_name: string;
  prices: any;
  count: number;
  catalog: any;
  is_default?: boolean;
  package?: any;
}
