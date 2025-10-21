export type FavouriteProduct = {
  product_id: number | null;
  product_package_id: number | null;
}

export type ProductModalProps = {
  type: "add" | "edit";
  setType: (value: "add" | "edit") => void;
}

// 🪙 Valyuta tipi
interface CurrencyType {
  code: number;
  name: string;
  rate: number;
}

// 💵 Narx tipi
interface PriceType {
  amount: number | null;
  price_type: string; // agar bu object bo‘lsa, shunga qarab o‘zgartiramiz
  currency: CurrencyType;
}

// 📦 Paket tipi
interface PackageType {
  is_default: boolean;
  isActive: boolean;
  category: string | null;
  barcodes: string[];
  images: string[];
  catalog_code: string | null;
  catalog_name: string | null;
  package_code: string | null;
  package_name: string | null;
  sku: string | null;
  code: string | null;
  measurement_name: string;
  vat_rate: number | null;
  prices: PriceType[];
  count: number;
}

// 🏷️ Asosiy mahsulot tipi
export interface ProductDefaultValues {
  name: string;
  purchase_price: {
    amount: number | null;
    currency: CurrencyType;
  };
  packages: PackageType[];
}
