import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import Cashbox from "@/features/cashbox";

const SalePage = () => {
  const { draftSales, addDraftSale, activateDraftSale } = useDraftSaleStore((store) => store);

  return (
    <div className="flex justify-between gap-x-2">
      <div className="bg-white p-4 rounded-3xl w-full max-w-[790px]">
        <Cashbox drafts={draftSales} addNewDraft={addDraftSale} activateDraft={activateDraftSale}/>
      </div>
    </div>
  );
};

export default SalePage;
