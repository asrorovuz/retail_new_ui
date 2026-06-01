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
import { useEffect, useRef, useState } from "react";

const buildPrice = (item: any) => ({
    amount: item?.purchase_price_amount,
    currency: item?.purchase_price_currency,
});

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
    const { updateDraftPurchaseItem, draftPurchases, addProducts } =
        useDraftPurchaseStore();
    const { updateDraftRevisionItem, draftRevisions } = useRevisionStore();
    const { updateDraftWriteOfItem, draftWriteOfs } = useWriteOfStore();

    const activeDraftSale = draftSales?.find((s) => s.isActive);
    const activeDraftRefund = draftRefunds?.find((s) => s.isActive);
    const activeDraftPurchase = draftPurchases?.find((s) => s.isActive);

    const getActiveDraft = () => {
        if (type === "sale")
            return { active: activeDraftSale, update: updateDraftSaleItem };
        if (type === "refund")
            return { active: activeDraftRefund, update: updateDraftRefundItem };
        if (type === "purchase")
            return {
                active: activeDraftPurchase,
                update: updateDraftPurchaseItem,
            };
        if (type === "revision")
            return {
                active: draftRevisions[0],
                update: updateDraftRevisionItem,
            };
        if (type === "writeof")
            return { active: draftWriteOfs[0], update: updateDraftWriteOfItem };
        return { active: null, update: () => {} };
    };

    const { active, update } = getActiveDraft();

    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const highlightedIndexRef = useRef(-1);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dataRef = useRef(data);
    dataRef.current = data;

    // Updated every render — window listener calls this to avoid stale closure
    const onChangeRef = useRef<(item: any) => void>(() => {});

    useEffect(() => {
        setHighlightedIndex(-1);
        highlightedIndexRef.current = -1;
    }, [data]);

    useEffect(() => {
        if (highlightedIndex >= 0) {
            rowRefs.current[highlightedIndex]?.scrollIntoView({
                block: "nearest",
            });
        }
    }, [highlightedIndex]);

    const onChange = (item: any) => {
        const operationItem = active?.items?.find(
            (p: any) => p.productId === item?.id,
        );

        const isSelectedBulk =
            selectedRows && type === "sale" ? !!selectedRows[item.id] : false;

        const packagePrice =
            type === "purchase"
                ? buildPrice(item?.warehouse_items?.[0])
                : item?.prices?.find(
                      (p: PriceType) => p?.product_price_type?.is_primary,
                  ) || item?.prices?.[0];

        const packagePriceBulk =
            item?.prices?.find(
                (p: PriceType) => p?.product_price_type?.is_bulk,
            ) || item?.prices?.[1];

        const quantity = operationItem?.quantity ?? 0;

        let newItem: any;

        if (type === "purchase") {
            addProducts(item);
        }

        const newQuantity =
            type === "purchase" && !operationItem ? 0 : quantity + 1;

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
                    type === "purchase"
                        ? 0
                        : packagePrice?.product_price_type?.id,
                priceAmount: packagePrice?.amount,
                priceAmoutBulk: packagePriceBulk?.amount,
                quantity: newQuantity,
                isMark: type === "sale" ? item?.is_marked || false : false,
                totalAmount:
                    newQuantity *
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

    // Sync ref every render so the window listener always has the latest onChange
    onChangeRef.current = onChange;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                const el = document.activeElement as HTMLElement;
                if (el?.tagName === "INPUT") el.blur();
                const next = Math.min(
                    highlightedIndexRef.current + 1,
                    dataRef.current.length - 1,
                );
                highlightedIndexRef.current = next;
                setHighlightedIndex(next);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const el = document.activeElement as HTMLElement;
                if (el?.tagName === "INPUT") el.blur();
                const next = Math.max(highlightedIndexRef.current - 1, 0);
                highlightedIndexRef.current = next;
                setHighlightedIndex(next);
            } else if (e.key === "Enter") {
                const idx = highlightedIndexRef.current;
                const item = dataRef.current[idx];
                if (idx >= 0 && item) {
                    e.preventDefault();
                    onChangeRef.current(item);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex-1 h-full overflow-y-auto bg-white w-full rounded-md">
            {data?.map((item, index) => {
                const price = item?.prices?.find(
                    (el) => el?.product_price_type?.is_primary,
                );
                const bulkPrice = item?.prices?.find(
                    (el) => el?.product_price_type?.is_bulk,
                );
                const purchasePrice =
                    item?.warehouse_items?.[0]?.purchase_price_amount;
                const state = item?.warehouse_items?.reduce(
                    (sum, acc) => sum + acc?.state,
                    0,
                );

                return (
                    <div
                        ref={(el) => {
                            rowRefs.current[index] = el;
                        }}
                        key={item?.id}
                        onClick={() => onChange(item)}
                        className={classNames(
                            "flex justify-between items-start gap-x-[30px] text-xs text-slate-700 p-2 active:bg-slate-100",
                            !!index && "border-t border-slate-300",
                            index === highlightedIndex &&
                                "bg-blue-100 font-medium",
                        )}
                    >
                        {highlightText(item?.name, debouncedSearch)}
                        <div className="flex">
                            <span className="text-nowrap border-r-2 border-slate-600 px-1">
                                <FormattedNumber
                                    value={Number(
                                        type === "purchase"
                                            ? purchasePrice
                                            : price?.amount || 0,
                                    )}
                                />
                            </span>
                            {(type === "sale" || type === "refund") && (
                                <span className="text-nowrap border-r-2 border-slate-600 px-1">
                                    <FormattedNumber
                                        value={Number(bulkPrice?.amount || 0)}
                                    />
                                </span>
                            )}
                            <span className="text-nowrap px-1">
                                <FormattedNumber value={Number(state || 0)} />
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SearchProductTable;
