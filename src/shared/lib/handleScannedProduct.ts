import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import type { PriceType } from "@/widgets/ui/favourite-card/FavouriteCard";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";

export const handleScannedProduct = (
  product: any,
  type: "sale" | "refund" | "purchase"
) => {
  const { updateDraftSaleItem, draftSales } = useDraftSaleStore.getState();
  const { updateDraftRefundItem, draftRefunds } =
    useDraftRefundStore.getState();
  const { updateDraftPurchaseItem, draftPurchases } =
    useDraftPurchaseStore.getState();

  const activeDraftSale = draftSales.find((s) => s.isActive);
  const activeDraftRefund = draftRefunds.find((s) => s.isActive);
  const activeDraftPurchase = draftPurchases.find((s) => s.isActive);

  const active =
    type === "sale"
      ? activeDraftSale
      : type === "refund"
      ? activeDraftRefund
      : activeDraftPurchase;
  const update =
    type === "sale"
      ? updateDraftSaleItem
      : type === "refund"
      ? updateDraftRefundItem
      : updateDraftPurchaseItem;

  if (!active) return;

  const operationItem = active.items.find((p) => p.productId === product?.id);

  const packagePrice =
    type === "purchase"
      ? onBuildPrice(product?.warehouse_items?.[0])
      : product?.prices?.find(
          (p: PriceType) => p?.product_price_type?.is_primary
        ) || product?.prices?.[0];

  const quantity = operationItem?.quantity ?? 0;

  const newItem = {
    productId: product?.id,
    productName: product?.name,
    productPackageName: product?.measurement_name,
    priceTypeId: type === "purchase" ? 0 : packagePrice?.product_price_type?.id,
    priceAmount: packagePrice?.amount,
    quantity: quantity + 1,
    totalAmount: (quantity + 1) * packagePrice?.amount,
    catalogCode: product?.catalog_code,
    catalogName: product?.catalog_name,
  };

  update(newItem);
};

const onBuildPrice = (item: any) => {
  return {
    amount: item?.purchase_price_amount,
    currency: item?.purchase_price_currency,
  };
};
