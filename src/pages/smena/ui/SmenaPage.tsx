import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useShiftOperationApi } from "@/entities/init/repository";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import Loading from "@/shared/ui/loading";
import dayjs from "dayjs";
import { CgMathPercent } from "react-icons/cg";
import { MdDiscount, MdSchedule } from "react-icons/md";
import { useTranslation } from "react-i18next";

const SmenaPage = () => {
    const { activeShift } = useSettingsStore();
    const { data: shiftOps, isPending } = useShiftOperationApi(
        activeShift?.id ?? null,
        true,
    );
    const { t } = useTranslation();

    const statCards = [
        {
            label: t("shift.receipts"),
            icon: <MdDiscount size={22} />,
            value: shiftOps?.sale_count ?? 0,
            isCount: true,
        },
        {
            label: t("shift.sale"),
            icon: <CgMathPercent size={22} />,
            value: shiftOps?.sale_price?.[0]?.amount ?? 0,
            isCount: false,
        },
        {
            label: t("payment.debt"),
            icon: <CgMathPercent size={22} />,
            value: shiftOps?.sale_debts?.[0]?.amount ?? 0,
            isCount: false,
        },
        {
            label: t("shift.averageCheck"),
            icon: <CgMathPercent size={22} />,
            value: shiftOps?.average_check?.amount ?? 0,
            isCount: false,
        },
        {
            label: t("shift.income"),
            icon: <MdSchedule size={22} />,
            value:
                shiftOps?.shift_contract?.cashboxes_in_balance?.total?.[0]
                    ?.amount ?? 0,
            isCount: false,
        },
        {
            label: t("shift.expense"),
            icon: <MdSchedule size={22} />,
            value:
                shiftOps?.shift_contract?.cashboxes_out_balance?.total?.[0]
                    ?.amount ?? 0,
            isCount: false,
        },
    ];

    return (
        <div className="bg-white h-screen p-3 flex flex-col">
            <div className="mb-3">
                <NavigateButton content={t("nav.shift")} />
            </div>

            {!activeShift ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-lg">
                    {t("shift.openShift")}
                </div>
            ) : (
                <>
                    <div className="mb-3 flex gap-6 text-sm text-slate-600">
                        <span>
                            {t("shift.openedAt")}:{" "}
                            <span className="font-medium text-slate-800">
                                {dayjs(activeShift.opened_at).format(
                                    "DD.MM.YYYY HH:mm",
                                )}
                            </span>
                        </span>
                        <span>
                            {t("common.employee")}:{" "}
                            <span className="font-medium text-slate-800">
                                {activeShift.account?.name}
                            </span>
                        </span>
                    </div>

                    {isPending ? (
                        <div className="flex items-center justify-center py-10">
                            <Loading />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {statCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="border border-slate-200 rounded-2xl p-4 flex gap-x-4 items-center"
                                >
                                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                                        {card.icon}
                                    </div>
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-sm text-slate-600">
                                            {card.label}
                                        </p>
                                        <p className="font-medium text-xl text-slate-800">
                                            {card.isCount ? (
                                                card.value
                                            ) : (
                                                <FormattedNumber
                                                    value={Number(card.value)}
                                                />
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 overflow-auto border border-slate-200 rounded-2xl" />
                </>
            )}
        </div>
    );
};

export default SmenaPage;
