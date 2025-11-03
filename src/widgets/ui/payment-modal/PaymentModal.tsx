import type { PaymentAmount } from "@/@types/common";
import type { DraftRefundSchema } from "@/@types/refund";
import type {
  DraftSalePaymentAmountSchema,
  DraftSaleSchema,
} from "@/@types/sale";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { Button, Dialog } from "@/shared/ui/kit";
import SuccessSvg from "@/shared/ui/svg/SuccessSvg";
import { useState } from "react";

type PaymentModalType = {
  type: "sale" | "refund";
  cashBackAmount: number;
  totalPaymentAmount: number;
  isOpen: boolean;
  onSubmitPaymentHandler: (
    paymentAmounts: PaymentAmount[],
    callback: (success: boolean) => void
  ) => void;
  activeDraft: DraftSaleSchema & DraftRefundSchema;
  setIsOpenPayment: (open: boolean) => void;
};

const PaymentModal = ({
  type,
  cashBackAmount,
  totalPaymentAmount,
  isOpen,
  activeDraft,
  onSubmitPaymentHandler,
  setIsOpenPayment,
}: PaymentModalType) => {
  const [loading, setIsLoading] = useState(false);
  const { settings } = useSettingsStore((s) => s);

  const onSubmitPayment = (): void => {
    setIsLoading(true);
    let subtracted = false;
    onSubmitPaymentHandler(
      (type === "sale"
        ? activeDraft?.payment
        : activeDraft?.payout
      )?.amounts.map((item: DraftSalePaymentAmountSchema) => {
        if (!subtracted && item?.amount > cashBackAmount) {
          subtracted = true;
          return { ...item, amount: item?.amount - cashBackAmount };
        }
        return item;
      })!,
      (success) => {
        setIsLoading(false);
        if (success) {
          if (type === "sale") {
            setIsOpenPayment(false);
            if (!settings?.fiscalization_enabled) {
              setIsOpenPayment(false);
            }
          } else if (type === "refund") {
            setIsOpenPayment(false);
            setIsOpenPayment(false);
          } else {
            return;
          }
        }
      }
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
        <p className="text-green-500 mt-4 text-base font-medium">
          Оплачено успешно
        </p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-4 text-gray-900 mb-4">
        <div className="flex justify-between pb-4 border-b border-dashed">
          <span className="text-gray-600">Оплачено сумма:</span>{" "}
          {totalPaymentAmount ?? 0}
        </div>
        <div className="flex justify-between pt-4">
          <span>Сдачи:</span> {cashBackAmount ?? 0}
        </div>
      </div>
      <Button
        loading={loading}
        onClick={onSubmitPayment}
        variant="solid"
        className="w-full"
      >
        Завершить
      </Button>
    </Dialog>
  );
};

export default PaymentModal;
