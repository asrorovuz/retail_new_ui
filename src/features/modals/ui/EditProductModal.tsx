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
import {
  useProductByIdApi,
} from "@/entities/products/repository";

type EXtraPropsType = {
  productId: number | null;
  setProductId: (val: number | null) => void;
};

const EditProductModal: FC<ProductTableProps & EXtraPropsType> = ({
  type,
  setBarcode,
  barcode,
  setType,
  productPriceType,
  productId,
  setProductId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 DEFAULT VALUES STATE ORNATAMIZ
  const [defaultValues, setDefaultValues] =
    useState<ProductDefaultValues | null>(null);

  const { data: product } = useProductByIdApi(productId ?? null);

  // 🔥 DEFAULT VALUES NI useEffect ICHIDA HISOBLAYMIZ
  useEffect(() => {
    if (!product) return;

    const prices = productPriceType?.map((i: ProductPriceType, inx: number) => {
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
      barcodes: product?.barcodes?.map((i) => i.value) || [],
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
      package_code: product?.package_code || null,
      package_name: product?.package_name || null,
      catalog_code: product?.catalog_code || null,
      catalog_name: product?.catalog_name || null,
      sku: product?.sku || null,
      code: product?.code || null,
      measurement_name: product?.measurement_name || "Штук",
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
    };

    setDefaultValues(computed);
  }, [product, productPriceType, isOpen]);

  // 🔥 MODAL OCHILGANDA BARCODE SET QILAMIZ
  useEffect(() => {
    if (productId && type === "edit") {
      setIsOpen(true);
    }
  }, [productId]);

  if (!defaultValues) return null; // loading holat

  return (
    <ProductForm
      type={type}
      productId={productId}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      setType={setType}
      setProductId={setProductId}
      defaultValue={defaultValues}
      barcode={barcode}
      setBarcode={setBarcode}
    />
  );
};

export default EditProductModal;
