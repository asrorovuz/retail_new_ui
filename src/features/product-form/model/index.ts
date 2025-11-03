import type { Product } from "@/@types/products";
import type { ProductDefaultValues } from "@/features/modals/model";

export type ProductFormType = {
  type: "add" | "edit" | "print";
  productId?: number | null;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  defaultValue: Product | ProductDefaultValues;
  barcode: string | null;
  setBarcode: (val: string | null) => void;
  setProductId?: (val: number | null) => void;
};
