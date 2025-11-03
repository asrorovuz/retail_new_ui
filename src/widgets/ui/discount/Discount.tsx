import classNames from "@/shared/lib/classNames";
import { getDynamicDiscounts } from "@/shared/lib/dynamicDiscount";

type PropsType = {
  toDebtAmount: number;
  active: number;
  updateDraftDiscount: (val: number) => void;
};

const Discount = ({ toDebtAmount, active, updateDraftDiscount }: PropsType) => {
  return (
    <ul className="flex items-center gap-x-2 h-10">
      {getDynamicDiscounts(toDebtAmount || 0)?.map((item) => {
        return (
          <li
            onClick={() => updateDraftDiscount(item)}
            className={classNames(
              "text-base text-gray-500 font-medium bg-white w-max py-2 px-4 rounded-lg",
              active === item && "text-primary"
            )}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
};

export default Discount;
