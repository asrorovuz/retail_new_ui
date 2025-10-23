import { Button } from "@/shared/ui/kit";
import { useMemo, useState, type FC } from "react";
import type { ProductDefaultValues, ProductModalProps } from "../model";
import ProductForm from "@/features/product-form";
import { usePriceTypeApi } from "@/entities/products/repository";
import {
  CurrencyCodeUZS,
  CurrencyCodeUZSText,
  CurrencyRateUZS,
} from "@/app/constants/paymentType";

const AddProductModal: FC<ProductModalProps> = ({ type, setType, setBarcode, barcode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: productPriceType } = usePriceTypeApi();

  const openModal = () => {
    setType("add");
    setIsOpen(true);
  };

  const defaultValues: ProductDefaultValues = useMemo(() => {
    const prices = productPriceType?.map((i: any, inx: number) => {
      return {
        amount: inx ? 0 : null,
        price_type: i,
        currency: {
          code: CurrencyCodeUZS,
          name: CurrencyCodeUZSText,
          rate: CurrencyRateUZS,
        },
      };
    });

    return {
      name: "",
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
          barcodes: [new Date().getTime().toString().slice(5, 13)],
          images: [],
          catalog_code: null,
          catalog_name: null,
          package_code: null,
          package_name: null,
          sku: null,
          code: null,
          measurement_name: "Штук",
          vat_rate: null,
          prices: prices,
          count: 1,
          catalog: [],
          package: null,
        },
      ],
    };
  }, [productPriceType, isOpen]);

  return (
    <div>
      <Button onClick={openModal} variant="solid">
        Добавить
      </Button>

      <ProductForm
        type={type}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        defaultValue={defaultValues}
        barcode={barcode}
        setBarcode={setBarcode}
      />
    </div>
  );
};

export default AddProductModal;
