import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useAllProductApi } from "@/entities/products/repository";
import Cashbox from "@/features/cashbox";
import FavouriteProduct from "@/features/favourite-product";
import PaymeTypeCards from "@/features/payme-type-cards";
import SaleAndRefunTable from "@/features/sale-refund-table";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import { useDebounce } from "@/shared/lib/useDebounce";
import Loading from "@/shared/ui/loading";
import { useState } from "react";

const SalePage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const { draftSales, addDraftSale, activateDraftSale } = useDraftSaleStore(
    (store) => store
  );

  const { data, isPending } = useAllProductApi(50, 1, debouncedSearch || "");

  const resetActiveDraftSale = useDraftSaleStore(
    (store) => store.resetActiveDraftSale
  );
  const deleteDraftSale = useDraftSaleStore((store) => store.deleteDraftSale);
  const deleteDraftSaleItem = useDraftSaleStore(
    (store) => store.deleteDraftSaleItem
  );
  const updateDraftSaleItemPrice = useDraftSaleStore(
    (store) => store.updateDraftSaleItemPrice
  );
  const updateDraftSaleItemQuantity = useDraftSaleStore(
    (store) => store.updateDraftSaleItemQuantity
  );
  const updateDraftSaleItemTotalPrice = useDraftSaleStore(
    (store) => store.updateDraftSaleItemTotalPrice
  );

  return (
    <div className="flex justify-between gap-x-2">
      <div className="bg-white p-4 rounded-2xl w-3/5 h-[calc(100vh-90px)] overflow-y-auto">
        <Cashbox
          drafts={draftSales}
          addNewDraft={addDraftSale}
          activateDraft={activateDraftSale}
        />
        <SaleAndRefunTable
          type="sale"
          draft={draftSales}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          expendedId={expendedId}
          setExpandedId={setExpandedId}
          deleteDraftItem={deleteDraftSaleItem}
          updateDraftItemPrice={updateDraftSaleItemPrice}
          updateDraftItemTotalPrice={updateDraftSaleItemTotalPrice}
          updateDraftItemQuantity={updateDraftSaleItemQuantity}
        />
        <FavouriteProduct
          type="sale"
          setExpandedRow={setExpandedRow}
          setExpandedId={setExpandedId}
        />
      </div>

      <div className="bg-white p-4 rounded-2xl w-2/5 h-[calc(100vh-90px)] overflow-y-auto">
        <div className="bg-gray-50 p-2 rounded-2xl mb-3">
          <SearchProduct search={search} setSearch={setSearch} />
        </div>

        {isPending && (
          <div className="h-[200px]">
            <Loading />
          </div>
        )}

        {!search && !isPending && (
          <>
            <PaymeTypeCards />
          </>
        )}

        {search && !isPending && (
          <>
            <SearchProductTable
              type="sale"
              debouncedSearch={debouncedSearch}
              data={data ?? []}
              setExpandedRow={setExpandedRow}
              setExpandedId={setExpandedId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SalePage;
