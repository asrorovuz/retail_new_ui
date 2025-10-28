import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import Cashbox from "@/features/cashbox";
import FavouriteProduct from "@/features/favourite-product";
import SaleAndRefunTable from "@/features/sale-refund-table/ui/SaleAndRefunTable";
import { useState } from "react";

const SalePage = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const { draftSales, addDraftSale, activateDraftSale } = useDraftSaleStore(
    (store) => store
  );
  const resetActiveDraftSale = useDraftSaleStore(
    (store) => store.resetActiveDraftSale
  );
  const deleteDraftSale = useDraftSaleStore((store) => store.deleteDraftSale)
  const deleteDraftSaleItem = useDraftSaleStore(
        (store) => store.deleteDraftSaleItem,
    )

  return (
    <div className="flex justify-between gap-x-2">
      <div className="bg-white p-4 rounded-3xl w-3/5 h-[calc(100vh-120px)] overflow-y-auto">
        <Cashbox
          drafts={draftSales}
          addNewDraft={addDraftSale}
          activateDraft={activateDraftSale}
        />
        <SaleAndRefunTable
          type="sale"
          draftSales={draftSales}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          expendedId={expendedId}
          setExpandedId={setExpandedId}
          resetActiveDraft={resetActiveDraftSale}
          deleteDraft={deleteDraftSale}
          deleteDraftItem={deleteDraftSaleItem}
        />
        <FavouriteProduct
          type="sale"
          setExpandedRow={setExpandedRow}
          setExpandedId={setExpandedId}
        />
      </div>
    </div>
  );
};

export default SalePage;
