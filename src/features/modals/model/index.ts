export type FavouriteProduct = {
  product_id: number | null;
  product_package_id: number | null;
};

export type ProductModalProps = {
  type: "add" | "edit";
  setType: (value: "add" | "edit") => void;
  barcode: string | null;
  setBarcode: (val: string | null) => void;
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

// 📦 Paket tipi
interface PackageType {
  is_default: boolean;
  isActive: boolean;
  category: string | null;
  barcodes: string[];
  images: string[] | [];
  catalog: CatalogItem[] | [];
  catalog_code: string | null;
  catalog_name: string | null;
  package_code: string | null;
  package_name: string | null;
  sku: string | null;
  code: string | null;
  package?: any;
  measurement_name: string;
  vat_rate: number | null;
  prices: PriceType[];
  count: number;
}

// 🏷️ Asosiy mahsulot tipi
export interface ProductDefaultValues {
  id?: number;
  name: string;
  purchase_price: {
    amount: number | null;
    currency: CurrencyType;
  };
  vat_rate?: number | null;
  packages: PackageType[];
}

