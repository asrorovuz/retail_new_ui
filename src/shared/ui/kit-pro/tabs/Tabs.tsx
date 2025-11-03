import { useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "../../kit/Button";
import type { DraftSaleSchema } from "@/@types/sale";
import { PaymentTypes } from "@/app/constants/payment.types";

type TabsType = {
  drafts: DraftSaleSchema[];
  addNewDraft: (payload: DraftSaleSchema) => void;
  activateDraft: (index: number) => void;
};

export default function Tabs({ drafts, activateDraft, addNewDraft }: TabsType) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const addDrafts = () => {
    const newDraftSale: DraftSaleSchema = {
      items: [],
      isActive: true,
      discountAmount: 0,
      payment: {
        amounts: PaymentTypes.map((paymentType) => {
          return { amount: 0, paymentType: paymentType.type };
        }),
      },
    };
    addNewDraft(newDraftSale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDown = false;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

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
  }, [drafts]); // drafts o‘zgarganda ishlaydi

  return (
    <div className="w-full max-w-[calc(100%-130px)] flex items-center gap-x-2">
      {/* Tabs */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full flex gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        {drafts?.map((draft, index) => (
          <Button
            key={index}
            size="sm"
            ref={(el) => {
              btnRefs.current[index] = el;
            }}
            variant="plain"
            onClick={() => activateDraft(index)}
            className={`px-5 text-sm font-medium rounded-lg transition-colors ${
              draft?.isActive
                ? "bg-white text-primary"
                : "text-gray-500 bg-transparent"
            }`}
          >
            Касса {index > 9 ? index + 1 : "0" + (index + 1)}
          </Button>
        ))}
      </div>

      {/* Add button */}
      <Button
        onClick={addDrafts}
        size="sm"
        iconAlignment="end"
        icon={<FaPlus className="text-sm" />}
        className="bg-white text-sm font-medium rounded-lg"
      >
        Добавить касса
      </Button>
    </div>
  );
}
