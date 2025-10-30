import type { DraftRefundSchema } from "@/@types/refund";
import type {
  //   DraftSalePaymentAmountSchema,
  DraftSaleSchema,
} from "@/@types/sale";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { Discount, PriceForm } from "@/widgets/header";
import { useMemo } from "react";

type PaymentSectionPropsType = {
  type: "sale" | "refund";
  activeDraft: DraftSaleSchema & DraftRefundSchema;
};

const PaymentSection = ({ type, activeDraft }: PaymentSectionPropsType) => {
  const updateDraftSaleDiscount = useDraftSaleStore(
    (store) => store.updateDraftSaleDiscount
  );
  const updateDraftRefundDiscount = useDraftRefundStore(
    (store) => store.updateDraftRefundDiscount
  );
  const updateDraftDiscount =
    type === "sale" ? updateDraftSaleDiscount : updateDraftRefundDiscount;

  const netPrice = useMemo<number>(() => {
    let totalAmount = activeDraft!.items.reduce(
      (acc, item) => acc + item?.totalAmount,
      0
    );
    // if (activeDraft!.discountAmount) {
    //   totalAmount -= activeDraft!.discountAmount;
    // }
    return totalAmount;
  }, [activeDraft]);

  //   const totalPaymentAmount = useMemo<number>(() => {
  //     return (
  //       (type === "sale"
  //         ? activeDraft?.payment
  //         : activeDraft?.payout
  //       )?.amounts.reduce(
  //         (acc: number, payment: DraftSalePaymentAmountSchema) =>
  //           acc + payment?.amount,
  //         0
  //       ) ?? 0
  //     );
  //   }, [(type === "sale" ? activeDraft?.payment : activeDraft?.payout)?.amounts]);

  //   const toDebtAmount = useMemo<number>(() => {
  //     const debtAmount = netPrice - totalPaymentAmount;
  //     return debtAmount > 0 ? debtAmount : 0;
  //   }, [netPrice, totalPaymentAmount]);
  const toDebtAmount = netPrice;

  return (
    <div className="rounded-2xl bg-gray-50 p-2 flex flex-col gap-y-1">
      <Discount
        toDebtAmount={toDebtAmount}
        updateDraftDiscount={updateDraftDiscount}
        active={activeDraft?.discountAmount ?? 0}
      />
      <PriceForm />
      {/* <Calculator /> */}
    </div>
  );
};

export default PaymentSection;
