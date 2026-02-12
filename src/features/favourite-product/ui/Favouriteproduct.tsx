import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useAllFavoritProductApi } from "@/entities/products/repository";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import Loading from "@/shared/ui/loading";
import { FavouriteCard } from "@/widgets";
import type { PriceType } from "@/widgets/ui/favourite-card/FavouriteCard";

type LikedType = {
  type?: "sale" | "refund" | "purchase";
  setExpandedRow?: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedId?: React.Dispatch<React.SetStateAction<number | null>>;
  selectedRows?: any;
};

const FavouriteProduct = ({
  type = "sale",
  setExpandedRow,
  setExpandedId,
  selectedRows,
}: LikedType) => {
  const { data: favoriteProducts, isPending } = useAllFavoritProductApi();
  const { updateDraftSaleItem, draftSales } = useDraftSaleStore();
  const { updateDraftRefundItem, draftRefunds } = useDraftRefundStore();
  const { updateDraftPurchaseItem, draftPurchases } = useDraftPurchaseStore();

  const activeDraftSale = draftSales?.find((s) => s.isActive);
  const activeDraftRefund = draftRefunds?.find((s) => s.isActive);
  const activeDraftPurchase = draftPurchases?.find((s) => s.isActive);

  const getActiveDraft = () => {
    if (type === "sale")
      return { active: activeDraftSale, update: updateDraftSaleItem };
    if (type === "refund")
      return { active: activeDraftRefund, update: updateDraftRefundItem };
    if (type === "purchase")
      return { active: activeDraftPurchase, update: updateDraftPurchaseItem };
    return { active: null, update: () => {} };
  };

  const { active, update } = getActiveDraft();

  const onBuildPrice = (item: any) => {
    return {
      amount: item?.purchase_price_amount,
      currency: item?.purchase_price_currency,
    };
  };

  const onChange = (item: any) => {
    const operationItem = active?.items?.find(
      (p) => p.productId === item.product.id,
    );

    const isSelectedBulk =
      selectedRows && type === "sale" ? !!selectedRows[item.product.id] : false;

    const packagePrice =
      type === "purchase"
        ? onBuildPrice(item?.product?.warehouse_items?.[0])
        : item?.product?.prices?.find(
            (p: PriceType) => p.product_price_type.is_primary,
          ) || item.product.prices[0];
    const packagePriceBulk =
      item?.product?.prices?.find(
        (p: PriceType) => p.product_price_type.is_bulk,
      ) || item.product.prices[1];
    const quantity = operationItem?.quantity ?? 0;

    const newItem = {
      productId: item?.product?.id,
      productName: item?.product.name,
      productPackageName: showMeasurmentName(item?.product?.measurement_code),
      priceTypeId:
        type === "purchase" ? 0 : packagePrice?.product_price_type?.id,
      priceAmount: packagePrice?.amount,
      priceAmoutBulk: packagePriceBulk?.amount,
      quantity: quantity + 1,
      totalAmount:
        (quantity + 1) *
        (isSelectedBulk && type === "sale"
          ? packagePriceBulk?.amount
          : packagePrice?.amount),
      catalogCode: item?.product?.catalog_code,
      catalogName: item?.product?.catalog_name,
    };

    update(newItem);
    setExpandedRow?.(null);
    setExpandedId?.(newItem?.productId!);
  };

  return (
    <div className="h-[26.58vh] rounded-2xl overflow-auto">
      <div className="min-h-full bg-slate-200 p-2 grid grid-cols-3 gap-2">
        {isPending && (
          <div className="col-span-3 flex justify-center">
            <Loading />
          </div>
        )}

        {!isPending && !favoriteProducts?.length ? (
          <div className="col-span-3 flex justify-center">
            <Empty size={64} textSize="32px" text="Нет избранных товаров" />
          </div>
        ) : (
          ""
        )}

        {!isPending && favoriteProducts?.length
          ? favoriteProducts?.map((item) => {
              return (
                <FavouriteCard
                  name={item?.product?.name}
                  onItemChange={() => onChange(item)}
                  img={item?.product?.images ?? []}
                  prices={item?.product?.prices}
                />
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default FavouriteProduct;
