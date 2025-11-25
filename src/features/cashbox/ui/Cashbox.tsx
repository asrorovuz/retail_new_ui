import { Button } from "@/shared/ui/kit";
import { type FC } from "react";
import type { CashboxPropsType } from "../model";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Tabs from "@/shared/ui/kit-pro/tabs/Tabs";

const Cashbox: FC<CashboxPropsType> = ({
  type,
  drafts,
  addNewDraft,
  activateDraft,
}) => {
  const activeIndex = drafts?.findIndex((item) => item?.isActive);

  return (
    <div className="p-2 rounded-2xl flex items-center justify-between gap-x-2 mb-3 bg-slate-200">
      <Button
        disabled={!activeIndex}
        className="bg-white disabled:bg-white"
        variant="plain"
        icon={<BsChevronLeft />}
        size="sm"
        onClick={() => activateDraft(activeIndex - 1)}
      />

      <Tabs
        type={type}
        drafts={drafts}
        addNewDraft={addNewDraft}
        activateDraft={activateDraft}
      />

      <Button
        size="sm"
        disabled={drafts?.length === activeIndex + 1}
        onClick={() => activateDraft(activeIndex + 1)}
      >
        <BsChevronRight />
      </Button>
    </div>
  );
};

export default Cashbox;
