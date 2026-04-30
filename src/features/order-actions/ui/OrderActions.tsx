import { Button, Dialog } from "@/shared/ui/kit";
import type {
    DraftSalePaymentAmountSchema,
    DraftSaleSchema,
    RegisterSaleModel,
    SaleItemModel,
} from "@/@types/sale";
import type { DraftRefundSchema, RegisterRefundModel } from "@/@types/refund";
import { useEffect, useMemo, useState } from "react";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { PaymentModal, PrinterModal } from "@/widgets";
import { useCurrencyStore } from "@/app/store/useCurrencyStore";
import type { PaymentAmount } from "@/@types/common";
import {
    useCashboxApi,
    useCreatePrintApi,
    useCreateShiftApi,
} from "@/entities/init/repository";
import {
    useCreateFiscalizedApi,
    useFescalDeviceApi,
    usePaymentProviderApi,
    useRegisterSellApi,
    useUpdateSellApi,
} from "@/entities/sale/repository";
import {
    showErrorLocalMessage,
    showErrorMessage,
    showSuccessMessage,
} from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import { FiscalizedModal } from "@/features/modals";
import type { FizcalResponsetype } from "@/entities/sale/model";
import {
    FiscalizedProviderTypeEPos,
    FiscalizedProviderTypeHippoPos,
} from "@/app/constants/fiscalized.constants";
import PaymeWhithQR from "@/features/modals/ui/PaymeWhithQR";
import {
    useRegisterRefundApi,
    useUpdateRefundApi,
} from "@/entities/refund/repository";
import {
    useRegisterPurchaseApi,
    useUpdatePurchasedApi,
} from "@/entities/purchase/repository";
import type {
    DraftPurchaseSchema,
    RegisterPurchaseModel,
} from "@/@types/purchase";
import { PaymentTypes } from "@/app/constants/payment.types";
import SellDebetModal from "@/widgets/ui/sellDebet/SellDebetModal";
import ContragentModal from "@/features/modals/ui/ContragentModal";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import { usePermission } from "@/shared/lib/controlActionWithPermission";

type OrderActionType = {
    type: "sale" | "refund" | "purchase";
    keyType: "numeric" | "qwerty" | "fullkey";
    draft: DraftSaleSchema[] & DraftRefundSchema[];
    activeDraft: DraftSaleSchema & DraftRefundSchema;
    activeSelectPaymetype: number;
    payModal: boolean;
    addNewDraft: any;
    selectedRows?: any;
    updateDraftSaleDiscount?: any;
    setPayModal: (open: boolean) => void;
    setActivePaymentSelectType: (val: number) => void;
    complateActiveDraft: () => void;
};

