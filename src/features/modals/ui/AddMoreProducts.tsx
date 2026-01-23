import { Button, Dialog } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import type { ProductDefaultValues, ProductPriceType } from "../model";
import { ProductFormMultiple } from "@/features/product-form";
import {
  CurrencyCodeUZS,
  CurrencyCodeUZSText,
  CurrencyRateUZS,
} from "@/app/constants/paymentType";
import { useCatalogSearchApi } from "@/entities/products/repository";

const AddMoreProducts = ({
  productPriceType,
  barcode,
  setBarcode,
  isOpen,
  setIsOpen,
}: {
  productPriceType: ProductPriceType[] | undefined;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  barcode: string | null;
  setBarcode: (val: string | null) => void;
}) => {
  const [products, setProducts] = useState<ProductDefaultValues[]>([]);

  const { data: catalogData } = useCatalogSearchApi(barcode || "", !!barcode);

  /* 🔹 default product */
  const createEmptyProduct = (barcode?: string): ProductDefaultValues => ({
    name: "",
    barcodes: [barcode],
    catalog_code: null,
    catalog_name: null,
    package_code: null,
    package_name: null,
    purchase_price: {
      amount: null,
      currency: {
        code: CurrencyCodeUZS,
        name: CurrencyCodeUZSText,
        rate: CurrencyRateUZS,
      },
    },
    is_legal: true,
    images: [],
    category: null,
    isActive: true,
    sku: null,
    code: null,
    measurement_name: "Штук",
    vat_rate: null,
    prices: productPriceType?.map((p, i) => ({
      amount: i ? 0 : null,
      price_type: p,
      currency: {
        code: CurrencyCodeUZS,
        name: CurrencyCodeUZSText,
        rate: CurrencyRateUZS,
      },
    })),
    count: 1,
    catalog: null,
    is_default: true,
  });

  /* 🔹 modal ochilganda 1 ta product */
  useEffect(() => {
    if (isOpen && !barcode) {
      setProducts([createEmptyProduct()]);
    }
  }, [isOpen]);

  const addProduct = (append: any) => {
    append(createEmptyProduct());
  };

  const removeProduct = (index: number) => {
    setProducts((prev) =>
      prev.length === 1
        ? [createEmptyProduct()] // ❗ o‘chirish emas, tozalash
        : prev.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="solid">
        Добавить товары
      </Button>

      <Dialog
        width="90vw"
        height="90vh"
        title="Добавление товаров"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setProducts([]);
          setBarcode(null);
        }}
      >
        <div className="h-[calc(90vh-108px)] overflow-y-auto flex flex-col">
          <ProductFormMultiple
            name="products"
            products={products}
            barcode={barcode}
            setBarcode={setBarcode}
            catalogData={catalogData}
            onRemove={removeProduct}
            addProduct={addProduct}
            setProducts={setProducts}
            createEmptyProduct={createEmptyProduct}
          />
        </div>
      </Dialog>
    </>
  );
};

export default AddMoreProducts;
