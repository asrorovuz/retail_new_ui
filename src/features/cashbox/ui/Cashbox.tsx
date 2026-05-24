import { useEffect, useMemo, useRef, type FC } from "react";
import type { CashboxPropsType } from "../model";
import Tabs from "@/shared/ui/kit-pro/tabs/Tabs";
import { Select } from "@/shared/ui/kit";
import { useContragentApi } from "@/entities/history/repository";
import { useContractorByIdApi } from "@/entities/purchase/repository";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";

const Cashbox: FC<CashboxPropsType> = (props) => {
    const {
        draftPurchases,
        setContractorId,
        addProducts,
        updateDraftPurchaseItem,
        // completeActiveDraftPurchase  ← bu kerak emas
    } = useDraftPurchaseStore();

    const activeDraft = draftPurchases?.find((item) => item?.isActive);
    const { data } = useContragentApi();
    const { data: dataById } = useContractorByIdApi(
        props?.type === "purchase"
            ? (activeDraft?.contractor_id ?? null)
            : null,
    );

    const contractor = useMemo(() => {
        return data?.find((el: any) => el?.id === activeDraft?.contractor_id);
    }, [data, activeDraft?.contractor_id]);

    const selectOption = useMemo(() => {
        return data
            ?.filter((el: any) => el?.is_supplier)
            ?.map((item: any) => ({
                value: item?.id,
                label: item?.name,
            }));
    }, [data]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!dataById?.length) return;

        dataById?.forEach((item: any) => {
            addProducts(item);

            const existingItem = activeDraft?.items?.find(
                (p) => p.productId === item?.product?.id,
            );

            if (existingItem) return;

            const purchasePrice = {
                amount: item?.product?.warehouse_items?.[0]
                    ?.purchase_price_amount,
                currency:
                    item?.product?.warehouse_items?.[0]
                        ?.purchase_price_currency,
            };

            // Yangi skanerda miqdorni 1 ga oshiramiz
            // Yangi mahsulotda esa 0 dan boshlaymiz (prixodgacha)

            const newItem = {
                productId: item?.product?.id,
                productName: item?.product?.name,
                productPackageName: showMeasurmentName(
                    item?.product?.measurement_code,
                ),
                priceTypeId: 0,
                priceAmount: purchasePrice?.amount,
                priceAmoutBulk: item?.product?.prices?.[1]?.amount,
                quantity: 0,
                isMark: false,
                totalAmount: 0,
                catalogCode: item?.product?.catalog_code,
                catalogName: item?.product?.catalog_name,
            };

            updateDraftPurchaseItem(newItem);
        });
    }, [dataById]);

    return (
        <div className="p-1 rounded-lg flex items-center justify-between gap-x-2 bg-slate-200">
            <div className="w-full  flex items-center gap-x-2">
                <span className="uppercase font-semibold text-slate-900">
                    {props?.type === "sale"
                        ? "Продажа"
                        : props?.type === "refund"
                          ? "Возврат"
                          : "Приход"}
                </span>
                {props?.type === "purchase" && (
                    <p className="w-max flex gap-x-2 uppercase font-semibold text-orange-400">
                        <span>долг:</span>{" "}
                        {contractor?.debts?.[0]?.amount ?? "0"}
                    </p>
                )}
                {props?.type === "purchase" && (
                    <Select
                        size="sm"
                        options={selectOption}
                        placeholder="Поставщик"
                        value={
                            selectOption?.find(
                                (opt: any) =>
                                    opt.value === activeDraft?.contractor_id,
                            ) ?? null
                        }
                        isClearable
                        onChange={(val: any) => {
                            setContractorId(val ? val.value : null);
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                height: "32px",
                                width: "180px",
                                minHeight: "32px",
                                borderRadius: "8px",
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                        className="text-xs"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                    />
                )}
                <Tabs {...props} />
            </div>
        </div>
    );
};

export default Cashbox;
