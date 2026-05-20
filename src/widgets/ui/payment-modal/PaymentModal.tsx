import type { PaymentAmount } from "@/@types/common";
import type { DraftRefundSchema } from "@/@types/refund";
import type { DraftSaleSchema } from "@/@types/sale";
import { GetPaymentLabel } from "@/app/constants/payment.types";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useOtherUpdatePurchasedPriceApi } from "@/entities/purchase/repository";
import { Button, Dialog } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import SuccessSvg from "@/shared/ui/svg/SuccessSvg";
import { useState } from "react";

type PaymentModalType = {
    type: "sale" | "refund" | "purchase";
    cashBackAmount: number;
    totalPaymentAmount: number;
    isOpen: boolean;
    totalAmount: number;
    onSubmitPaymentHandler: (
        paymentAmounts: PaymentAmount[],
        callback: (success: boolean) => void,
        typeButton: number,
    ) => void;
    activeDraft: DraftSaleSchema & DraftRefundSchema;
    setActivePaymentSelectType: (val: number) => void;
    setIsOpenPayment: (open: boolean) => void;
};

const PaymentModal = ({
    type,
    totalAmount,
    cashBackAmount,
    totalPaymentAmount,
    isOpen,
    activeDraft,
    setIsOpenPayment,
    onSubmitPaymentHandler,
    setActivePaymentSelectType,
}: PaymentModalType) => {
    const [loading, setIsLoading] = useState(false);
    const [loadingChek, setIsLoadingChek] = useState(false);
    const [loadingFiscal, setIsLoadingFiscal] = useState(false);
    const { settings } = useSettingsStore((s) => s);
    const products = useDraftPurchaseStore((s) => s.products);

    const { mutateAsync: mutateUpdatePrice } =
        useOtherUpdatePurchasedPriceApi();

    const updateProductPriceData = async () => {
        try {
            setIsLoading(true);

            const requests: Promise<any>[] = [];

            products?.forEach((item: any) => {
                item?.prices?.forEach((price: any) => {
                    const payload = {
                        amount: Number(price?.amount ?? 0),
                        currency_code: price?.currency?.code,
                        price_id: price?.id,
                        price_type_id: price?.product_price_type?.id,
                    };

                    requests.push(
                        mutateUpdatePrice({
                            payload,
                            id: item?.productId,
                        }),
                    );
                });
            });

            await Promise.all(requests);
        } catch (error) {
            console.error("Price update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitPayment = (typeButton: number): void => {
        if (typeButton === 2) {
            setIsLoadingChek(true);
        }

        if (typeButton === 1) {
            setIsLoading(true);
        }

        if (typeButton === 3) {
            setIsLoadingFiscal(true);
        }

        let subtracted = false;
        onSubmitPaymentHandler(
            (type === "sale"
                ? activeDraft?.payment
                : activeDraft?.payout
            )?.amounts?.map((item: any) => {
                const amountNumber = Number(item.amount);

                if (!subtracted && amountNumber > cashBackAmount) {
                    subtracted = true;
                    return { ...item, amount: amountNumber - cashBackAmount };
                }
                return { ...item, amountNumber };
            })!,
            (success) => {
                setIsLoadingChek(false);
                setIsLoading(false);
                setIsLoadingFiscal(false);
                setActivePaymentSelectType(1);
                if (type === "purchase") {
                    updateProductPriceData();
                }
                if (success) {
                    setIsOpenPayment(false);
                }
            },
            typeButton,
        );
    };

    return (
        <Dialog
            onRequestClose={() => setIsOpenPayment(false)}
            width={382}
            closable={false}
            isOpen={isOpen}
        >
            <div className="flex justify-center flex-col items-center mb-4">
                <SuccessSvg />
                <p className="text-green-500 mt-3 text-base font-medium">
                    Оплачено успешно
                </p>
            </div>
            <div className="bg-slate-200 rounded-2xl text-slate-800 mb-4 p-4">
                <div className="flex flex-col gap-y-3 mb-3 pb-3 border-b border-dashed border-slate-500">
                    <div className="flex justify-between border-b border-dashed">
                        <span>Скидка:</span>
                        <FormattedNumber
                            value={activeDraft?.discountAmount ?? 0}
                        />
                    </div>
                    <div className="flex justify-between border-b border-dashed">
                        <span>Оплаченная сумма:</span>
                        <FormattedNumber value={totalPaymentAmount ?? 0} />
                    </div>
                    {type !== "refund" && (
                        <div className="flex justify-between border-b border-dashed">
                            <span>Долг:</span>
                            <FormattedNumber
                                value={
                                    totalAmount -
                                        Number(
                                            activeDraft?.discountAmount ?? 0,
                                        ) -
                                        totalPaymentAmount || 0
                                }
                            />
                        </div>
                    )}
                    {(type === "sale"
                        ? activeDraft?.payment
                        : activeDraft?.payout
                    )?.amounts?.map((payment) => {
                        if (payment?.paymentType === 0) return null;
                        if (+payment?.amount <= 0) return null;

                        return (
                            <div className="flex justify-between border-b border-dashed">
                                {GetPaymentLabel(payment?.paymentType)}
                                <FormattedNumber
                                    value={Number(payment?.amount ?? 0)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="text-base font-semibold flex flex-col gap-y-3">
                    <div className="flex justify-between border-b border-dashed">
                        <span>Общая сумма:</span>
                        <FormattedNumber value={totalAmount ?? 0} />
                    </div>
                    {type !== "refund" && (
                        <>
                            <div className="flex justify-between border-b border-dashed">
                                <span>Итого со скидкой:</span>
                                <FormattedNumber
                                    value={
                                        totalAmount -
                                        Number(activeDraft?.discountAmount ?? 0)
                                    }
                                />
                            </div>
                            <div className="flex justify-between">
                                <span>Сдача:</span>
                                <FormattedNumber value={cashBackAmount ?? 0} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex gap-x-2 mb-2">
                <Button
                    loading={loadingChek}
                    onClick={() => onSubmitPayment(2)}
                    variant="default"
                    className="w-full"
                >
                    Чек
                </Button>
                {type !== "purchase" && (
                    <Button
                        loading={loadingFiscal}
                        onClick={() => onSubmitPayment(3)}
                        variant="default"
                        disabled={!settings?.fiscalization_enabled}
                        className="w-full"
                    >
                        Кэшбэк
                    </Button>
                )}
            </div>
            <Button
                loading={loading}
                onClick={() => onSubmitPayment(1)}
                variant="solid"
                className="w-full"
            >
                Завершить
            </Button>
        </Dialog>
    );
};

export default PaymentModal;
