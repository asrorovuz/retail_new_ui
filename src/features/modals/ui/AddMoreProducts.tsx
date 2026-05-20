import { Dialog } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import type { ProductDefaultValues, ProductPriceType } from "../model";
import { ProductFormMultiple } from "@/features/product-form";
import {
    CurrencyCodeUZS,
    CurrencyCodeUZSText,
    CurrencyRateUZS,
} from "@/app/constants/paymentType";
import { useCatalogByBarcode } from "@/entities/products/repository";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";

const AddMoreProducts = ({
    productPriceType,
    barcode,
    setBarcode,
    isOpen,
    setIsOpen,
    catalogCode,
}: {
    productPriceType: ProductPriceType[] | undefined;
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    barcode: string | null;
    setBarcode: (val: string | null) => void;
    catalogCode: string | null;
}) => {
    const [products, setProducts] = useState<ProductDefaultValues[]>([]);

    const { data: catalogData = [] } = useCatalogByBarcode(
        isOpen ? (barcode || catalogCode) : null,
        isOpen,
    );

    /* 🔹 default product */
    const createEmptyProduct = (barcode?: string): ProductDefaultValues => {
        return {
            name: "",
            barcodes: barcode
                ? [
                      {
                          value: barcode,
                          count: 1,
                      },
                  ]
                : [],
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
            is_legal: false,
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
        };
    };

    /* 🔹 modal ochilganda 1 ta product */
    useEffect(() => {
        if (isOpen && !barcode) {
            setProducts([createEmptyProduct()]);
        }
    }, [isOpen]);

    const removeProduct = (index: number) => {
        setProducts((prev) =>
            prev.length === 1
                ? [createEmptyProduct()] // ❗ o‘chirish emas, tozalash
                : prev.filter((_, i) => i !== index),
        );
    };

    return (
        <>
            <Dialog
                width="100vw"
                height="100vh"
                contentClassName="!my-0 !rounded-none flex flex-col gap-y-4"
                closable={false}
                isOpen={isOpen}
            >
                <NavigateButton
                    click={() => {
                        setIsOpen(false);
                        setProducts([]);
                        setBarcode(null);
                    }}
                    content="Добавить большое количество товаров"
                />
                <div className="flex-1 h-[calc(100vh-280px)]">
                    <ProductFormMultiple
                        name="products"
                        products={products}
                        barcode={barcode}
                        setBarcode={setBarcode}
                        catalogData={catalogData}
                        onRemove={removeProduct}
                        // addProduct={addProduct}
                        setProducts={setProducts}
                        createEmptyProduct={createEmptyProduct}
                    />
                </div>
                <FullKeyboard />
            </Dialog>
        </>
    );
};

export default AddMoreProducts;
