import { Button } from "@/shared/ui/kit";
import { MdOutlineDiscount } from "react-icons/md";
import { CiSquareMinus } from "react-icons/ci";
import type {
  DraftSalePaymentAmountSchema,
  DraftSaleSchema,
  RegisterSaleModel,
  SaleItemModel,
} from "@/@types/sale";
import type { DraftRefundSchema } from "@/@types/refund";
import classNames from "@/shared/lib/classNames";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  CommonDeleteDialog,
  DiscountModal,
  PaymentModal,
  PrinterModal,
} from "@/widgets";
import { useCurrencyStore } from "@/app/store/useCurrencyStore";
import type { PaymentAmount } from "@/@types/common";
import { useCashboxApi, useCreatePrintApi } from "@/entities/init/repository";
import {
  useCreateFiscalizedApi,
  useFescalDeviceApi,
  useRegisterSellApi,
} from "@/entities/sale/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import { FiscalizedModal } from "@/features/modals";
import type { FizcalResponsetype } from "@/entities/sale/model";
import {
  FiscalizedProviderTypeEPos,
  FiscalizedProviderTypeHippoPos,
} from "@/app/constants/fiscalized.constants";
import PaymeWhithQR from "@/features/modals/ui/PaymeWhithQR";
import { useRegisterRefundApi } from "@/entities/refund/repository";

type OrderActionType = {
  type: "sale" | "refund";
  draft: DraftSaleSchema[] & DraftRefundSchema[];
  activeDraft: DraftSaleSchema & DraftRefundSchema;
  activeSelectPaymetype: number;
  payModal: boolean;
  setPayModal: (open: boolean) => void;
  deleteDraft: (ind: number) => void;
  updateDraftDiscount: (val: number) => void;
  setActivePaymentSelectType: (val: number) => void;
  complateActiveDraft: () => void;
};

