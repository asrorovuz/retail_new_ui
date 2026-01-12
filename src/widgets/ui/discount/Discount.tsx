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

const Discount = ({
  toDebtAmount,
  active,
  updateDraftDiscount,
  clearDiscount,
}: PropsType) => {
  const onUpdateDiscount = (val: number) => {
    if (active === val) {
      updateDraftDiscount(0);
      return;
    }
    updateDraftDiscount(val);
  };

  useEffect(() => {
    if (!clearDiscount) {
      updateDraftDiscount(0);
    }
  }, [clearDiscount]);

  return (
    <ul className="w-full grid grid-cols-4 gap-2">
      {getDynamicDiscounts(toDebtAmount || 0)?.map((item) => (
        <li
          key={item}
          onClick={() => onUpdateDiscount(item)}
          className={classNames(
            "cursor-pointer text-base text-gray-500 font-medium bg-white py-2 px-2 rounded-lg whitespace-nowrap text-center",
            active === item && "text-primary"
          )}
        >
          <FormattedNumber value={item} />
        </li>
      ))}
    </ul>
  );
};

export default Discount;
