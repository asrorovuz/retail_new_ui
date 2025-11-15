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
  useCatalogSearchApi,
  useProductByIdApi,
} from "@/entities/products/repository";
import type { ProductPackage } from "@/@types/products";

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
  const { data: catalogData } = useCatalogSearchApi(barcode || "", isOpen);

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

      packages: product?.product_packages?.length
        ? product?.product_packages?.map(
            (pkg: ProductPackage, inx: number) => ({
              id: pkg?.id,
              is_default: pkg?.is_default || inx === 0,
              isActive: inx === 0,
              category: pkg?.category,
              barcodes: pkg?.barcodes?.map((i) => i.value) || [],
              images: pkg?.images?.length
                ? [
                    {
                      id: pkg?.images[0]?.id,
                      img: pkg?.images[0]?.fs_url,
                      name: pkg?.images[0]?.name,
                    },
                  ]
                : [],
              catalog: pkg?.catalog_code
                ? {
                    class_code: pkg.catalog_code,
                    class_name: pkg.catalog_name || "",
                    package_names: [], // Bu CatalogSelector ichida to'ldiriladi
                  }
                : null,

              catalog_code: pkg?.catalog_code || null,
              catalog_name: pkg?.catalog_name || null,
              package: null,
              package_code: pkg?.package_code || null,
              package_name: pkg?.package_name || null,
              sku: pkg?.sku || null,
              code: pkg?.code || null,
              measurement_name: pkg?.measurement_name || "Штук",
              prices: pkg?.prices?.length
                ? prices.map((i) => {
                    const price = pkg?.prices?.find(
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
              count: pkg?.count || 1,
            })
          )
        : [
            {
              is_default: true,
              isActive: true,
              category: null,
              barcodes: [new Date().getTime().toString().slice(5, 13)],
              images: [],
              catalog: null,
              catalog_code: null,
              catalog_name: null,
              package_code: null,
              package_name: null,
              sku: null,
              code: null,
              measurement_name: "Штук",
              prices,
              count: 1,
            },
          ],
    };

    setDefaultValues(computed);
  }, [product, productPriceType, catalogData]);

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
