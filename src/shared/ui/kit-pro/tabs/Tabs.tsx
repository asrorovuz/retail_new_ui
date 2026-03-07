import { useRef, useEffect, type FC } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "../../kit/Button";
import type { DraftSaleSchema } from "@/@types/sale";
import type { DraftRefundSchema } from "@/@types/refund";
import type { DraftPurchaseSchema } from "@/@types/purchase";
import type { CashboxPropsType } from "@/features/cashbox/model";
import { PaymentTypes } from "@/app/constants/payment.types";
import classNames from "@/shared/lib/classNames";

const Tabs: FC<CashboxPropsType> = ({
  type,
  drafts,
  activateDraft,
  addNewDraft,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const addDrafts = () => {
    // 🔹 Type-safe yangi draft yaratish
    if (type === "sale") {
      addNewDraft({
        items: [],
        isActive: true,
        discountAmount: "0",
        payment: {
          amounts: PaymentTypes.map((p) => ({
            amount: "0",
            paymentType: p.type,
          })),
        },
      } as DraftSaleSchema);
    }
    if (type === "refund") {
      addNewDraft({
        items: [],
        isActive: true,
        discountAmount: "0",
        payout: {
          amounts: PaymentTypes.map((p) => ({
            amount: "0",
            paymentType: p.type,
          })),
        },
      } as DraftRefundSchema);
    }
    if (type === "purchase") {
      addNewDraft({
        items: [],
        isActive: true,
        discountAmount: "0",
        payout: {
          amounts: PaymentTypes.map((p) => ({
            amount: "0",
            paymentType: p.type,
          })),
        },
      } as DraftPurchaseSchema);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft = scrollRef.current?.scrollLeft || 0;
  };
  const handleMouseLeave = () => (isDown = false);
  const handleMouseUp = () => (isDown = false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // 👉 Active bo‘lgan kassaga scroll qilish
  useEffect(() => {
    const activeIndex = drafts.findIndex((d) => d.isActive);
    if (activeIndex !== -1 && btnRefs.current[activeIndex]) {
      btnRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [drafts]);

  return (
    <div className="w-full max-w-[calc(100%-110px)] flex items-center gap-x-2">
      {/* Tabs */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full flex gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        {drafts.map((draft, index) => (
          <Button
            key={index}
            size="sm"
            ref={(el) => {
              btnRefs.current[index] = el;
            }}
            variant="plain"
            onClick={() => activateDraft(index)}
            className={classNames(
              "px-2 h-8 text-xs font-medium rounded-lg transition-colors bg-transparent",
              draft.isActive && type === "sale" && "!text-primary bg-white",
              draft.isActive && type === "refund" && "!text-red-500 bg-white",
              draft.isActive &&
                type === "purchase" &&
                "!text-green-500 bg-white",
              !draft.isActive && "text-slate-600",
            )}
          >
            <span className="mr-1">Окно</span>
            {index > 9 ? index + 1 : "0" + (index + 1)}
          </Button>
        ))}
      </div>

      {/* Add button */}
      <Button
        onClick={addDrafts}
        size="sm"
        iconAlignment="end"
        icon={<FaPlus className="text-sm" />}
        className="bg-white h-8 text-xs font-medium rounded-lg text-slate-900"
      >
        Доп. oкно
      </Button>
    </div>
  );
};

export default Tabs;
