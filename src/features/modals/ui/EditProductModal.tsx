import ProductForm from "@/features/product-form";
import { useEffect, useState, type FC } from "react";
import type {
  ProductDefaultValues,
  ProductPriceType,
  ProductTableProps,
} from "../model";
import {
  CurrencyCodeUZS,
  CurrencyCodeUZSText,
  CurrencyRateUZS,
} from "@/app/constants/paymentType";
import { useProductByIdApi } from "@/entities/products/repository";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";

type EXtraPropsType = {
  productId: number | null;
  setProductId: (val: number | null) => void;
};

const EditProductModal: FC<ProductTableProps & EXtraPropsType> = ({
  setBarcode,
  barcode,
  productPriceType,
  setIsOpen,
  isOpen,
  productId,
  setProductId,
}) => {
  const safeProductPriceType = productPriceType ?? [];
  // 🔹 DEFAULT VALUES STATE ORNATAMIZ
  const [defaultValues, setDefaultValues] =
    useState<ProductDefaultValues | null>(null);

  const { data: product } = useProductByIdApi(productId ?? null);

  // 🔥 DEFAULT VALUES NI useEffect ICHIDA HISOBLAYMIZ
  useEffect(() => {
    if (!product) return;

    const prices = safeProductPriceType?.map((i: ProductPriceType, inx: number) => {
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

    const computed: ProductDefaultValues = {
      ...product,
      purchase_price:
        product?.warehouse_items?.[0]?.purchase_price_amount &&
        product?.warehouse_items?.[0]?.purchase_price_currency
          ? {
              amount: product?.warehouse_items?.[0]?.purchase_price_amount,
              currency: product?.warehouse_items?.[0]?.purchase_price_currency,
            }
          : {
              amount: null,
              currency: {
                code: CurrencyCodeUZS,
                name: CurrencyCodeUZSText,
                rate: CurrencyRateUZS,
              },
            },
      state: product?.warehouse_items?.[0]?.state || 0,
      barcodes: product?.barcodes?.map((i: any) => ({value: i?.value, count: i?.count})) || [],
      category: product?.category,
      images: product?.images?.length
        ? [
            {
              id: product?.images[0]?.id,
              img: product?.images[0]?.fs_url,
              name: product?.images[0]?.name,
            },
          ]
        : [],
      catalog: product?.catalog_code
        ? {
            value: product.catalog_code,
            label: product.catalog_name || "",
            package_names: [], // Bu CatalogSelector ichida to'ldiriladi
          }
        : null,
      package: {
        value: product?.package_code || null,
        label: product?.package_name || "",
      },
      package_code: product?.package_code || null,
      package_name: product?.package_name || null,
      catalog_code: product?.catalog_code || null,
      catalog_name: product?.catalog_name || null,
      sku: product?.sku || null,
      code: product?.code || null,
      measurement_name: showMeasurmentName(product?.measurement_code) || "шт",
      prices: product?.prices?.length
        ? prices.map((i) => {
            const price = product?.prices?.find(
              (j) => j?.product_price_type?.id === i?.price_type?.id
            );
            if (price)
              return {
                id: price?.id,
                amount: price?.amount,
                price_type: price?.product_price_type,
                currency: price?.currency,
              };
            return i;
          })
        : prices,
      count: product?.count || 1,
      package_measurements: product?.package_measurements || [] 
    };

    setDefaultValues(computed);
  }, [product, productPriceType, isOpen]);

  if (!defaultValues && !isOpen) return null; // loading holat

  return (
    <ProductForm
      type={"edit"}
      productId={productId}
      setDefaultValues={setDefaultValues}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      setProductId={setProductId}
      defaultValue={defaultValues!}
      barcode={barcode}
      setBarcode={setBarcode}
    />
  );
};

export default EditProductModal;
