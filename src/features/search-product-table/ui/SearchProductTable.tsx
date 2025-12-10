import type { Product } from "@/@types/products";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import classNames from "@/shared/lib/classNames";
import { highlightText } from "@/shared/lib/hightLightText";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import type { PriceType } from "@/widgets/ui/favourite-card/FavouriteCard";

type PropsType = {
  data: Product[] | [];
  type?: "sale" | "refund";
  debouncedSearch: string;
  setExpandedRow?: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedId?: React.Dispatch<React.SetStateAction<number | null>>;
};

const SearchProductTable = ({
  type,
  data,
  debouncedSearch,
  setExpandedRow,
  setExpandedId,
}: PropsType) => {
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
        p.productId === item?.id
    );
    console.log(data, "sale search");
    
    const packagePrice =
      item?.prices?.find(
        (p: PriceType) => p?.product_price_type?.is_primary
      ) || item?.prices?.[0];
    const quantity = operationItem?.quantity ?? 0;

    const newItem = {
      productId: item?.id,
      productName: item?.name,
      productPackageName: item?.measurement_name,
      priceTypeId: packagePrice?.product_price_type?.id,
      priceAmount: packagePrice?.amount,
      quantity: quantity + 1,
      totalAmount: (quantity + 1) * packagePrice?.amount,
      catalogCode: item?.catalog_code,
      catalogName: item?.catalog_name,
    };

    update(newItem);
    setExpandedRow?.(null);
    setExpandedId?.(newItem?.productId!);
  };
  
  return (
    <div className="h-[69vh] overflow-y-auto w-full">
      {data?.map((item, index) => {
        const price = item?.prices?.find(
          (el) => el?.product_price_type?.is_primary
        );

        return (
          <div
            onClick={() => onChange(item)}
            className={classNames(
              "flex justify-between items-start gap-x-[30px] text-base text-gray-400 p-2 active:bg-gray-100",
              !!index && "border-t border-gray-200"
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
