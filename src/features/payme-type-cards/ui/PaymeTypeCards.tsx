import type {
  DraftRefundSchema,
} from "@/@types/refund";
import type {
  DraftSaleSchema,
} from "@/@types/sale";
import {
  GetPaymentImageSrc,
  GetPaymentLabel,
} from "@/app/constants/payment.types";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";

type PropsType = {
  type: "sale" | "refund" | "purchase";
  activeDraft: DraftSaleSchema & DraftRefundSchema;
  activeSelectPaymetype: number;
  setActivePaymentSelectType: (val: number) => void;
};


const PaymeTypeCards = ({
  type,
  activeDraft,
  activeSelectPaymetype,
  setActivePaymentSelectType,
}: PropsType) => {

  return (
    <>
        <div className="grid grid-cols-5 grid-rows-2 gap-1">
          {(type === "sale"
            ? activeDraft?.payment
            : activeDraft?.payout
          )?.amounts
            ?.map((payment) => {
              if (payment?.paymentType === 0) return null;
              return (
                <Button
                  key={payment?.paymentType}
                  onClick={() => setActivePaymentSelectType(payment?.paymentType)}
                  className={classNames(
                    "flex flex-col justify-center items-center overflow-hidden h-[50px]",
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
        </div>
    </>
  );
};

export default PaymeTypeCards;
