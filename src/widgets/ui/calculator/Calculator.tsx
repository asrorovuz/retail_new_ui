import { Button } from "@/shared/ui/kit";
import ClearSvg from "@/shared/ui/svg/ClearSvg";

type CalculatorpropsType = {
  value: string;
  setValue: (value: string) => void;
  activeSelectPaymetype: number;
  onPaymentChanged: (type: number, value: number) => void;
};

const Calculator = ({
  setValue,
  value,
  onPaymentChanged,
  activeSelectPaymetype,
}: CalculatorpropsType) => {
  const onClickNumber = (newValue: string) => {
    const updatedValue = value + newValue;
    setValue(updatedValue);
    onPaymentChanged(activeSelectPaymetype, +updatedValue);
  };

  const onDotBtnFired = () => {
    if (!value.includes(".")) {
      const newStr = value + ".";
      setValue(newStr);
      // onPaymentChanged(activeSelectPaymetype, +newStr);
    }
  };

  const onBackSpace = () => {
    if (value.length > 0) {
      const newStr = value.slice(0, -1);
      setValue(newStr);
      onPaymentChanged(activeSelectPaymetype, +newStr);
    }
  };

  return (
    <div className="w-full min-h-[30vh] max-h-[40vh]">
      <div className="grid grid-cols-3 grid-rows-4 gap-1.5">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"].map((num) => (
          <Button
            key={num}
            variant="solid"
            className="bg-white font-medium! text-xl text-gray-800 h-full hover:bg-blue-50 transition-all"
            onClick={() => onClickNumber(num)}
          >
            {num}
          </Button>
        ))}

        <Button
          variant="solid"
          className="bg-white font-medium! text-xl text-gray-800 h-full hover:bg-blue-50 transition-all"
          onClick={onDotBtnFired}
        >
          .
        </Button>

        <Button
          variant="solid"
          icon={<ClearSvg />}
          className="bg-white font-medium! text-xl text-gray-800 h-full w-full hover:bg-blue-50 transition-all"
          onClick={onBackSpace}
        />
      </div>
    </div>
  );
};

export default Calculator;
