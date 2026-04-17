import type { DraftRefundSchema } from "@/@types/refund";
import type {
    DraftSalePaymentAmountSchema,
    DraftSaleSchema,
} from "@/@types/sale";
import { useKeyboard } from "@/app/providers/KeyboardProvider";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import MagnetSvg from "@/shared/ui/svg/MagnetSvg";
import NumericKeyboard from "@/widgets/ui/keyboard/NumericKeyboard";
import QuertyKeyboard from "@/widgets/ui/keyboard/QuertyKeyboard";
import { useEffect, useMemo } from "react";
import { LuDelete } from "react-icons/lu";

type PaymentSectionPropsType = {
    type: "sale" | "refund" | "purchase";
    activeDraft: DraftSaleSchema & DraftRefundSchema;
    activeSelectPaymetype: number;
    value: string;
    activeType: "numeric" | "qwerty" | "fullkey";
    setValue: (val: string) => void;
    setSearch: (val: string) => void;
    updateDraftDiscount?: (val: string) => void;
    updateDraftPayment: (val: DraftSalePaymentAmountSchema[]) => void;
    setActiveType: (val: "qwerty" | "numeric" | "fullkey") => void;
    setActivePaymentSelectType: (val: number) => void;
};

const PaymentSection = ({
    type,
    activeDraft,
    activeType,
    activeSelectPaymetype,
    updateDraftPayment,
    updateDraftDiscount,
    value,
    setValue,
    setSearch,
    setActiveType,
    setActivePaymentSelectType,
}: PaymentSectionPropsType) => {
    const { backspace, clear } = useKeyboard();

    const netPrice = useMemo<number>(() => {
        if (!activeDraft) return 0; // <— himoya

        const totalAmount =
            activeDraft.items?.reduce(
                (acc, item) => acc + item.totalAmount,
                0,
            ) || 0;

        const discount = activeDraft.discountAmount || 0;

        return totalAmount - Number(discount);
    }, [activeDraft]);

    const totalPaymentAmount = useMemo<number>(() => {
        return (
            (type === "sale"
                ? activeDraft?.payment
                : activeDraft?.payout
            )?.amounts.reduce(
                (acc: number, payment: DraftSalePaymentAmountSchema) =>
                    acc + Number(payment.amount || 0),
                0,
            ) ?? 0
        );
    }, [
        (type === "sale" ? activeDraft?.payment : activeDraft?.payout)?.amounts,
    ]);

    const cashBackAmount = useMemo<number>(() => {
        const backAmount = totalPaymentAmount - netPrice;
        return backAmount > 0 ? backAmount : 0;
    }, [netPrice, totalPaymentAmount]);

    const onPaymentChanged = (paymentType: number, amount: string) => {
        if (paymentType === 0 && updateDraftDiscount) {
            updateDraftDiscount(amount);
            return;
        }

        const payments =
            type === "sale"
                ? (activeDraft?.payment?.amounts ?? [])
                : (activeDraft?.payout?.amounts ?? []);

        const existingIndex = payments.findIndex(
            (p) => p.paymentType === paymentType,
        );

        let updatedAmounts: DraftSalePaymentAmountSchema[];

        if (existingIndex >= 0) {
            updatedAmounts = payments.map((p, i) =>
                i === existingIndex ? { ...p, amount } : p,
            );
        } else {
            updatedAmounts = [...payments, { paymentType, amount }];
        }

        updateDraftPayment(updatedAmounts);
    };

    const onClickNumber = (num: string) => {
        const current = getCurrentAmount();
        const newValue = current === "0" ? num : current + num;

        setValue(newValue);
        onPaymentChanged(activeSelectPaymetype, newValue);
    };

    const getCurrentAmount = () => {
        if (activeSelectPaymetype === 0) {
            return activeDraft?.discountAmount ?? "";
        }

        const payments =
            type === "sale"
                ? (activeDraft?.payment?.amounts ?? [])
                : (activeDraft?.payout?.amounts ?? []);

        return (
            payments.find((p) => p.paymentType === activeSelectPaymetype)
                ?.amount ?? ""
        );
    };

    const toPayAmount = useMemo<number>(() => {
        return netPrice - totalPaymentAmount;
    }, [netPrice, totalPaymentAmount]);

    const onMagent = () => {
        if (toPayAmount <= 0) return;

        const newAmount = String(toPayAmount);

        setValue(newAmount);
        onPaymentChanged(activeSelectPaymetype, newAmount);
    };

    const onBackSpace = () => {
        if (!value) return;

        const newValue = value.length <= 1 ? "0" : value.slice(0, -1);

        setValue(newValue);

        if (activeSelectPaymetype === 0 && updateDraftDiscount) {
            updateDraftDiscount(newValue);
        } else {
            onPaymentChanged(activeSelectPaymetype, newValue);
        }
    };

    const onClear = () => {
        setValue("0");

        if (activeSelectPaymetype === 0 && updateDraftDiscount) {
            updateDraftDiscount("0");
        } else {
            onPaymentChanged(activeSelectPaymetype, "0");
        }
    };

    const amounts =
        type === "sale"
            ? activeDraft?.payment?.amounts
            : activeDraft?.payout?.amounts;

    useEffect(() => {
        if (activeSelectPaymetype === 0) {
            setValue(activeDraft?.discountAmount?.toString() || "0");
        } else {
            const current = (
                type === "sale" ? activeDraft?.payment : activeDraft?.payout
            )?.amounts.find((p) => p?.paymentType === activeSelectPaymetype);
            setValue(current ? current?.amount?.toString() : "0");
        }
    }, [amounts, activeSelectPaymetype]);

    return (
        <>
            {activeType === "numeric" && (
                <div className="rounded-2xl bg-slate-200 p-1 h-full">
                    <div className="flex flex-col gap-y-2 mb-1">
                        <div className="py-3 px-4 flex justify-between">
                            <div className="w-full">
                                <div className="flex justify-between text-slate-900">
                                    <span className="text-sm">ОПЛАТA</span>
                                    <span className="text-2xl">
                                        {value ? value : "0"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-2">
                                    <div className="text-sm bg-white px-1 rounded-[4px] text-slate-600 flex justify-between pt-1">
                                        <span>Сумма</span>
                                        <span>
                                            {totalPaymentAmount.toLocaleString(
                                                "ru-RU",
                                            )}
                                        </span>
                                    </div>

                                    <div className="text-sm bg-white px-1 rounded-[4px] text-slate-600 flex justify-between pt-1">
                                        <span>Сдача</span>
                                        <span>
                                            {cashBackAmount.toLocaleString(
                                                "ru-RU",
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="plain"
                                className="bg-transparent text-blue-500 w-max h-8 ml-1"
                                onClick={onMagent}
                                icon={<MagnetSvg size={28} />}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            <Button
                                size="sm"
                                type="button"
                                variant="plain"
                                onClick={() => setActiveType("qwerty")}
                                className="w-full bg-slate-300 text-slate-700"
                            >
                                ABC
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                variant="plain"
                                disabled={!["sale"].includes(type)}
                                onClick={() =>
                                    setActivePaymentSelectType(
                                        activeSelectPaymetype === 0 ? 1 : 0,
                                    )
                                }
                                className={classNames(
                                    "w-full",
                                    activeSelectPaymetype
                                        ? "bg-slate-300 text-slate-700"
                                        : "bg-blue-400 !text-white",
                                )}
                            >
                                Скидка
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                variant="plain"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    clear(onClear);
                                }}
                                className="w-full bg-slate-300 text-slate-700"
                            >
                                Oчистить
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                variant="plain"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    backspace(onBackSpace);
                                }}
                                className="w-full bg-slate-300 text-slate-700"
                                icon={<LuDelete />}
                            ></Button>
                        </div>
                    </div>
                    <NumericKeyboard onClickNumber={onClickNumber} />
                </div>
            )}
            {activeType === "qwerty" && (
                <QuertyKeyboard
                    setActiveType={setActiveType}
                    setSearch={setSearch}
                />
            )}
        </>
    );
};

export default PaymentSection;
