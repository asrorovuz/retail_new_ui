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
  const { data: catalogData } = useCatalogSearchApi(barcode || "", isOpen);
  const openModal = () => {
    console.log("salom");

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
        purchase_price: {
          amount: null,
          currency: {
            code: CurrencyCodeUZS,
            name: CurrencyCodeUZSText,
            rate: CurrencyRateUZS,
          },
        },
        packages: [
          {
            is_default: true,
            isActive: true,
            category: null,
            barcodes: [
              catalogData?.[0]?.barcode ||
                barcode ||
                Date.now().toString().slice(0, 13),
            ],
            images: [],
            catalog_code: catalogData?.[0]?.class_code,
            catalog_name: catalogData?.[0]?.class_name,
            package_code: null,
            package_name: null,
            sku: null,
            code: null,
            measurement_name: "Штук",
            vat_rate: null,
            prices,
            count: 1,
            catalog: catalogData?.[0],
            package:
              catalogData?.length && catalogData[0]?.package_names.length === 1
                ? catalogData[0]?.package_names?.[0]
                : null,
          },
        ],
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
          defaultValue={defaultValues!} // '!' bilan null bo'lmasligini bildiramiz
          barcode={barcode}
          setBarcode={setBarcode}
        />
      )}
    </div>
  );
};

export default AddProductModal;
