import { Button } from "@/shared/ui/kit";
import { useEffect, useState, type FC } from "react";
import type { ProductDefaultValues, ProductModalProps } from "../model";
import ProductForm from "@/features/product-form";
import {
  CurrencyCodeUZS,
  CurrencyCodeUZSText,
  CurrencyRateUZS,
} from "@/app/constants/paymentType";
import { useCatalogSearchApi } from "@/entities/products/repository";

const AddProductModal: FC<ProductModalProps> = ({
  type,
  pageType,
  setBarcode,
  barcode,
  productPriceType,
  setIsOpen,
  isOpen,
}) => {
  const [defaultValues, setDefaultValues] =
    useState<ProductDefaultValues | null>(null);
  const { data: catalogData, isLoading } = useCatalogSearchApi(
    barcode || "",
    isOpen,
  );
  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const prices = productPriceType?.map((i, inx) => ({
      amount: inx ? 0 : null,
      price_type: i,
      currency: {
        code: CurrencyCodeUZS,
        name: CurrencyCodeUZSText,
        rate: CurrencyRateUZS,
      },
    }));

    setDefaultValues({
      name: "",
      barcodes: [{ value: new Date().getTime().toString().slice(5, 13), count: 1 }],
      catalog_code: null,
      catalog_name: null,
      package_code: null,
      package_name: null,
      package_measurements: [],
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
      prices,
      count: 1,
      catalog: null,
      is_default: true,
    });
  }, [isOpen]);

  return (
    <div>
      {pageType === "products" && (
        <Button size="sm" onClick={openModal} variant="solid">
          Добавить
        </Button>
      )}

      {defaultValues && isOpen && (
        <ProductForm
          type={type}
          isOpen={isOpen}
          pageType={pageType}
          setIsOpen={setIsOpen}
          catalogLoading={isLoading}
          defaultValue={defaultValues!} // '!' bilan null bo'lmasligini bildiramiz
          barcode={barcode}
          setBarcode={setBarcode}
          setDefaultValues={setDefaultValues}
          catalogData={catalogData}
        />
      )}
    </div>
  );
};

export default AddProductModal;
