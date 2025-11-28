import type {
  DraftRefundPayoutAmountSchema,
  DraftRefundSchema,
} from "@/@types/refund";
import type {
  DraftSalePaymentAmountSchema,
  DraftSaleSchema,
} from "@/@types/sale";
import {
  GetPaymentImageSrc,
  GetPaymentLabel,
} from "@/app/constants/payment.types";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";

type ActiveOnlyType = {
  isOpen: boolean;
  ind: number;
};

type PropsType = {
  type: "sale" | "refund";
  activeDraft: DraftSaleSchema & DraftRefundSchema;
  activeSelectPaymetype: number;
  updateDraftPayment: (
    val: DraftSalePaymentAmountSchema[] | DraftRefundPayoutAmountSchema[]
  ) => void;
  setActivePaymentSelectType: (val: number) => void;
  activeOnlyType: ActiveOnlyType;
  setActiveOnlyType: (val: ActiveOnlyType) => void;
};

const onlyPrice = [10000, 20000, 50000, 100000, 200000];

const PaymeTypeCards = ({
  type,
  activeDraft,
  activeSelectPaymetype,
  updateDraftPayment,
  setActivePaymentSelectType,
  setActiveOnlyType,
  activeOnlyType,
}: PropsType) => {
  const [count, setCount] = useState(0);

  const onSelectActiveType = (type: number) => {
    setActivePaymentSelectType(type);
  };

  const onSelectOnlyPayment = (amount: number, index: number) => {
    const existing = (
      type === "sale" ? activeDraft?.payment : activeDraft?.payout
    )?.amounts.find((p) => p.paymentType === 1);

    let updatedAmounts;

    if (existing) {
      // mavjud bo‘lsa — qiymatini yangilaymiz
      updatedAmounts = (
        type === "sale" ? activeDraft?.payment : activeDraft?.payout
      )?.amounts.map(
        (p: DraftSalePaymentAmountSchema | DraftRefundPayoutAmountSchema) =>
          p.paymentType === 1 ? { paymentType: 1, amount } : p
      );
    } else {
      // yo‘q bo‘lsa — yangi qo‘shamiz
      updatedAmounts = [
        ...((type === "sale" ? activeDraft?.payment : activeDraft?.payout)
          ?.amounts ?? []),
        { paymentType: 1, amount },
      ];
    }

    onSelectActiveType(1);
    setActiveOnlyType({ ...activeOnlyType, ind: index });
    updateDraftPayment(
      updatedAmounts as
        | DraftSalePaymentAmountSchema[]
        | DraftRefundPayoutAmountSchema[]
    );
  };

  return (
    <>
      {!activeOnlyType?.isOpen && (
        <div className="grid grid-cols-3 grid-rows-2 gap-1 p-2 bg-gray-50 rounded-2xl mb-2">
          {count >= 5 && (
            <Button
              onClick={() => setCount((prev) => prev - 5)}
              className={classNames(
                "flex flex-col justify-center items-center border-none overflow-hidden h-[50px]"
              )}
            >
              <IoChevronBackSharp />
            </Button>
          )}

          {(type === "sale"
            ? activeDraft?.payment
            : activeDraft?.payout
          )?.amounts
            ?.slice(count, count + 5)
            ?.map((payment) => {
              if (payment?.paymentType === 0) return null;
              return (
                <Button
                  key={payment?.paymentType}
                  onClick={() => onSelectActiveType(payment?.paymentType)}
                  onDoubleClick={() => {
                    if (payment?.paymentType === 1) {
                      setActiveOnlyType({ ...activeOnlyType, isOpen: true });
                    }
                  }}
                  className={classNames(
                    "flex flex-col justify-center items-center overflow-hidden h-[50px]",
                    payment?.amount
                      ? "border-2 border-blue-300"
                      : "border-none",
                    +activeSelectPaymetype === +payment?.paymentType &&
                      "bg-blue-50"
                  )}
                >
                  <img
                    className="h-16 w-16 object-contain"
                    src={GetPaymentImageSrc(payment?.paymentType)}
                    alt={GetPaymentLabel(payment?.paymentType)}
                  />
                </Button>
              );
            })}
          {count < 5 && (
            <Button
              onClick={() => setCount((prev) => prev + 5)}
              className={classNames(
                "flex flex-col justify-center items-center border-none overflow-hidden h-[50px]"
              )}
            >
              Другие
            </Button>
          )}
        </div>
      )}
      {activeOnlyType?.isOpen && (
        <div className="grid grid-cols-3 grid-rows-2 gap-1 p-1 bg-gray-50 rounded-2xl mb-2">
          <Button
            onClick={() =>
              setActiveOnlyType({ ...activeOnlyType, isOpen: false })
            }
            className={classNames(
              "flex flex-col justify-center items-center border-none overflow-hidden h-[50px]"
            )}
          >
            <IoChevronBackSharp />
          </Button>
          {onlyPrice?.map((amount, index) => {
            return (
              <Button
                key={index}
                onClick={() => {
                  onSelectOnlyPayment(amount, index),
                    setActiveOnlyType({ ...activeOnlyType, isOpen: false });
                }}
                className={classNames(
                  "flex flex-col justify-center border-none overflow-hidden items-center h-[50px]",
                  activeOnlyType?.ind === index && "bg-blue-50"
                )}
              >
                <FormattedNumber value={amount} />
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default PaymeTypeCards;
