import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import type { PriceType } from "@/widgets/ui/favourite-card/FavouriteCard";

export const handleScannedProduct = (
  product: any,
  type: "sale" | "refund"
) => {
  const { updateDraftSaleItem, draftSales } = useDraftSaleStore.getState();
  const { updateDraftRefundItem, draftRefunds } =
    useDraftRefundStore.getState();

  const activeDraftSale = draftSales.find((s) => s.isActive);
  const activeDraftRefund = draftRefunds.find((s) => s.isActive);

  const active = type === "sale" ? activeDraftSale : activeDraftRefund;
  const update = type === "sale" ? updateDraftSaleItem : updateDraftRefundItem;

  if (!active) return;

  const operationItem = active.items.find(
    (p) =>
      p.productId === product?.id &&
      p.productPackageId === product?.product_package?.[0]?.id
  );

  const packagePrice =
    product?.product_packages?.[0]?.prices?.find(
      (p: PriceType) => p?.product_price_type?.is_primary
    ) || product?.product_package?.[0]?.prices?.[0];

  const quantity = operationItem?.quantity ?? 0;

  const newItem = {
    productId: product?.id,
    productName: product?.name,
    productPackageId: product?.product_package?.[0]?.id,
    productPackageName: product?.product_package?.[0]?.measurement_name,
    priceTypeId: packagePrice?.product_price_type.id,
    priceAmount: packagePrice?.amount,
    quantity: quantity + 1,
    totalAmount: (quantity + 1) * packagePrice?.amount,
    catalogCode: product?.product_package?.[0]?.catalog_code,
    catalogName: product?.product_package?.[0]?.catalog_name,
  };

  update(newItem);
};
