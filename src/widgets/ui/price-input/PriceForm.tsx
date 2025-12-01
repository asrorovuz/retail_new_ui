import { Button } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import MagnetSvg from "@/shared/ui/svg/MagnetSvg";
import { MdClose } from "react-icons/md";

type Props = {
  type: "sale" | "refund";
  value: string;
  toPayAmount: number;
  setValue: (val: string) => void;
  onPaymentChanged: (typePayment: number, val: number) => void;
  activeSelectPaymetype: number;
};

const PriceForm = ({
  type,
  value,
  toPayAmount,
  setValue,
  onPaymentChanged,
  activeSelectPaymetype,
}: Props) => {
  const clearvalue = () => {
    setValue("0");
    onPaymentChanged(activeSelectPaymetype, 0);
  };

  const onMagent = () => {
    
    if(toPayAmount === 0) return;
    setValue((+toPayAmount + +value)?.toString());
    onPaymentChanged(activeSelectPaymetype, +toPayAmount + +value);
  };

  return (
    <div className="rounded-lg bg-white p-1 flex items-center gap-x-6">
      <Button onClick={clearvalue} className="border-none" icon={<MdClose />} />
      <div className="w-full text-right font-normal text-2xl">
        <FormattedNumber value={value} />
      </div>
      <Button
        onClick={onMagent}
        className={"border-none"}
        icon={
          <span
            className={type === "refund" ? "!text-red-500" : "text-[#2B7FFF]"}
          >
            <MagnetSvg />
          </span>
        }
      />
    </div>
  );
};

export default PriceForm;
