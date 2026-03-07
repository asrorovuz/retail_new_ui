import { messages } from "@/app/constants/message.request";
import { CurrencyCodeUZS } from "@/app/constants/payment.types";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useContractorApi,
  usePaymentDebtsApi,
} from "@/entities/sale/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Input, Select } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

const PaymentDebtsModal = ({
  dobtModal,
  contractorId,
  setContragentId,
  setDebitModal,
}: {
  dobtModal: boolean;
  contractorId?: number | null;
  setContragentId?: (val: number | null) => void;
  setDebitModal: (val: boolean) => void;
}) => {
  const [debitData, setDebitData] = useState({
    notes: "",
    amount: 0,
    contractor_id: null,
  });

  const { data, isPending } = useContractorApi(dobtModal, "");
  const { mutate, isPending: mutPending } = usePaymentDebtsApi();

  const wareHouseId = useSettingsStore((s) => s.wareHouseId);

  const contractorOptions = useMemo(() => {
    return (
      data?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
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
    if (setContragentId) {
      setContragentId(null);
    }
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
  };

  useEffect(() => {
    if (contractorId) {
      setDebitData((prev: any) => ({
        ...prev,
        contractor_id: contractorId,
      }));
    }
  }, [contractorId]);

  return (
    <Dialog
      onRequestClose={onCloseDebitModal}
      onClose={onCloseDebitModal}
      isOpen={dobtModal}
      width={"40vw"}
      title={"Погасить долг"}
    >
      <div className="flex flex-col gap-4">
        {/* Qarz miqdori */}
        <div className="text-xl text-slate-800 font-semibold">
          Долг: <FormattedNumber value={debitData?.amount || 0} scale={2} />
        </div>

        <FormItem labelClass="mb-1" className="!mb-3" label="Клиент">
          <Select
            options={contractorOptions}
            size="sm"
            isLoading={isPending}
            className="w-full bg-white"
            placeholder="Клиент"
            getOptionLabel={(option) => option?.label || ""}
            getOptionValue={(option) => String(option?.value)}
            value={contractorOptions.find(
              (opt: any) => opt.value === debitData.contractor_id,
            )}
            onChange={(val) =>
              setDebitData((prev) => ({
                ...prev,
                contractor_id: val?.value ?? null,
              }))
            }
          />
        </FormItem>

        <FormItem label="Долг" className="!mb-1">
          <Input
            type="number"
            value={debitData.amount}
            size="sm"
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
            className="w-full h-[80px] border border-slate-300 rounded-lg p-1 outline-blue-400 resize-none"
            onChange={(e) =>
              setDebitData((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </FormItem>

        {/* Tugmalar */}
        <div className="flex justify-end gap-2 mt-4">
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
            loading={mutPending}
            size="sm"
            onClick={sendPaymentData}
          >
            Оплатить
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentDebtsModal;
