import { Button } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import MagnetSvg from "@/shared/ui/svg/MagnetSvg";
import { MdClose } from "react-icons/md";

const PriceForm = () => {
  return (
    <div className="rounded-lg bg-white p-2 flex items-center gap-x-6">
      <Button className="border-none" icon={<MdClose />} />
      <div className="w-full text-right font-normal text-2xl">
        <FormattedNumber value={0} />
      </div>
      <Button className="border-none" icon={<MagnetSvg />} />
    </div>
  );
};

export default PriceForm;
