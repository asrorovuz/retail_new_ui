import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "../../kit/Button";
import type { DraftSaleSchema } from "@/@types/sale";
import { addNewSaleAndActivate } from "@/shared/lib/createNewDraft";

type TabsType = {
  drafts: DraftSaleSchema[];
  addNewDraft: (payload: DraftSaleSchema) => void;
  activateDraft: (index: number) => void;
};

export default function Tabs({ drafts, activateDraft, addNewDraft }: TabsType) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const addDrafts = () => addNewSaleAndActivate({ addDrafts: addNewDraft });

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
    const walk = (x - startX) * 1.5; // tezlik
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="flex items-center gap-x-2 w-[630px]">
      {/* Tabs */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        {drafts?.map((draft, index) => (
          <Button
            key={index}
            variant="plain"
            onClick={() => activateDraft(index)}
            className={`px-[17.5px] py-[14px] text-sm font-medium rounded-lg transition-colors ${
              draft?.isActive ? "bg-white text-primary" : "text-gray-500"
            }`}
          >
            Касса {index > 9 ? index + 1 : "0" + (index + 1)}
          </Button>
        ))}
      </div>

      {/* Add button */}
      <Button
        onClick={addDrafts}
        iconAlignment="end"
        icon={<FaPlus className="text-sm" />}
        className="bg-white text-sm font-medium rounded-lg"
      >
        Добавить касса
      </Button>
    </div>
  );
}
