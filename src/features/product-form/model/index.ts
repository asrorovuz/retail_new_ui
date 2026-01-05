import type { Product } from "@/@types/products";
import type { ProductDefaultValues } from "@/features/modals/model";

export type ProductFormType = {
  type: "add" | "edit" | "print";
  productId?: number | null;
  isOpen: boolean;
  pageType?: string | undefined;
  catalogLoading?: boolean;
  setIsOpen: (val: boolean) => void;
  defaultValue: Product | ProductDefaultValues;
  barcode: string | null;
  setBarcode: (val: string | null) => void;
  setProductId?: (val: number | null) => void;
  catalogData?: any[];
  setDefaultValues: any;
};
