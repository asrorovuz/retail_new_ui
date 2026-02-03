import classNames from "@/shared/lib/classNames";
import { getDynamicDiscounts } from "@/shared/lib/dynamicDiscount";
import { Button } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

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
    <div className="flex justify-between">
      <ul className="w-full grid grid-cols-3 gap-2">
        {getDynamicDiscounts(toDebtAmount || 0)?.map((item) => (
          <li
            key={item}
            onClick={() => onUpdateDiscount(item)}
            className={classNames(
              "cursor-pointer text-base text-gray-500 font-medium bg-white py-2 px-2 rounded-lg whitespace-nowrap text-center",
              active === item && "text-primary",
            )}
          >
            <FormattedNumber value={item} />
          </li>
        ))}
      </ul>
      {getDynamicDiscounts(toDebtAmount || 0)?.length > 0 ? (
        <Button
          onClick={() => updateDraftDiscount(0)}
          className="p-0"
          icon={<IoIosClose size={22} />}
          size="sm"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Discount;
