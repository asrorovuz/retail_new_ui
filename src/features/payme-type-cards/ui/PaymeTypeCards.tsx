import type { DraftPurchaseSchema } from "@/@types/purchase";
import type { DraftRefundSchema } from "@/@types/refund";
import type { DraftSaleSchema } from "@/@types/sale";
import {
    GetPaymentImageSrc,
    GetPaymentLabel,
} from "@/app/constants/payment.types";
import type { RevisionDraft } from "@/app/store/useRevision";
import classNames from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/kit";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

type BaseProps = {
    activeSelectPaymetype: number;
    setActivePaymentSelectType?: (val: number) => void;
};

type PropsType =
    | ({
          type: "sale";
          activeDraft: DraftSaleSchema;
      } & BaseProps)
    | ({
          type: "refund";
          activeDraft: DraftRefundSchema;
      } & BaseProps)
    | ({
          type: "revision";
          activeDraft: RevisionDraft;
      } & BaseProps)
    | ({
          type: "purchase";
          activeDraft?: DraftPurchaseSchema;
      } & BaseProps);

const PaymeTypeCards = ({
    type,
    activeDraft,
    activeSelectPaymetype,
    setActivePaymentSelectType,
}: PropsType) => {
    const [count, setCount] = useState(0);
    const paymentSource =
        type === "sale" || type === "revision"
            ? activeDraft?.payment
            : activeDraft?.payout;

    const onSetType = (paymentType: number) => {
        if (setActivePaymentSelectType) {
            setActivePaymentSelectType(paymentType);
        }
    };

    if (!paymentSource?.amounts?.length) return null;

    const onShowOtherType = () => {
        if (paymentSource.amounts?.length > count + 3)
            setCount((prev) => prev + 3);
    };

    const onBackType = () => {
        if (count >= 3) setCount((prev) => prev - 3);
    };

    return (
        <div className="grid grid-cols-4 gap-1 overflow-x-auto">
            {count >= 3 && (
                <Button
                    className={classNames(
                        "w-full flex flex-col justify-center items-center overflow-hidden h-full !min-h-10",
                    )}
                    onClick={onBackType}
                    icon={<IoIosArrowBack />}
                />
            )}
            {paymentSource.amounts
                .slice(count, count + 3)
                ?.map((payment, index) => {
                    if (payment?.paymentType === 0) return null;

                    const isActive =
                        Number(activeSelectPaymetype) ===
                        Number(payment?.paymentType);

                    return (
                        <Button
                            key={payment.paymentType}
                            variant="default"
                            disabled={
                                type === "revision" ||
                                (type === "refund" && index > 0)
                            }
                            onClick={() => onSetType(payment.paymentType)}
                            className={classNames(
                                "flex flex-col justify-center items-center overflow-hidden h-full !min-h-10",
                                isActive && "bg-blue-200",
                                +payment?.amount > 0 &&
                                    !isActive &&
                                    "bg-orange-200",
                            )}
                        >
                            <img
                                className="w-full object-contain h-[50px]"
                                src={GetPaymentImageSrc(payment.paymentType)}
                                alt={GetPaymentLabel(payment.paymentType)}
                            />
                        </Button>
                    );
                })}
            {count < 3 && (
                <Button
                    onClick={onShowOtherType}
                    disabled={type === "revision" || type === "refund"}
                    className={classNames(
                        "flex flex-col justify-center items-center overflow-hidden h-full !min-h-10",
                    )}
                >
                    Другие
                </Button>
            )}
        </div>
    );
};

export default PaymeTypeCards;
