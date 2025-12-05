import type { DraftRefundSchema } from "@/@types/refund";
import type {
  DraftSalePaymentAmountSchema,
  DraftSaleSchema,
} from "@/@types/sale";
import { Calculator, Discount, PriceForm } from "@/widgets";
import { useEffect, useMemo } from "react";

type PaymentSectionPropsType = {
  type: "sale" | "refund";
  activeDraft: DraftSaleSchema & DraftRefundSchema;
  activeSelectPaymetype: number;
  value: string;
  setValue: (val: string) => void;
  updateDraftDiscount: (val: number) => void;
  updateDraftPayment: (val: DraftSalePaymentAmountSchema[]) => void;
};

const PaymentSection = ({
  type,
  activeDraft,
  activeSelectPaymetype,
  updateDraftPayment,
  updateDraftDiscount,
  value,
  setValue,
}: PaymentSectionPropsType) => {
  const netPrice = useMemo<number>(() => {
    let totalAmount =
      (activeDraft?.items?.length &&
        activeDraft?.items?.reduce(
          (acc, item) => acc + item?.totalAmount,
          0
        )) ||
      0;
    return totalAmount;
  }, [activeDraft]);

  const toPayAmount = useMemo<number>(() => {
    const list =
      type === "sale"
        ? activeDraft?.payment?.amounts
        : activeDraft?.payout?.amounts;

    const totalAmount =
      list?.reduce((acc, item) => acc + (item?.amount || 0), 0) || 0;

    return netPrice - totalAmount - (activeDraft?.discountAmount || 0);
  }, [activeDraft, type]);

  const toDebtAmount = netPrice;

  const onPaymentChanged = (paymentType: number, amount: number) => {
    if (paymentType === 0) {
      updateDraftDiscount(amount);
      return;
    }

    const existing = (
      type === "sale" ? activeDraft?.payment : activeDraft?.payout
    )?.amounts.find((p) => p?.paymentType === paymentType);

    let updatedAmounts;

    if (existing) {
      // Mavjud bo‘lsa, faqat amountni yangilaymiz (hatto 0 bo‘lsa ham)
      updatedAmounts = (
        type === "sale" ? activeDraft?.payment : activeDraft?.payout
      )?.amounts.map((p: DraftSalePaymentAmountSchema) =>
        p?.paymentType === paymentType ? { paymentType, amount } : p
      );
    } else {
      // Mavjud bo‘lmasa, yangi qo‘shamiz
      updatedAmounts = [
        ...(type === "sale" ? activeDraft?.payment : activeDraft?.payout)
          ?.amounts!,
        { paymentType, amount },
      ];
    }

    updateDraftPayment(updatedAmounts as DraftSalePaymentAmountSchema[]);
  };

  useEffect(() => {
    if (activeSelectPaymetype === 0) {
      setValue(activeDraft?.discountAmount?.toString() || "0");
    } else {
      const current = (
        type === "sale" ? activeDraft?.payment : activeDraft?.payout
      )?.amounts.find((p) => p?.paymentType === activeSelectPaymetype);
      setValue(current ? current?.amount?.toString() : "0");
    }
  }, [
    (type === "sale" ? activeDraft?.payment : activeDraft?.payout)?.amounts,
    activeSelectPaymetype,
  ]);

  return (
    <div className="rounded-2xl bg-gray-100 p-2 flex flex-col gap-y-2 mb-2">
      <PriceForm
        type={type}
        value={value}
        setValue={setValue}
        toPayAmount={toPayAmount}
        activeSelectPaymetype={activeSelectPaymetype}
        onPaymentChanged={onPaymentChanged}
      />
      {type === "sale" ? (
        <Discount
          toDebtAmount={toDebtAmount}
          updateDraftDiscount={updateDraftDiscount}
          active={activeDraft?.discountAmount ?? 0}
        />
      ) : (
        <div className="h-10"></div>
      )}
      <Calculator
        value={value}
        setValue={setValue}
        onPaymentChanged={(pt, amount) => onPaymentChanged(pt, amount)}
        activeSelectPaymetype={activeSelectPaymetype}
      />
    </div>
  );
};

export default PaymentSection;
