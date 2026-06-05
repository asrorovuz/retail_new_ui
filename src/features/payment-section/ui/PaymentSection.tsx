import type { DraftRefundSchema } from "@/@types/refund";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import type {
    DraftSalePaymentAmountSchema,
    DraftSaleSchema,
} from "@/@types/sale";
import { useKeyboard } from "@/app/providers/KeyboardProvider";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import MagnetSvg from "@/shared/ui/svg/MagnetSvg";
import NumericKeyboard from "@/widgets/ui/keyboard/NumericKeyboard";
import { useEffect, useMemo } from "react";
import { LuDelete } from "react-icons/lu";

type PaymentSectionPropsType = {
    type: "sale" | "refund" | "purchase" | "return_purchase";
    activeDraft: DraftSaleSchema & DraftRefundSchema;
    activeSelectPaymetype: number;
    value: string;
    activeType: "numeric" | "qwerty" | "fullkey";
    setValue: (val: string) => void;
    updateDraftDiscount?: (val: string) => void;
    updateDraftPayment: (val: DraftSalePaymentAmountSchema[]) => void;
    setActiveType: (val: "qwerty" | "numeric" | "fullkey") => void;
    setActivePaymentSelectType: (val: number) => void;
    isBlockSell?: boolean;
    setIsBlockSell?: (val: boolean) => void;
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
    // setActiveType,
    setActivePaymentSelectType,
    isBlockSell,
    setIsBlockSell,
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

    const debetAmount = useMemo<number>(() => {
        const debtAmount = netPrice - totalPaymentAmount;
        return debtAmount > 0 ? debtAmount : 0;
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

    const currentTypeAmount = useMemo<number>(() => {
        if (activeSelectPaymetype === 0) {
            return Number(activeDraft?.discountAmount) || 0;
        }

        const payments =
            type === "sale"
                ? (activeDraft?.payment?.amounts ?? [])
                : (activeDraft?.payout?.amounts ?? []);

        return (
            Number(
                payments.find((p) => p.paymentType === activeSelectPaymetype)
                    ?.amount,
            ) || 0
        );
    }, [activeSelectPaymetype, activeDraft, type]);
    // const onClickNumber = (num: string) => {
    //     const current = getCurrentAmount();

    //     const newValue = current === "0" ? num : current + num;

    //     setValue(newValue);
    //     onPaymentChanged(activeSelectPaymetype, newValue);
    // };
    const onClickNumber = (num: string) => {
        const current = getCurrentAmount();

        // Ikki marta "." bosilmasligi uchun
        if (num === "." && current.includes(".")) return;

        // Verguldan keyin 3 ta raqamdan ko'p kiritmaydi
        if (num !== "." && current.includes(".")) {
            const decPart = current.split(".")[1] || "";
            if (decPart.length >= 3) return;
        }

        // "0." → ruxsat, "05" → ruxsat emas
        let newValue: string;

        if (current === "0" || current === "") {
            newValue = num === "." ? "0." : num;
        } else {
            newValue = current + num;
        }

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

    // const toPayAmount = useMemo<number>(() => {
    //     return netPrice - totalPaymentAmount;
    // }, [netPrice, totalPaymentAmount]);

    const onMagnet = () => {
        // Joriy turni chiqarib, qolgan to'lovlar summasini hisoblaymiz
        const otherPaymentsTotal = totalPaymentAmount - currentTypeAmount;
        const newAmount = netPrice - otherPaymentsTotal;

        if (newAmount <= 0) return;

        const newAmountStr = String(newAmount);
        setValue(newAmountStr);
        onPaymentChanged(activeSelectPaymetype, newAmountStr);
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

    useEffect(() => {
        if (!activeDraft?.items?.length) {
            const payments =
                type === "sale"
                    ? (activeDraft?.payment?.amounts ?? [])
                    : (activeDraft?.payout?.amounts ?? []);

            // Turlarni saqlab, faqat amountlarni 0 qilamiz
            const clearedAmounts = payments.map((p) => ({ ...p, amount: "0" }));

            updateDraftPayment(clearedAmounts);

            if (updateDraftDiscount) updateDraftDiscount("0");
            setValue("0");
        }
    }, [activeDraft?.items?.length]);

    return (
        <>
            {activeType === "numeric" && (
                <div className="rounded-lg bg-slate-200 p-1 h-full flex flex-col justify-between">
                    <div className="flex flex-col justify-between flex-1 gap-y-2 mb-3">
                        <div className="py-3 px-4 flex justify-between">
                            <div className="w-full">
                                <div className="flex justify-between text-slate-900 border-b text-2xl">
                                    <span>ОПЛАТA</span>
                                    <span>
                                        {value && activeSelectPaymetype
                                            ? <FormattedNumber value={Number(value)} />
                                            : 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-700 border-b text-[17px]">
                                    <span>Сумма к оплате</span>
                                    <span>
                                        {totalPaymentAmount
                                            ? <FormattedNumber value={totalPaymentAmount} />
                                            : 0}
                                    </span>
                                </div>
                                {type !== "refund" && (
                                    <>
                                        <div className="flex justify-between text-slate-700 border-b text-[17px]">
                                            <span>Скидка</span>
                                            <span>
                                                {activeDraft?.discountAmount
                                                    ? <FormattedNumber value={Number(activeDraft?.discountAmount)} />
                                                    : 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-slate-700 border-b text-[17px]">
                                            <span>В долг</span>
                                            <span>
                                                {debetAmount ? <FormattedNumber value={debetAmount} /> : 0}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between text-slate-700 border-b text-[17px]">
                                    <span>Сдача</span>
                                    <span>
                                        {cashBackAmount
                                            ? <FormattedNumber value={cashBackAmount} />
                                            : 0}
                                    </span>
                                </div>
                                {/* <div className="grid grid-cols-2 gap-x-2">
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
                                </div> */}
                            </div>
                            <Button
                                variant="plain"
                                className="bg-transparent text-blue-500 w-max h-8 ml-1"
                                onClick={onMagnet}
                                icon={<MagnetSvg size={28} />}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            <Button
                                size="sm"
                                type="button"
                                variant="plain"
                                disabled={type === "return_purchase" || type === "purchase"}
                                onClick={() => setIsBlockSell?.(!isBlockSell)}
                                className={classNames(
                                    "w-full text-sm text-white",
                                    isBlockSell
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-500 hover:bg-red-600",
                                )}
                            >
                                Блок
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
                                    "w-full text-sm",
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
                                className="w-full !bg-slate-300 text-slate-700 text-sm px-0"
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
                                icon={<LuDelete size={"22"} />}
                            ></Button>
                        </div>
                    </div>
                    <NumericKeyboard
                        onClickNumber={onClickNumber}
                        isActive={!activeDraft?.items?.length || false}
                    />
                </div>
            )}
        </>
    );
};

export default PaymentSection;
