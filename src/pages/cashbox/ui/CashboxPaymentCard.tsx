import { PaymentTypes } from "@/app/constants/payment.types";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const CashboxPaymentCard = ({ data }: any) => {
    const { t } = useTranslation();

    const totalSumCash = useMemo(() => {
        return (
            data?.reduce(
                (acc: number, item: any) =>
                    acc +
                    item?.amounts?.reduce(
                        (sum: number, elem: any) => sum + (elem?.amount || 0),
                        0,
                    ),
                0,
            ) || 0
        );
    }, [data]);

    const totalNetSum = useMemo(() => {
        return (
            data?.reduce(
                (acc: number, item: any) =>
                    acc +
                    item?.amounts?.find((el: any) => el?.money_type === 1)
                        ?.amount,
                0,
            ) || 0
        );
    }, [data]);

    return (
        <div>
            <div className="grid grid-cols-3 gap-x-1 items-start mb-3">
                <div className="border p-3 rounded-xl flex justify-between text-sm text-slate-800">
                    <span className="text-xs">{t("cashbox.balance")}:</span>
                    <FormattedNumber value={totalSumCash} scale={3} />
                </div>
                <div className="border p-3 rounded-xl flex justify-between text-sm text-slate-800">
                    <span>{t("payment.cash")}:</span>
                    <FormattedNumber value={totalNetSum} scale={3} />
                </div>
                <div className="border p-3 rounded-xl flex justify-between text-sm text-slate-800">
                    <span>{t("common.total")}:</span>
                    <FormattedNumber value={totalSumCash} scale={3} />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 items-start mb-3">
                {PaymentTypes?.map((typeItem) => {
                    const total = useMemo(() => {
                        return (
                            data?.reduce((acc: number, dataItem: any) => {
                                const found = dataItem?.amounts?.find(
                                    (el: any) => el?.money_type === typeItem?.type,
                                );

                                return acc + (found?.amount || 0);
                            }, 0) || 0
                        );
                    }, [data, typeItem]);

                    return (
                        <div className="border p-3 rounded-xl flex justify-between text-sm text-slate-800">
                            <span>{typeItem?.label}:</span>
                            <FormattedNumber value={total} scale={3} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CashboxPaymentCard;
