import type { DraftRefundSchema } from "@/@types/refund";
import type { DraftSaleSchema } from "@/@types/sale";
import {
  GetPaymentImageSrc,
  GetPaymentLabel,
} from "@/app/constants/payment.types";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";

type PropsType = {
  type: "sale" | "refund";
  activeDraft: DraftSaleSchema & DraftRefundSchema;
};

const onlyPrice = [10000, 20000, 50000, 100000, 200000];

const PaymeTypeCards = ({ type, activeDraft }: PropsType) => {
  const [activeOnlyType, setActiveOnlyType] = useState({
    isOpen: false,
    ind: -1,
  });
  const [count, setCount] = useState(0);
  const [activeSelectPaymetype, setActivePaymentSelectType] =
    useState<number>(1);

  const onSelectActiveType = (type: number) => {
    setActivePaymentSelectType(type);
    if (type === 1) {
      setActiveOnlyType(() => ({ isOpen: true, ind: -1 }));
    }
  };

  return (
    <>
      {!activeOnlyType?.isOpen && (
        <div className="grid grid-cols-3 grid-rows-2 gap-1 p-2 bg-gray-50 rounded-2xl mb-2">
          {count >= 5 && <Button
            onClick={() => setCount((prev) => prev - 5)}
            className={classNames(
              "flex flex-col justify-center items-center border-none overflow-hidden h-[70px]"
            )}
          >
            <IoChevronBackSharp />
          </Button>}

          {(type === "sale"
            ? activeDraft?.payment
            : activeDraft?.payout
          )?.amounts?.slice(count, count + 5)?.map((payment) => {
            if (payment?.paymentType === 0) return null;
            return (
              <Button
                key={payment?.paymentType}
                onClick={() => onSelectActiveType(payment?.paymentType)}
                className={classNames(
                  "flex flex-col justify-center items-center border-none overflow-hidden h-[70px]",
                  payment?.amount > 0 && "border-blue-700",
                  activeSelectPaymetype === payment?.paymentType &&
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
          {count < 5 && <Button
            onClick={() => setCount((prev) => prev + 5)}
            className={classNames(
              "flex flex-col justify-center items-center border-none overflow-hidden h-[70px]"
            )}
          >
            Другие
          </Button>}
        </div>
      )}
      {activeOnlyType?.isOpen && (
        <div className="grid grid-cols-3 grid-rows-2 gap-1 p-2 bg-gray-50 rounded-2xl mb-2">
          <Button
            onClick={() => setActiveOnlyType({ isOpen: false, ind: -1 })}
            className={classNames(
              "flex flex-col justify-center items-center border-none overflow-hidden h-[70px]"
            )}
          >
            <IoChevronBackSharp />
          </Button>
          {onlyPrice?.map((payment, index) => {
            return (
              <Button
                key={index}
                onClick={() => {
                  onSelectActiveType(1),
                    setActiveOnlyType((prev) => ({ ...prev, ind: index }));
                }}
                className={classNames(
                  "flex flex-col justify-center border-none overflow-hidden items-center h-[70px]",
                  activeOnlyType?.ind === index && "bg-blue-50"
                )}
              >
                {payment}
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default PaymeTypeCards;
