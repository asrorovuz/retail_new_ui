import { Button } from "@/shared/ui/kit";
import { type FC } from "react";
import type { CashboxPropsType } from "../model";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Tabs from "@/shared/ui/kit-pro/tabs/Tabs";

const Cashbox: FC<CashboxPropsType> = ({
  drafts,
  addNewDraft,
  activateDraft,
}) => {
  const activeIndex = drafts?.findIndex((item) => item?.isActive);

  return (
    <div className="p-2 bg-gray-100 rounded-2xl flex items-center justify-between gap-x-2 mb-4">
      <Button
        disabled={!activeIndex}
        onClick={() => activateDraft(activeIndex - 1)}
      >
        <BsChevronLeft />
      </Button>

      <Tabs
        drafts={drafts}
        addNewDraft={addNewDraft}
        activateDraft={activateDraft}
      />

      <Button
        disabled={drafts.length === activeIndex + 1}
        onClick={() => activateDraft(activeIndex + 1)}
      >
        <BsChevronRight />
      </Button>
    </div>
  );
};

export default Cashbox;
