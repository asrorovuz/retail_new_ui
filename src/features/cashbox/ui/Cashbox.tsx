import { useMemo, type FC } from "react";
import type { CashboxPropsType } from "../model";
import Tabs from "@/shared/ui/kit-pro/tabs/Tabs";
import { Select } from "@/shared/ui/kit";
import { useContragentApi } from "@/entities/history/repository";
import { useContractorByIdApi } from "@/entities/purchase/repository";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";

const Cashbox: FC<CashboxPropsType> = (props) => {
    const { draftPurchases, setContractorId, completeActiveDraftPurchase } =
        useDraftPurchaseStore();

    const activeDraft = draftPurchases?.find((item) => item?.isActive);
    const { data } = useContragentApi();
    const { data: dataById } = useContractorByIdApi(
        props?.type === "purchase"
            ? (activeDraft?.contractor_id ?? null)
            : null,
    );

    const selectOption = useMemo(() => {
        return data?.map((item: any) => {
            return {
                value: item?.id,
                label: item?.name,
            };
        });
    }, [data]);

    const onUpdateProduct = () => {
        completeActiveDraftPurchase();
        if (dataById) {
            console.log("salom");
        }
    };

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
                    <Select
                        size="sm"
                        options={selectOption}
                        placeholder="Поставщик"
                        value={
                            selectOption?.find(
                                (opt: any) => opt.value === activeDraft?.contractor_id,
                            ) ?? null
                        }
                        isClearable
                        onChange={(val: any) => {
                            setContractorId(val ? val.value : null);
                            onUpdateProduct();
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                height: "32px",
                                width: "150px",
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
