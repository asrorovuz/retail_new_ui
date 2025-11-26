import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useAllFavoritProductApi } from "@/entities/products/repository";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import Loading from "@/shared/ui/loading";
import { FavouriteCard } from "@/widgets";
import type { PriceType } from "@/widgets/ui/favourite-card/FavouriteCard";

type LikedType = {
  type?: "sale" | "refund";
  setExpandedRow?: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedId?: React.Dispatch<React.SetStateAction<number | null>>;
};

const FavouriteProduct = ({
  type = "sale",
  setExpandedRow,
  setExpandedId,
}: LikedType) => {
  const { data: favoriteProducts, isPending } = useAllFavoritProductApi();
  const { updateDraftSaleItem, draftSales } = useDraftSaleStore();
  const { updateDraftRefundItem, draftRefunds } = useDraftRefundStore();

  const activeDraftSale = draftSales?.find((s) => s.isActive);
  const activeDraftRefund = draftRefunds?.find((s) => s.isActive);

  const getActiveDraft = () => {
    if (type === "sale")
      return { active: activeDraftSale, update: updateDraftSaleItem };
    if (type === "refund")
      return { active: activeDraftRefund, update: updateDraftRefundItem };
    return { active: null, update: () => {} };
  };

  const { active, update } = getActiveDraft();

  const onChange = (item: any) => {
    const operationItem = active?.items?.find(
      (p) =>
        p.productId === item.product.id &&
        p.productPackageId === item.product_package.id
    );
    const packagePrice =
      item?.product_package.prices?.find(
        (p: PriceType) => p.product_price_type.is_primary
      ) || item.product_package.prices[0];
    const quantity = operationItem?.quantity ?? 0;

    const newItem = {
      productId: item?.product.id,
      productName: item?.product.name,
      productPackageId: item?.product_package.id,
      productPackageName: item?.product_package.measurement_name,
      priceTypeId: packagePrice?.product_price_type.id,
      priceAmount: packagePrice?.amount,
      quantity: quantity + 1,
      totalAmount: (quantity + 1) * packagePrice?.amount,
      catalogCode: item?.product_package?.catalog_code,
      catalogName: item?.product_package?.catalog_name,
    };

    update(newItem);
    setExpandedRow?.(null);
    setExpandedId?.(newItem?.productId!);
  };

  return (
    <div className="xl:h-[27vh] h-[170px] rounded-2xl overflow-hidden">
      <div className="xl:h-[27vh] h-[170px] overflow-y-auto">
        <div className="min-h-full bg-gray-50 p-2 grid grid-cols-3 gap-2">
          {isPending && <div className="col-span-3 flex justify-center"><Loading /></div>}

          {!isPending && !favoriteProducts?.length ? (
            <div className="col-span-3 flex justify-center"><Empty size={64} textSize="32px" text="Нет избранных товаров" /></div>
          ): ""}

          {!isPending &&
            favoriteProducts?.length ?
            favoriteProducts?.map((item) => {
              return (
                <FavouriteCard
                  name={item?.product?.name}
                  onItemChange={() => onChange(item)}
                  img={item?.product_package?.images ?? []}
                  prices={item?.product_package?.prices}
                />
              );
            }): ""}
        </div>
      </div>
    </div>
  );
};

export default FavouriteProduct;
