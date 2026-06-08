import { paymentTypes } from "@/@types/cashbox";
import { messages } from "@/app/constants/message.request";
import { CurrencyCodeUZS } from "@/app/constants/payment.types";
import {
    PaymentTypeCashCode,
    paymentTypeList,
} from "@/app/constants/paymentType";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
    useContractorApi,
    usePaymentDebtsApi,
    usePayoutDebtsApi,
    usePayoutDebtsUpdateApi,
    // usePayoutDebtsApi,
} from "@/entities/sale/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Input, Select } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

type AmountRow = {
    type: number;
    amount: number;
};

const PaymentDebtsModal = ({
    amount,
    type = "add",
    pageType,
    dobtModal,
    contractorId,
    setContragentId,
    setDebitModal,
    debtsStatus,
    setDebtsStatus,
    payoutId,
    setPayoutId,
    cashBoxStates,
}: {
    amount?: any;
    type?: "add" | "edit";
    pageType?: string;
    dobtModal: boolean;
    contractorId?: number | null;
    setContragentId?: (val: number | null) => void;
    setDebitModal: (val: boolean) => void;
    setDebtsStatus: (val: number) => void;
    debtsStatus: number;
    setPayoutId?: any,
    payoutId?: any
    cashBoxStates?: { amount: number; type: number }[];
}) => {
    const [debitData, setDebitData] = useState({
        notes: "",
        contractor_id: null as number | null,
    });
    const [amounts, setAmounts] = useState<AmountRow[]>([
        { type: PaymentTypeCashCode, amount: amount ?? 0 },
    ]);
    const [debts, setDebts] = useState(0);

    const { data, isPending } = useContractorApi(dobtModal, "");
    const { mutate, isPending: mutPending } = usePaymentDebtsApi();
    const { mutate: payoutMutate, isPending: payPending } = usePayoutDebtsApi();
    const { mutate: payoutUpdateMutate, isPending: payUpdatePending } =
        usePayoutDebtsUpdateApi();

    const wareHouseId = useSettingsStore((s) => s.wareHouseId);
    const filterData = data?.filter((item: any) => item?.is_customer);

    const contractorOptions = useMemo(() => {
        return (
            (pageType === "sale" ? filterData : data)?.map((item: any) => ({
                label: item?.name,
                value: item?.id,
                item: item,
            })) ?? []
        );
    }, [data]);

    const addRow = () => {
        setAmounts((prev) => [
            ...prev,
            { type: PaymentTypeCashCode, amount: 0 },
        ]);
    };

    const removeRow = (index: number) => {
        setAmounts((prev) => prev.filter((_, i) => i !== index));
    };

    const updateRowType = (index: number, newType: number) => {
        setAmounts((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, type: newType } : item,
            ),
        );
    };

    const updateRowAmount = (index: number, newAmount: number) => {
        setAmounts((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, amount: newAmount } : item,
            ),
        );
    };

    const onCloseDebitModal = () => {
        setDebitModal(false);
        setDebitData({ notes: "", contractor_id: null });
        setAmounts([{ type: PaymentTypeCashCode, amount: 0 }]);
        setDebts(0);
        if (setContragentId) {
            setContragentId(null);
        }
        if (setPayoutId) {
            setPayoutId(null);
        }
        setDebtsStatus(1);
    };

    const sendPaymentData = () => {
        const cashBoxStates = amounts
            .filter((a) => a.amount > 0)
            .map((a) => ({
                amount: a.amount,
                currency_code: CurrencyCodeUZS,
                type: a.type,
            }));

        if (cashBoxStates.length === 0) return;

        const totalPaid = amounts.reduce((sum, a) => sum + a.amount, 0);

        const payload = {
            cash_box_id: wareHouseId,
            cash_box_states: cashBoxStates,
            contractor_id: debitData.contractor_id,
            date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            debt_states: [
                {
                    amount: totalPaid,
                    currency_code: CurrencyCodeUZS,
                },
            ],
            notes: debitData.notes,
        };

        if (debtsStatus === 1) {
            mutate(payload, {
                onSuccess() {
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );
                    onCloseDebitModal();
                },
                onError(err) {
                    showErrorMessage(err);
                },
            });
        }

        if (debtsStatus === 2) {
            if (type === "add") {
                payoutMutate(payload, {
                    onSuccess() {
                        showSuccessMessage(
                            messages.uz.SUCCESS_MESSAGE,
                            messages.ru.SUCCESS_MESSAGE,
                        );
                        onCloseDebitModal();
                    },
                    onError(err) {
                        showErrorMessage(err);
                    },
                });
            } else {
                payoutUpdateMutate(
                    { id: payoutId, payload },
                    {
                        onSuccess() {
                            showSuccessMessage(
                                messages.uz.SUCCESS_MESSAGE,
                                messages.ru.SUCCESS_MESSAGE,
                            );
                            onCloseDebitModal();
                        },
                        onError(err) {
                            showErrorMessage(err);
                        },
                    },
                );
            }
        }
    };

    useEffect(() => {
        if (dobtModal && cashBoxStates && cashBoxStates.length > 0) {
            setAmounts(
                cashBoxStates.map((s) => ({ type: s.type, amount: s.amount })),
            );
        }
    }, [dobtModal, cashBoxStates]);

    useEffect(() => {
        if (contractorId) {
            const selectedContractor = contractorOptions.find(
                (opt: any) => opt.value === contractorId,
            )?.item;

            const debts = selectedContractor?.debts
                ? selectedContractor.debts.reduce(
                      (acc: number, d: any) => acc + (d.amount ?? 0),
                      0,
                  )
                : 0;

            setDebitData((prev: any) => ({
                ...prev,
                contractor_id: contractorId,
            }));
            setDebts(debts);
        }
    }, [contractorId, dobtModal]);

    const totalPaid = amounts.reduce((sum, a) => sum + a.amount, 0);

    return (
        <Dialog
            onRequestClose={onCloseDebitModal}
            onClose={onCloseDebitModal}
            isOpen={dobtModal}
            width={"60vw"}
            title={
                debtsStatus === 2
                    ? "Оплата поставщику"
                    : "Погасить долг клиента"
            }
        >
            <div className="flex h-[50vh] flex-col gap-4 overflow-y-auto">
                {/* Qarz miqdori */}
                <div className="text-xl text-slate-800 font-semibold">
                    Долг: <FormattedNumber value={debts || 0} scale={2} />
                </div>

                <FormItem
                    labelClass="mb-1"
                    className="!mb-3"
                    label={debtsStatus === 2 ? "Поставщик" : "Клиент"}
                >
                    <Select
                        options={contractorOptions}
                        size="sm"
                        isLoading={isPending}
                        className="w-full bg-white"
                        placeholder={debtsStatus === 2 ? "Поставщик" : "Клиент"}
                        isSearchable={false}
                        isDisabled={!!contractorId}
                        getOptionLabel={(option) => option?.label || ""}
                        getOptionValue={(option) => String(option?.value)}
                        value={contractorOptions.find(
                            (opt: any) => opt.value === debitData.contractor_id,
                        )}
                        onChange={(val) => {
                            const debts = val?.item?.debts
                                ? val.item.debts.reduce(
                                      (acc: number, d: any) =>
                                          acc + (d.amount ?? 0),
                                      0,
                                  )
                                : 0;

                            setDebitData((prev) => ({
                                ...prev,
                                contractor_id: val?.value ?? null,
                            }));
                            setDebts(debts);
                        }}
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                    />
                </FormItem>

                {/* To'lov turlari */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-semibold">Оплата</span>
                        <Button
                            type="button"
                            size="sm"
                            className="border-primary text-primary"
                            icon={<FaPlus />}
                            onClick={addRow}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        {amounts.map((row, index) => (
                            <div
                                key={index}
                                className="flex items-center"
                            >
                                <Select
                                    size="sm"
                                    className="w-[175px] flex-shrink-0"
                                    value={paymentTypeList.find(
                                        (p) => p.id === row.type,
                                    )}
                                    options={paymentTypeList.filter(
                                        (p) =>
                                            p.id === row.type ||
                                            !amounts.some(
                                                (a, i) =>
                                                    i !== index &&
                                                    a.type === p.id,
                                            ),
                                    )}
                                    isSearchable={false}
                                    getOptionLabel={(opt) =>
                                        paymentTypes[opt.id] || opt.text
                                    }
                                    getOptionValue={(opt) => String(opt.id)}
                                    onChange={(val) =>
                                        val && updateRowType(index, val.id)
                                    }
                                    styles={{
                                        control: () => ({
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                        }),
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                        }),
                                    }}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                />
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        size="sm"
                                        space={false}
                                        inputMode="none"
                                        value={row.amount || ""}
                                        style={{ borderRadius: 0 }}
                                        className="text-end w-full"
                                        placeholder="Сумма"
                                        onChange={(e) =>
                                            updateRowAmount(
                                                index,
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                                {amounts.length > 1 && (
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600 ml-1"
                                        icon={<FaTrashAlt />}
                                        onClick={() => removeRow(index)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 text-sm text-slate-700 font-medium text-right">
                        Итого: <FormattedNumber value={totalPaid} scale={2} />
                    </div>
                </div>

                {/* Izoh yozish maydoni */}
                <FormItem label="Примечание" className="!mb-1">
                    <textarea
                        value={debitData.notes}
                        placeholder="Скоро будет доступно"
                        disabled
                        inputMode="none"
                        className="w-full h-[80px] border border-slate-300 rounded-lg p-1 outline-blue-400 resize-none"
                        onChange={(e) =>
                            setDebitData((prev) => ({
                                ...prev,
                                notes: e.target.value,
                            }))
                        }
                    />
                </FormItem>
            </div>
            <div className="flex justify-end gap-2 mt-4 mb-2">
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={onCloseDebitModal}
                >
                    Отмена
                </Button>
                <Button
                    type="button"
                    variant="solid"
                    loading={mutPending || payPending || payUpdatePending}
                    disabled={amounts.every((a) => a.amount <= 0)}
                    size="sm"
                    onClick={sendPaymentData}
                >
                    Оплатить
                </Button>
            </div>
            <FullKeyboard />
        </Dialog>
    );
};

export default PaymentDebtsModal;
