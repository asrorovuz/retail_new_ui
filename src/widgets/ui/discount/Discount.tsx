import classNames from "@/shared/lib/classNames";
import { getDynamicDiscounts } from "@/shared/lib/dynamicDiscount";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { useEffect } from "react";

type PropsType = {
  toDebtAmount: number;
  active: number;
  updateDraftDiscount: (val: number) => void;
  clearDiscount: boolean;
};

const Discount = ({ toDebtAmount, active, updateDraftDiscount, clearDiscount }: PropsType) => {
  const onUpdateDiscount = (val: number) => {
    if (active === val) {
      updateDraftDiscount(0);
      return;
    }
    updateDraftDiscount(val);
  };

  useEffect(() => {
    if(!clearDiscount){
      updateDraftDiscount(0)
    }
  }, [clearDiscount])

  return (
    <ul className="flex items-center gap-x-2 h-10">
      {getDynamicDiscounts(toDebtAmount || 0)?.map((item) => {
        return (
          <li
            onClick={() => onUpdateDiscount(item)}
            className={classNames(
              "text-base text-gray-500 font-medium bg-white w-max py-2 px-4 rounded-lg",
              active === item && "text-primary"
            )}
          >
            <FormattedNumber value={item} />
          </li>
        );
      })}
    </ul>
  );
};

export default Discount;
