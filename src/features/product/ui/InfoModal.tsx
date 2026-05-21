import { Dialog } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";

const InfoModal = ({ isOpen, setIsOpen, infoData }: any) => {

  return (
    <Dialog
      title={<span className="text-base font-medium">Отчеть по товаром</span>}
      width={"263px"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="flex flex-col gap-2 text-xl font-semibold">
        <article className="bg-slate-200 p-4 rounded-lg text-center">
          <div className="text-base font-semibold text-blue-500 mb-2">
            <FormattedNumber value={infoData?.sum_common?.[0]?.Amount || 0} />{" "}
            UZS
          </div>
          <div className="text-xs font-normal text-slate-800">
            Общая сумма по розничной цене
          </div>
        </article>

        <article className="bg-slate-200 p-4 rounded-lg text-center">
          <div className="text-base font-semibold text-blue-500 mb-2">
            <FormattedNumber value={infoData?.sum_bulk?.[0]?.Amount || 0} /> UZS
          </div>
          <div className="text-xs font-normal text-slate-800">
            Общая сумма по оптовой цене
          </div>
        </article>

        <article className="bg-slate-200 p-4 rounded-lg text-center">
          <div className="text-base font-semibold text-blue-500 mb-2">
            <FormattedNumber value={infoData?.sum_purchase?.[0]?.Amount || 0} />{" "}
            UZS
          </div>
          <div className="text-xs font-normal text-slate-800">
            Общая сумма по закупочной цене
          </div>
        </article>
      </div>
    </Dialog>
  );
};

export default InfoModal;