const OrderActions = ({
    type,
    keyType,
    activeDraft,
    activeSelectPaymetype,
    payModal,
    selectedRows,
    setPayModal,
    addNewDraft,
    updateDraftSaleDiscount,
    setActivePaymentSelectType,
    complateActiveDraft,
}: OrderActionType) => {
    const [ipOpenPayment, setIsOpenPayment] = useState(false);
    const [saleId, setSaleId] = useState<number | null>(null);
    const [fiscalizedModal, setFiscalizedModal] = useState(false);
    const [printSelect, setPrintSelect] = useState<boolean>(false);
    const { settings } = useSettingsStore();
    const [selectFiscalized, setSelectFiscalized] =
        useState<FizcalResponsetype | null>(null);
    const [sellDebit, setSellDebit] = useState(false);
    const [contractorId, setContractorId] = useState<number | null>(null);
    const [shiftAlert, setShiftAlert] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(
        null,
    );
    const [paymeType, setPaymeType] = useState<number[]>([]);
    const [openContragentModal, setOpenContragentModal] = useState(false);
    const [sellModal, setSellModal] = useState(false);

    const nationalCurrency = useCurrencyStore(
        (store) => store.nationalCurrency,
    );
    const warehouseId = useSettingsStore((s) => s.wareHouseId);
    const { activeShift, setActiveShift } = useSettingsStore();

    const { data: cashboxData } = useCashboxApi();
    const { data: paymentData = [] } = usePaymentProviderApi();
    const { mutate: registerSaleMutate } = useRegisterSellApi();
    const { mutate: registerRefundMutate } = useRegisterRefundApi();
    const { mutate: registerPurchaseMutate } = useRegisterPurchaseApi();
    const { mutate: createFiscalized, isPending: fiscalPending } =
        useCreateFiscalizedApi();
    const { data: fiscalData = [] } = useFescalDeviceApi(fiscalizedModal);
    const filterDataFiscal = fiscalData?.filter(
        (elem: any) => elem?.is_enabled,
    );
    const { mutate: printCheck } = useCreatePrintApi();

    const { mutate: updatePurchase } = useUpdatePurchasedApi();
    const { mutate: updateRefund } = useUpdateRefundApi();
    const { mutate: updateSale } = useUpdateSellApi();
    const { mutate: createShiftMutate } = useCreateShiftApi();

    const { checkPermissionByAction } = usePermission();

    const canCreate = checkPermissionByAction(type, "create");

    const addDrafts = () => {
        const newDraftSale:
            | DraftSaleSchema
            | DraftRefundSchema
            | DraftPurchaseSchema = {
            items: [],
            isActive: true,
            discountAmount: "0",
            [type === "sale" ? "payment" : "payout"]: {
                amounts: PaymentTypes?.map((paymentType) => ({
                    amount: 0,
                    paymentType: paymentType?.type,
                })),
            },
        };

        addNewDraft(newDraftSale);
    };

    const checkShiftAndRun = (callback: () => void) => {
        if (activeShift) {
            callback();
            return;
        }

        setPendingAction(() => callback);
        setShiftAlert(true);
    };

    const handleConfirmShift = () => {
        setShiftAlert(false);

        createShiftMutate(cashboxData?.[0]?.id ?? null, {
            onSuccess: (res) => {
                setActiveShift(res);

                showSuccessMessage(
                    messages.uz.SUCCESS_CREATE_SHIFT,
                    messages.ru.SUCCESS_CREATE_SHIFT,
                );

                if (pendingAction) {
                    pendingAction(); // oldingi action davom etadi
                    setPendingAction(null);
                }
            },
            onError: (error) => {
                showErrorMessage(error);
            },
        });
    };

    const netPrice = useMemo<number>(() => {
        if (!activeDraft) return 0; // <— himoya

        const totalAmount =
            activeDraft.items?.reduce(
                (acc, item) => acc + item.totalAmount,
                0,
            ) || 0;

        const discount = activeDraft.discountAmount || 0;

        return totalAmount - +discount;
    }, [activeDraft]);

    const totalPaymentAmount = useMemo<number>(() => {
        return (
            (type === "sale"
                ? activeDraft?.payment
                : activeDraft?.payout
            )?.amounts.reduce(
                (acc: number, payment: DraftSalePaymentAmountSchema) =>
                    acc + +payment?.amount,
                0,
            ) ?? 0
        );
    }, [
        (type === "sale" ? activeDraft?.payment : activeDraft?.payout)?.amounts,
    ]);

    const totalAmount =
        activeDraft?.items?.reduce((acc, item) => acc + item?.totalAmount, 0) ??
        0;

    const handleCancelPrint = () => {
        setPrintSelect(false);
        if (settings?.fiscalization_enabled && type === "sale") {
            setFiscalizedModal(true);
        } else setSaleId(null);
    };

    const handleCancelFiscalization = () => {
        setSaleId(null);
        setFiscalizedModal(false);
        setPayModal(false);
        setSelectFiscalized(null);
    };

    const handleCancelPayment = () => {
        setSelectFiscalized(null);
        setPayModal(false);
        setActivePaymentSelectType(1);
    };

    const handleApproveFiscalization = () => {
        if (selectFiscalized) {
            let payload = {
                sale_id: saleId,
                fiscal_device_id: selectFiscalized?.id,
                payment_card_type: selectFiscalized.type,
            };
            const activePaymentData = paymentData?.filter(
                (elem) => elem?.is_enabled,
            );
            if (
                [
                    FiscalizedProviderTypeEPos,
                    FiscalizedProviderTypeHippoPos,
                ].includes(selectFiscalized?.type) &&
                (paymeType.includes(5) || paymeType.includes(6)) &&
                activePaymentData?.length > 0
            ) {
                setPayModal(true);
                setFiscalizedModal(false);
            } else {
                createFiscalized(payload, {
                    onSuccess() {
                        showSuccessMessage(
                            messages.uz.SUCCESS_MESSAGE,
                            messages.ru.SUCCESS_MESSAGE,
                        );
                        handleCancelFiscalization();
                        setPaymeType([]);
                    },
                    onError(error) {
                        showErrorMessage(error);
                    },
                });
            }
        } else {
            handleCancelFiscalization();
            setPaymeType([]);
        }
    };

    const cashBackAmount = useMemo<number>(() => {
        const backAmount = totalPaymentAmount - netPrice;
        return backAmount > 0 ? backAmount : 0;
    }, [netPrice, totalPaymentAmount]);

    function onSubmitPaymentHandler(
        paymentAmounts: PaymentAmount[],
        callback: (success: boolean) => void,
        typeButton: boolean,
    ) {
        // init payload
        const payload: RegisterSaleModel &
            RegisterRefundModel &
            RegisterPurchaseModel = {
            is_approved: true,
            exact_discount: [],
            contractor_id: activeDraft?.contractor_id ?? undefined,
            comment: activeDraft?.comment ?? "",
            items: [],
            cash_box_id: cashboxData?.length ? cashboxData[0]?.id : null,
        };

        const typesPayme =
            (type === "sale"
                ? activeDraft?.payment
                : activeDraft?.payout
            )?.amounts
                ?.filter((item) => Number(item?.amount) > 0)
                ?.map((elem) => elem?.paymentType) || [];

        setPaymeType(typesPayme);

        {
            // set exact discount

            if (activeDraft?.discountAmount) {
                payload?.exact_discount.push({
                    amount: Number(activeDraft?.discountAmount),
                    currency_code: nationalCurrency?.code, // todo set national currency id
                });
            }

            // append sale and refund item
            const draftItems = activeDraft?.items ?? [];
            for (let i = 0; i < draftItems?.length; i++) {
                const draftItem = draftItems[i];

                const isActiveBulk =
                    type === "sale" && !!selectedRows?.[draftItem?.productId];

                const priceAmount =
                    isActiveBulk && draftItem?.priceAmoutBulk
                        ? draftItem?.priceAmoutBulk
                        : draftItem?.priceAmount;

                const saleAndRefunItem: SaleItemModel = {
                    product_id: draftItem.productId,
                    warehouse_id: warehouseId ?? null, // todo set default warehouse id
                    quantity: draftItem.quantity,
                    price: {
                        amount: priceAmount,
                        currency_code: nationalCurrency?.code, // todo set national currency id
                    },
                    price_type_id: draftItem.priceTypeId, // todo save price type id in store and set
                    marks: draftItem.marks,
                };

                payload.items.push(saleAndRefunItem);
            }

            // set payment
            if (paymentAmounts) {
                const paymentKey = type === "sale" ? "payment" : "payout";

                // Boshlang'ich obyekt yaratamiz
                payload[paymentKey] = {
                    debt_states: [],
                    cash_box_states: [],
                };

                for (let i = 0; i < paymentAmounts.length; i++) {
                    const saleAndRefundPayment = paymentAmounts[i];

                    if (saleAndRefundPayment?.amount > 0) {
                        const paymentObject = payload[paymentKey];

                        // Debt
                        paymentObject.debt_states.push({
                            amount: Number(saleAndRefundPayment.amount),
                            currency_code: nationalCurrency?.code,
                        });

                        // Cash-box
                        paymentObject.cash_box_states.push({
                            amount: Number(saleAndRefundPayment.amount),
                            currency_code: nationalCurrency?.code,
                            type: saleAndRefundPayment.paymentType,
                        });
                    }
                }
            }
        }

        const registerMutate =
            type === "sale"
                ? registerSaleMutate
                : type === "refund"
                  ? registerRefundMutate
                  : registerPurchaseMutate;

        const updateRegister =
            type === "sale"
                ? updateSale
                : type === "refund"
                  ? updateRefund
                  : updatePurchase;

        // register sale
        if (activeDraft?.id) {
            updateRegister(
                { id: activeDraft?.id, payload },
                {
                    onSuccess: (data: any) => {
                        if (
                            data?.sale?.id ||
                            data?.purchase?.id ||
                            data?.refund?.id
                        ) {
                            setSaleId(
                                data?.sale?.id ||
                                    data?.purchase?.id ||
                                    data?.refund?.id,
                            );
                            if (typeButton) {
                                onPrintCheck(data);
                            }
                        }

                        callback(true);
                        complateActiveDraft();
                        addDrafts();
                        showSuccessMessage(
                            messages.uz.SUCCESS_MESSAGE,
                            messages.ru.SUCCESS_MESSAGE,
                        );
                    },
                    onError: (error) => {
                        showErrorMessage(error);
                        callback(true);
                    },
                },
            );
        } else {
            if (!canCreate) {
                showErrorLocalMessage(
                    "У вас нет прав для выполнения данного действия",
                );
                return;
            }
            registerMutate(payload, {
                onSuccess: (data: any) => {
                    if (
                        data?.sale?.id ||
                        data?.purchase?.id ||
                        data?.refund?.id
                    ) {
                        setSaleId(
                            data?.sale?.id ||
                                data?.purchase?.id ||
                                data?.refund?.id,
                        );
                        if (typeButton) {
                            onPrintCheck(data);
                        }
                    }

                    callback(true);
                    complateActiveDraft();
                    addDrafts();
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );
                },
                onError: (error) => {
                    showErrorMessage(error);
                    callback(true);
                },
            });
        }
    }

    const onPrintCheck = (data: any) => {
        if (settings?.auto_print_receipt && settings?.printer_name) {
            onPrint(data?.sale?.id || data?.purchase?.id || data?.refund?.id);
        } else if (!settings?.auto_print_receipt && settings?.printer_name) {
            setPrintSelect(true);
        } else {
            handleCancelPrint();
        }
    };

    const onPrint = (id?: number) => {
        const payload =
            type === "sale"
                ? {
                      sale_id: id ?? saleId,
                      printer_name: settings?.printer_name ?? "",
                  }
                : type === "purchase"
                  ? {
                        purchase_id: id ?? saleId,
                        printer_name: settings?.printer_name ?? "",
                    }
                  : {
                        refund_id: id ?? saleId,
                        printer_name: settings?.printer_name ?? "",
                    };

        printCheck(
            {
                path: `${type}-receipt-${settings?.receipt_size || 80}`,
                payload,
            },
            {
                onSuccess() {
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );
                    handleCancelPrint();
                },
                onError(error) {
                    showErrorMessage(error);
                    handleCancelPrint();
                },
            },
        );
    };

    const onSubmit = () => {
        const debit =
            totalAmount -
                Number(activeDraft?.discountAmount ?? 0) -
                totalPaymentAmount || 0;

        if (debit <= 0) {
            setIsOpenPayment(true);
        } else {
            if (type === "sale") {
                setSellModal(true);
            }
        }
    };

    const registerSubmit = () => {
        const debit =
            totalAmount -
                Number(activeDraft?.discountAmount ?? 0) -
                totalPaymentAmount || 0;

        if (updateDraftSaleDiscount) {
            updateDraftSaleDiscount(String(debit));
        }
        setSellModal(false);
        setIsOpenPayment(true);
    };

    const onSubmitDebit = (contragentData: {
        contractor_id: number;
        comment: string;
    }) => {
        const debit =
            totalAmount -
                Number(activeDraft?.discountAmount ?? 0) -
                totalPaymentAmount || 0;

        if (debit > 0) {
            if (activeDraft) {
                // 🟢 copy qilib yangilaymiz
                const updatedDraft = {
                    ...activeDraft,
                    contractor_id: contragentData.contractor_id,
                    comment: contragentData.comment,
                };

                // 🔹 draft update qilish uchun addNewDraft yoki setActiveDraft funksiyasini chaqirish kerak
                addNewDraft(updatedDraft); // yoki sizning state update funksiyangiz
            }

            setIsOpenPayment(true);
            setSellDebit(false);
        }
    };

    useEffect(() => {
        if (filterDataFiscal?.length === 1) {
            setSelectFiscalized(filterDataFiscal[0]);
        }
    }, [filterDataFiscal]);

    return keyType === "numeric" ? (
        <div className="rounded-2xl bg-slate-200 p-1">
            <div className="flex gap-x-1">
                {(type === "sale" || type === "purchase") && (
                    <Button
                        size="sm"
                        onClick={() =>
                            checkShiftAndRun(() => setSellDebit(true))
                        }
                        variant="plain"
                        disabled={!activeDraft?.items?.length}
                        className="w-full text-base font-medium text-slate-800 bg-white"
                    >
                        В долг
                    </Button>
                )}
                <Button
                    size="sm"
                    onClick={() => checkShiftAndRun(onSubmit)}
                    variant="solid"
                    disabled={!activeDraft?.items?.length}
                    className="w-full text-base font-medium"
                >
                    Оформить
                </Button>

                {sellDebit && (
                    <SellDebetModal
                        onCancel={() => {
                            setSellDebit(false);
                            setContractorId(null);
                        }}
                        onSubmit={onSubmitDebit}
                        isOpen={sellDebit}
                        setOpenContragentModal={setOpenContragentModal}
                        contractorId={contractorId}
                        setContractorId={setContractorId}
                    />
                )}

                {sellDebit && (
                    <ContragentModal
                        type="add"
                        isOpen={openContragentModal}
                        setIsOpen={setOpenContragentModal}
                        setContractorId={setContractorId}
                    />
                )}

                <PaymentModal
                    type={type}
                    totalAmount={totalAmount}
                    cashBackAmount={cashBackAmount}
                    totalPaymentAmount={totalPaymentAmount}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    onSubmitPaymentHandler={onSubmitPaymentHandler}
                    activeDraft={activeDraft}
                    isOpen={ipOpenPayment}
                    setIsOpenPayment={setIsOpenPayment}
                />

                <PrinterModal
                    type={type}
                    isOpen={!!saleId && printSelect}
                    size={settings?.receipt_size ?? "80"}
                    saleId={saleId}
                    defaultName={settings?.printer_name ?? null}
                    handleCancelPrint={handleCancelPrint}
                />

                <FiscalizedModal
                    isOpen={!!saleId && fiscalizedModal}
                    filterData={filterDataFiscal}
                    saleId={saleId}
                    selectFiscalized={selectFiscalized}
                    handleCancel={handleCancelFiscalization}
                    setSelectFiscalized={setSelectFiscalized}
                    setIsOpen={setFiscalizedModal}
                    fiscalPending={fiscalPending}
                    handleApproveFiscalization={handleApproveFiscalization}
                />

                <PaymeWhithQR
                    isOpen={payModal && paymentData?.length > 0}
                    saleId={saleId}
                    paymentData={paymentData}
                    selectFiscalized={selectFiscalized}
                    activeDraftPaymeTypes={paymeType}
                    setPaymeType={setPaymeType}
                    selectedPaymentType={activeSelectPaymetype}
                    handleCancelFiscalization={handleCancelFiscalization}
                    handleCancelPayment={handleCancelPayment}
                />

                {shiftAlert && (
                    <Alert
                        type="info"
                        title="Смена закрыта"
                        content="Для совершения продажи необходимо открыть смену. Открыть сейчас?"
                        onCancel={() => {
                            setShiftAlert(false);
                            setPendingAction(null);
                        }}
                        onConfirm={handleConfirmShift}
                    />
                )}

                <Dialog
                    isOpen={sellModal}
                    width={"320px"}
                    onClose={() => setSellModal(false)}
                    onRequestClose={() => setSellModal(false)}
                    title="Недостаточно оплаты"
                >
                    <p>
                        Сумма оплаты меньше суммы продажи. Как вы хотите
                        завершить продажу?
                    </p>

                    <div className="flex flex-col gap-2 mt-4">
                        <Button
                            onClick={() => {
                                checkShiftAndRun(() => setSellDebit(true));
                                setSellModal(false);
                            }}
                            size="sm"
                        >
                            Оформить в долг
                        </Button>

                        <Button onClick={registerSubmit} size="sm">
                            Списать остаток как скидку
                        </Button>
                    </div>
                </Dialog>
            </div>
        </div>
    ) : (
        ""
    );
};

export default OrderActions;
