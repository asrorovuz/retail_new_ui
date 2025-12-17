import { Button } from "@/shared/ui/kit";
import { useEffect, useState, type FC } from "react";
import type { ProductDefaultValues, ProductModalProps } from "../model";
import ProductForm from "@/features/product-form";
import {
  CurrencyCodeUZS,
  CurrencyCodeUZSText,
  CurrencyRateUZS,
} from "@/app/constants/paymentType";
import type { ProductPriceType } from "@/@types/products";
import { useCatalogSearchApi } from "@/entities/products/repository";

const AddProductModal: FC<ProductModalProps> = ({
  type,
  pageType,
  setType,
  setBarcode,
  barcode,
  productPriceType,
  setIsOpen,
  isOpen,
}) => {
  const [defaultValues, setDefaultValues] = useState<ProductDefaultValues>();
  const { data: catalogData, isLoading } = useCatalogSearchApi(barcode || "", isOpen);
  const openModal = () => {
    setType("add");
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      const prices = productPriceType?.map(
        (i: ProductPriceType, inx: number) => ({
          amount: inx ? 0 : null,
          price_type: i,
          currency: {
            code: CurrencyCodeUZS,
            name: CurrencyCodeUZSText,
            rate: CurrencyRateUZS,
          },
        })
      );

      setDefaultValues({
        name: catalogData?.[0]?.name ?? "",
        barcodes: [
          catalogData?.[0]?.barcode ||
            barcode ||
            Date.now().toString().slice(0, 13),
        ],
        catalog_code: catalogData?.[0]?.class_code,
        catalog_name: catalogData?.[0]?.class_name,
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
        images: [],
        category: null,
        isActive: true,
        sku: null,
        code: null,
        measurement_name: "Штук",
        vat_rate: null,
        prices,
        count: 1,
        catalog:
          catalogData && catalogData?.length > 0
            ? {
                data: catalogData?.[0],
                label: catalogData?.[0]?.class_name,
                value: catalogData?.[0]?.class_code,
              }
            : null,
        is_default: true,
      });
    }
  }, [isOpen, productPriceType, catalogData]);

  useEffect(() => {
    if (!isOpen) {
      setDefaultValues(undefined);
      setBarcode(null);
    }
  }, [isOpen]);

  return (
    <div>
      {pageType === "products" && (
        <Button onClick={openModal} variant="solid">
          Добавить
        </Button>
      )}

      {defaultValues && (
        <ProductForm
          type={type}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          catalogLoading={isLoading}
          setType={setType}
          defaultValue={defaultValues!} // '!' bilan null bo'lmasligini bildiramiz
          barcode={barcode}
          setBarcode={setBarcode}
        />
      )}
    </div>
  );
};

export default AddProductModal;