const OrderActions = ({
  type,
  draft,
  activeDraft,
  activeSelectPaymetype,
  payModal,
  setPayModal,
  deleteDraft,
  updateDraftDiscount,
  setActivePaymentSelectType,
  complateActiveDraft,
}: OrderActionType) => {
  const [ipOpenPayment, setIsOpenPayment] = useState(false);
  const [saleId, setSaleId] = useState<number | null>(null);
  const [fiscalizedModal, setFiscalizedModal] = useState(false);
  const [printSelect, setPrintSelect] = useState<boolean>(false);
  const { settings, activeShift } = useSettingsStore();
  const [selectFiscalized, setSelectFiscalized] =
    useState<FizcalResponsetype | null>(null);
  const [discountModal, setDiscountModal] = useState<boolean>(false);
  const [paymeType, setPaymeType] = useState<number[]>([]);

  const nationalCurrency = useCurrencyStore((store) => store.nationalCurrency);
  const warehouseId = useSettingsStore((s) => s.wareHouseId);

  const { data: cashboxData } = useCashboxApi();
  const { mutate: registerSaleMutate } = useRegisterSellApi();
  const { mutate: registerRefundMutate } = useRegisterRefundApi();
  const { mutate: createFiscalized, isPending: fiscalPending } =
    useCreateFiscalizedApi();
  const { data: fiscalData = [] } = useFescalDeviceApi(fiscalizedModal);
  const filterDataFiscal = fiscalData?.filter((elem: any) => elem?.is_enabled);
  const { mutate: printCheck } = useCreatePrintApi();

  const onDeleteActivedraft = () => {
    const findIndex = draft?.findIndex((item) => item?.isActive);
    deleteDraft(findIndex);
  };

  const netPrice = useMemo<number>(() => {
    if (!activeDraft) return 0; // <— himoya

    const totalAmount =
      activeDraft.items?.reduce((acc, item) => acc + item.totalAmount, 0) || 0;

    const discount = activeDraft.discountAmount || 0;

    return totalAmount - discount;
  }, [activeDraft]);

  const totalPaymentAmount = useMemo<number>(() => {
    return (
      (type === "sale"
        ? activeDraft?.payment
        : activeDraft?.payout
      )?.amounts.reduce(
        (acc: number, payment: DraftSalePaymentAmountSchema) =>
          acc + payment?.amount,
        0
      ) ?? 0
    );
  }, [(type === "sale" ? activeDraft?.payment : activeDraft?.payout)?.amounts]);

  const toDebtAmount = useMemo<number>(() => {
    const debtAmount = netPrice - totalPaymentAmount;
    return debtAmount > 0 ? debtAmount : 0;
  }, [netPrice, totalPaymentAmount]);

  const totalMoumentPrice = useMemo(() => {
    const sum =
      activeDraft?.items?.reduce(
        (sum, current) =>
          sum + Number(current?.priceAmount * current?.quantity || 0),
        0
      ) || 0;

    return sum - (activeDraft?.discountAmount || 0);
  }, [activeDraft, toDebtAmount]);

  const handleCancelPrint = () => {
    setPrintSelect(false);
    if (settings?.fiscalization_enabled) setFiscalizedModal(true);
    else setSaleId(null);
  };

  const handleCancelFiscalization = () => {
    setSaleId(null);
    setFiscalizedModal(false);
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
      if (
        [FiscalizedProviderTypeEPos, FiscalizedProviderTypeHippoPos].includes(
          selectFiscalized?.type
        ) &&
        (paymeType.includes(5) || paymeType.includes(6))
      ) {
        setPayModal(true);
        setFiscalizedModal(false);
      } else {
        createFiscalized(payload, {
          onSuccess() {
            showSuccessMessage(
              messages.uz.SUCCESS_MESSAGE,
              messages.ru.SUCCESS_MESSAGE
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
    callback: (success: boolean) => void
  ) {
    // init payload
    const payload: RegisterSaleModel = {
      is_approved: true,
      exact_discount: [],
      items: [],
      cash_box_id: cashboxData?.length ? cashboxData[0]?.id : null,
    };

    const typesPayme =
      (type === "sale" ? activeDraft?.payment : activeDraft?.payout)?.amounts
        ?.filter((item) => item?.amount > 0)
        ?.map((elem) => elem?.paymentType) || [];

    setPaymeType(typesPayme);

    // prepare payload
    {
      // set exact discount

      if (activeDraft?.discountAmount) {
        payload?.exact_discount.push({
          amount: activeDraft?.discountAmount,
          currency_code: nationalCurrency?.code, // todo set national currency id
        });
      }

      // append sale and refund item
      const draftItems = activeDraft?.items ?? [];
      for (let i = 0; i < draftItems.length; i++) {
        const draftItem = draftItems[i];

        const saleAndRefunItem: SaleItemModel = {
          product_id: draftItem.productId,
          warehouse_id: warehouseId ?? null, // todo set default warehouse id
          quantity: draftItem.quantity,
          price: {
            amount: draftItem.priceAmount,
            currency_code: nationalCurrency?.code, // todo set national currency id
          },
          price_type_id: draftItem.priceTypeId, // todo save price type id in store and set
          marks: draftItem.marks,
        };

        payload.items.push(saleAndRefunItem);
      }
      // set payment
      if (paymentAmounts) {
        payload.payment = {
          debt_states: [],
          cash_box_states: [],
        };

        for (let i = 0; i < paymentAmounts.length; i++) {
          const saleAndRefundPayment = paymentAmounts[i];
          if (saleAndRefundPayment?.amount > 0) {
            // append debt state
            payload?.payment?.debt_states.push({
              amount: saleAndRefundPayment?.amount,
              currency_code: nationalCurrency?.code,
            });

            // append cash-box state
            payload?.payment?.cash_box_states.push({
              amount: saleAndRefundPayment?.amount,
              currency_code: nationalCurrency?.code,
              type: saleAndRefundPayment?.paymentType,
            });
          }
        }
      }
    }

    const registerMutate =
      type === "sale" ? registerSaleMutate : registerRefundMutate;

    // register sale
    registerMutate(payload, {
      onSuccess: (data: any) => {
        if (data?.sale?.id) {
          setSaleId(data?.sale?.id);

          if (settings?.auto_print_receipt && settings?.printer_name) {
            onPrint(data?.sale?.id);
          } else if (!settings?.auto_print_receipt && settings?.printer_name) {
            setPrintSelect(true);
          }else{
            handleCancelPrint()
          }
        }

        callback(true);
        complateActiveDraft();
        showSuccessMessage(
          messages.uz.SUCCESS_MESSAGE,
          messages.ru.SUCCESS_MESSAGE
        );
      },
      onError: (error) => {
        showErrorMessage(error);
        callback(true);
      },
    });
  }

  const calcPricePayment = () => {
    const amounts =
      (type === "sale" ? activeDraft?.payment : activeDraft?.payout)?.amounts ||
      [];

    const total = amounts.reduce(
      (sum, current) => sum + Number(current?.amount || 0),
      0
    );

    const debt = netPrice - total;

    if (!activeShift && settings?.shift?.shift_enabled) {
      toast.error("Смена не открыта.");
      return;
    }

    if (debt >= 1 && totalMoumentPrice) {
      toast.error("Продажа в долг невозможна.");
      return;
    }

    if (activeDraft?.items?.length) {
      setIsOpenPayment(true);
    }
  };

  const onPrint = (id?: number) => {
    printCheck(
      {
        path: `${type}-receipt-${settings?.receipt_size || 80}`,
        payload: {
          sale_id: id ?? saleId,
          printer_name: settings?.printer_name ?? "",
        },
      },
      {
        onSuccess() {
          showSuccessMessage(
            messages.uz.SUCCESS_MESSAGE,
            messages.ru.SUCCESS_MESSAGE
          );
          handleCancelPrint();
        },
        onError(error) {
          showErrorMessage(error);
        },
      }
    );
  };

  const onSubmit = () => {
    calcPricePayment();
  };

  useEffect(() => {
    if (filterDataFiscal?.length === 1) {
      setSelectFiscalized(filterDataFiscal[0]);
    }
  }, [filterDataFiscal]);

  return (
    <div className="p-2 bg-gray-100 rounded-2xl flex gap-x-2">
      <CommonDeleteDialog
        description="Удалить корзину? Действие нельзя будет отменить"
        onDelete={onDeleteActivedraft}
      >
        <Button
          variant="plain"
          size="sm"
          icon={<CiSquareMinus />}
          className="!text-red-400 bg-white w-full"
        >
          Oчистка
        </Button>
      </CommonDeleteDialog>
      <Button
        variant="plain"
        disabled={type === "refund"}
        size="sm"
        onClick={() => setDiscountModal(true)}
        icon={<MdOutlineDiscount />}
        className={classNames(
          "bg-white w-full",
          activeSelectPaymetype === 0 && "text-primary"
        )}
      >
        Скидка
      </Button>
      <Button size="sm" onClick={onSubmit} variant="solid" className="w-full">
        Оформить
      </Button>

      <PaymentModal
        type={type}
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

      <DiscountModal
        isOpen={discountModal}
        setDiscountModal={setDiscountModal}
        updateDraftDiscount={updateDraftDiscount}
        discount={activeDraft?.discountAmount ?? 0}
      />

      <PaymeWhithQR
        isOpen={payModal}
        saleId={saleId}
        selectFiscalized={selectFiscalized}
        activeDraftPaymeTypes={paymeType}
        setPaymeType={setPaymeType}
        selectedPaymentType={activeSelectPaymetype}
        handleCancelFiscalization={handleCancelFiscalization}
        handleCancelPayment={handleCancelPayment}
      />
    </div>
  );
};

export default OrderActions;
