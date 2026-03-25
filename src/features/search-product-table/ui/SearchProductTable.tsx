import type { Product } from "@/@types/products";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useRevisionStore } from "@/app/store/useRevision";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useWriteOfStore } from "@/app/store/useWriteofStroe";
import classNames from "@/shared/lib/classNames";
import { highlightText } from "@/shared/lib/hightLightText";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import type { PriceType } from "@/widgets/ui/favourite-card/FavouriteCard";

type PropsType = {
  data: Product[] | [];
  type?: "sale" | "refund" | "purchase" | "revision" | "writeof";
  debouncedSearch: string;
  selectedRows?: any;
  setActiveType: React.Dispatch<
    React.SetStateAction<"numeric" | "qwerty" | "fullkey">
  >;
  setExpandedRow?: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedId?: React.Dispatch<React.SetStateAction<number | null>>;
};

const SearchProductTable = ({
  type,
  data,
  debouncedSearch,
  selectedRows,
  setActiveType,
  setExpandedRow,
  setExpandedId,
}: PropsType) => {
  const { updateDraftSaleItem, draftSales } = useDraftSaleStore();
  const { updateDraftRefundItem, draftRefunds } = useDraftRefundStore();
  const { updateDraftPurchaseItem, draftPurchases, addProducts } = useDraftPurchaseStore();
  const { updateDraftRevisionItem, draftRevisions } = useRevisionStore();
  const { updateDraftWriteOfItem, draftWriteOfs } = useWriteOfStore()

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
    if (type === "revision")
      return { active: draftRevisions[0], update: updateDraftRevisionItem };
    if(type === "writeof")
      return {active: draftWriteOfs[0], update: updateDraftWriteOfItem}
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
    const operationItem = active?.items?.find((p) => p.productId === item?.id);

    const isSelectedBulk =
      selectedRows && type === "sale" ? !!selectedRows[item.id] : false;

    const packagePrice =
      type === "purchase"
        ? onBuildPrice(item?.warehouse_items?.[0])
        : item?.prices?.find(
            (p: PriceType) => p?.product_price_type?.is_primary,
          ) || item?.prices?.[0];
    const packagePriceBulk =
      item?.prices?.find((p: PriceType) => p.product_price_type.is_bulk) ||
      item.prices[1];
    const quantity = operationItem?.quantity ?? 0;

    let newItem: any; // 🔹 let bilan tashqarida e'lon qilamiz

    if(type === "purchase"){
      addProducts(item)
    }

    if (type === "revision" || type === "writeof") {
      newItem = {
        productId: item?.id,
        productName: item?.name,
        productPackageName: showMeasurmentName(item?.measurement_code),
        priceAmount: packagePrice?.amount,
        priceAmoutBulk: packagePriceBulk?.amount,
        quantity: quantity + 1,
      };
    } else {
      newItem = {
        productId: item?.id,
        productName: item?.name,
        productPackageName: showMeasurmentName(item?.measurement_code),
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
        catalogCode: item?.catalog_code,
        catalogName: item?.catalog_name,
      };
    }

    update(newItem);
    setExpandedRow?.(null);
    setExpandedId?.(newItem?.productId!);
    setActiveType("numeric");
  };

  return (
    <div className="h-[56vh] bg-white overflow-y-auto w-full rounded-md mt-1">
      {data?.map((item, index) => {
        const price = item?.prices?.find(
          (el) => el?.product_price_type?.is_primary,
        );

        return (
          <div
            key={item?.id}
            onClick={() => onChange(item)}
            className={classNames(
              "flex justify-between items-start gap-x-[30px] text-xs text-slate-700 p-2 active:bg-slate-100",
              !!index && "border-t border-slate-200",
            )}
          >
            {highlightText(item?.name, debouncedSearch)}
            <div>
              <FormattedNumber value={Number(price?.amount || 0)} /> сум
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchProductTable;
