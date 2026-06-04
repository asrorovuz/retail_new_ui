import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import type { PriceType } from "@/widgets/ui/favourite-card/FavouriteCard";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useReturnPurchaseDraftStore } from "@/app/store/useReturnPurchaseDraftStore";

export const handleScannedProduct = (
    product: any,
    type: "sale" | "refund" | "purchase" | "return_purchase",
    setExpandedId: any,
    selectedRows?: any,
    barcodeMark?: string,
) => {
    const { draftSales, updateDraftSaleItem } = useDraftSaleStore.getState();
    const { draftRefunds, updateDraftRefundItem } =
        useDraftRefundStore.getState();
    const { draftPurchases, updateDraftPurchaseItem } =
        useDraftPurchaseStore.getState();
    const { draftReturnPurchases, updateDraftReturnPurchaseItem } =
        useReturnPurchaseDraftStore();

    const activeDraftSale = draftSales.find((s) => s.isActive);
    const activeDraftRefund = draftRefunds.find((s) => s.isActive);
    const activeDraftPurchase = draftPurchases.find((s) => s.isActive);
    const activeDraftReturnPurchase = draftReturnPurchases.find(
        (s) => s.isActive,
    );

    const active =
        type === "sale"
            ? activeDraftSale
            : type === "refund"
              ? activeDraftRefund
              : type === "return_purchase"
                ? activeDraftReturnPurchase
                : activeDraftPurchase;
    const addDraftItem =
        type === "sale"
            ? updateDraftSaleItem
            : type === "refund"
              ? updateDraftRefundItem
              : type === "return_purchase"
                ? updateDraftReturnPurchaseItem
                : updateDraftPurchaseItem;
    if (!active) return;

    const operationItem = active.items.find((p) => p.productId === product?.id);
    const isSelectedBulk =
        selectedRows && type === "sale" ? !!selectedRows[product.id] : false;
    const packagePrice =
        type === "purchase" || type === "return_purchase"
            ? onBuildPrice(product?.warehouse_items?.[0])
            : product?.prices?.find(
                  (p: PriceType) => p?.product_price_type?.is_primary,
              ) || product?.prices?.[0];
    const packagePriceBulk =
        product?.prices?.find((p: PriceType) => p.product_price_type.is_bulk) ||
        product.prices[1];
    let quantity = operationItem?.quantity ?? 0;
    let marks: string[] = operationItem?.marks ?? [];

    const isMarkerovka =
        barcodeMark && !/^\d+$/.test(barcodeMark) && barcodeMark.length > 14;

    if (isMarkerovka) {
        const hasMark = marks.includes(barcodeMark);

        if (hasMark) {
            // Mavjud mark → o'chir, quantity kamaytir
            marks = marks.filter((m) => m !== barcodeMark);
            quantity = Math.max(0, quantity - 1); // ← manfiy ketmasin
        } else {
            // Yangi mark → qo'sh
            marks = [...marks, barcodeMark];
            // Quantity yetarli bo'lmasa oshir
            if (quantity < marks.length) {
                quantity += 1;
            }
        }
    } else {
        quantity += 1;
    }

    const newItem = {
        productId: product?.id,
        productName: product?.name,
        productPackageName: product?.measurement_name,
        priceTypeId:
            type === "purchase" || type === "return_purchase"
                ? 0
                : packagePrice?.product_price_type?.id,
        priceAmount: packagePrice?.amount,
        priceAmoutBulk: packagePriceBulk?.amount,
        quantity: quantity,
        isMark: type === "sale" ? product?.is_marked || false : false,
        totalAmount:
            quantity *
            (isSelectedBulk && type === "sale"
                ? packagePriceBulk?.amount
                : packagePrice?.amount),
        catalogCode: product?.catalog_code,
        catalogName: product?.catalog_name,
        // ...(barcodeMark && barcodeMark.length > 14
        //     ? { marks: [barcodeMark] }
        //     : {}),
        marks: marks,
    };

    requestAnimationFrame(() => {
        setExpandedId?.(product.id);
    });
    addDraftItem(newItem);
};

const onBuildPrice = (item: any) => {
    return {
        amount: item?.purchase_price_amount,
        currency: item?.purchase_price_currency,
    };
};
