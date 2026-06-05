import { messages } from "@/app/constants/message.request";
import { CurrencyCodeUZS } from "@/app/constants/payment.types";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
    useContractorApi,
    usePaymentDebtsApi,
    usePayoutDebtsApi,
    // usePayoutDebtsApi,
} from "@/entities/sale/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Input, Select } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

const PaymentDebtsModal = ({
    pageType,
    dobtModal,
    contractorId,
    setContragentId,
    setDebitModal,
    debtsStatus,
    setDebtsStatus,
}: {
    pageType?: string;
    dobtModal: boolean;
    contractorId?: number | null;
    setContragentId?: (val: number | null) => void;
    setDebitModal: (val: boolean) => void;
    setDebtsStatus: (val: number) => void;
    debtsStatus: number;
}) => {
    const [debitData, setDebitData] = useState({
        notes: "",
        amount: 0,
        contractor_id: null,
    });
    const [debts, setDebts] = useState(0);

    const { data, isPending } = useContractorApi(dobtModal, "");
    const { mutate, isPending: mutPending } = usePaymentDebtsApi();
    const { mutate: payoutMutate, isPending: payPending } = usePayoutDebtsApi();

    const wareHouseId = useSettingsStore((s) => s.wareHouseId);
    const contractor = data?.find((item: any) => item?.id === contractorId);
    const isSupplier = contractor?.is_supplier;
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

    const onCloseDebitModal = () => {
        setDebitModal(false);
        setDebitData({
            notes: "",
            amount: 0,
            contractor_id: null,
        });
        setDebts(0);
        if (setContragentId) {
            setContragentId(null);
        }
        setDebtsStatus(1);
    };

    const sendPaymentData = () => {
        const payload = {
            cash_box_id: wareHouseId,
            cash_box_states: [
                {
                    amount: debitData?.amount,
                    currency_code: CurrencyCodeUZS,
                    type: 1,
                },
            ],
            contractor_id: debitData?.contractor_id,
            date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            debt_states: [
                {
                    amount: debitData?.amount,
                    currency_code: CurrencyCodeUZS,
                },
            ],
            notes: debitData?.notes,
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
        }
    };

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
    }, [contractorId]);

    return (
        <Dialog
            onRequestClose={onCloseDebitModal}
            onClose={onCloseDebitModal}
            isOpen={dobtModal}
            width={"60vw"}
            title={isSupplier ? "Оплата поставщику" : "Погасить долг клиента"}
        >
            <div className="flex h-[40vh] flex-col gap-4 overflow-y-auto">
                {/* Qarz miqdori */}
                <div className="text-xl text-slate-800 font-semibold">
                    Долг: <FormattedNumber value={debts || 0} scale={2} />
                </div>

                <FormItem
                    labelClass="mb-1"
                    className="!mb-3"
                    label={isSupplier ? "Поставщик" : "Клиент"}
                >
                    <Select
                        options={contractorOptions}
                        size="sm"
                        isLoading={isPending}
                        className="w-full bg-white"
                        placeholder={isSupplier ? "Поставщик" : "Клиент"}
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

                <FormItem label="Долг" className="!mb-1">
                    <Input
                        type="number"
                        value={debitData.amount}
                        size="sm"
                        space={false}
                        inputMode="none"
                        onChange={(e) =>
                            setDebitData((prev) => ({
                                ...prev,
                                amount: Number(e.target.value),
                            }))
                        }
                    />
                </FormItem>

                {/* Izoh yozish maydoni */}
                <FormItem label="Примечание" className="!mb-1">
                    <textarea
                        value={debitData.notes}
                        placeholder="Скоро будет доступно"
                        // placeholder="Введите комментарий"
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

                {/* Tugmalar */}
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
                    loading={mutPending || payPending}
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
