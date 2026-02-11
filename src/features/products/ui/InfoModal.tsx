import { Dialog } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";

const InfoModal = ({ isOpen, setIsOpen, infoData }: any) => {
  return (
    <Dialog
      title="Общая информация"
      width={"90vw"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="grid grid-cols-3 gap-2 text-xl font-semibold">
        <div className="col-span-2">Общая сумма по цене продажи:</div>
        <div className="py-1 px-2 text-right bg-blue-100"><FormattedNumber value={infoData?.sum_common?.[0]?.Amount || 0} /> UZS</div>

        <div className="col-span-2">Общая сумма по оптовой цене:</div>
        <div className="py-1 px-2 text-right bg-blue-100"><FormattedNumber value={infoData?.sum_bulk?.[0]?.Amount || 0} /> UZS</div>

        <div className="col-span-2">Общая сумма по закупочной цене:</div>
        <div className="py-1 px-2 text-right bg-blue-100"><FormattedNumber value={infoData?.sum_purchase?.[0]?.Amount || 0} /> UZS</div>

        <div className="col-span-2">Общий остаток по складам:</div>
        <div className="py-1 px-2 text-right bg-blue-100"><FormattedNumber value={infoData?.sum_stock?.[0]?.Amount || 0} /> </div>
      </div>
    </Dialog>
  );
};

export default InfoModal;
