import CurrencyName from "@/shared/lib/CurrencyName";
import payment from "@/shared/lib/payment";
import { Button } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { BsCashCoin } from "react-icons/bs";
import { IoTrendingDownOutline, IoTrendingUpOutline } from "react-icons/io5";

const CashboxCardFooter = ({
  item,
  openModal,
}: {
  item: any;
  openModal: (val: number) => void;
}) => {
  return (
    <>
      <div className="flex justify-between itens-center mb-2">
        <span className="heading-text font-bold text-lg">Суммы</span>
        <span className="heading-text font-bold">
          {payment
            .calculateToPay(
              item.amounts.length
                ? item.amounts
                : payment.getDefaultPrice(false)
            )
            ?.map((i: any) => (
              <p className="flex items-center gap-x-2">
                <FormattedNumber value={i.amount} />
                <CurrencyName currency={i.currency} />
              </p>
            ))}
        </span>
      </div>
      <div className="flex flex-col gap-y-2">
        <Button
          onClick={() => openModal(1)}
          icon={<IoTrendingUpOutline />}
          className="w-full"
          variant="solid"
        >
          Входящие
        </Button>
        <Button
          onClick={() => openModal(2)}
          icon={<IoTrendingDownOutline />}
          className="w-full"
          variant="solid"
        >
          Исходящие
        </Button>
        <Button
          onClick={() => openModal(3)}
          icon={<BsCashCoin />}
          className="w-full"
          variant="solid"
        >
          Расход
        </Button>
        {/* <Button
          onClick={openModal}
          icon={<IoTrendingDownOutline />}
          className="w-full"
          variant="solid"
        >
          Перевод
        </Button> */}
      </div>
    </>
  );
};

export default CashboxCardFooter;
