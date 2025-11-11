import type { DraftSaleSchema } from "@/@types/sale";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import {
  useAllProductApi,
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import Cashbox from "@/features/cashbox";
import FavouriteProduct from "@/features/favourite-product";
import PaymeTypeCards from "@/features/payme-type-cards";
import SaleAndRefunTable from "@/features/sale-refund-table";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import { useDebounce } from "@/shared/lib/useDebounce";
import { useEffect, useState } from "react";
import PaymentSection from "@/features/payment-section/ui/PaymentSection";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { handleScannedProduct } from "@/shared/lib/handleScannedProduct";
import { AddProductModal } from "@/features/modals";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import OrderActions from "@/features/order-actions";

const SalePage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const [value, setValue] = useState<string>("0");
  const [payModal, setPayModal] = useState(false);
  const [activeOnlyType, setActiveOnlyType] = useState({
    isOpen: false,
    ind: -1,
  });
  const [activeSelectPaymetype, setActivePaymentSelectType] =
    useState<number>(1);

  const { draftSales, addDraftSale, activateDraftSale } = useDraftSaleStore(
    (store) => store
  );

  const { data, isPending } = useAllProductApi(50, 1, debouncedSearch || "");
  const {
    data: findBarcodeData,
    isSuccess,
    isError,
    isFetching,
  } = useFindBarcode(barcode);
  const { data: productPriceType } = usePriceTypeApi();

  const { settings } = useSettingsStore((s) => s);
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
  const updateDraftSaleDiscount = useDraftSaleStore(
    (store) => store.updateDraftSaleDiscount
  );
  const updateDraftSalePayment = useDraftSaleStore(
    (store) => store.updateDraftSalePayment
  );
  const completeActiveDraftSale = useDraftSaleStore(
    (store) => store.completeActiveDraftSale
  );

  const activeDraft: DraftSaleSchema =
    draftSales?.find((s) => s.isActive) ?? draftSales[0];

  useEffect(() => {
    if (!payModal) {
      const onScan = eventBus.on("BARCODE_SCANNED", (code) => {
        const val: string = handleBarcodeScanned(code);
        if (val) {
          setBarcode(val);
        }
      });

      return () => eventBus.remove("BARCODE_SCANNED", onScan);
    }
  }, []);

  useEffect(() => {
    if (activeSelectPaymetype === 0) {
      setValue(activeDraft?.discountAmount?.toString() || "0");
    }
  }, [activeSelectPaymetype, activeDraft?.discountAmount]);

  useEffect(() => {
    if (isSuccess && !isFetching && !payModal) {
      if (findBarcodeData) {
        handleScannedProduct(findBarcodeData, "sale");
        setBarcode(null); // qayta so‘rov yubormaslik uchun tozalaymiz
      }
    }
  }, [isSuccess, findBarcodeData, isFetching]);

  useEffect(() => {
    if (isError && !payModal) {
      if (settings?.enable_create_unknown_product) {
        setBarcode(barcode);
        setIsOpenAddProduct(true);
      } else {
        showErrorLocalMessage("Товар не найден");
        setBarcode(null);
      }
    }
  }, [isError]);

  return (
    <div className="flex justify-between gap-x-2 h-[calc(100vh-90px)]">
      <div className="bg-white p-3 rounded-2xl w-3/5">
        <Cashbox
          type={"sale"}
          drafts={draftSales}
          addNewDraft={addDraftSale}
          activateDraft={activateDraftSale}
        />
        <SaleAndRefunTable
          type="sale"
          draft={draftSales}
          activeDraft={activeDraft}
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

      <div className="bg-white p-3 rounded-2xl w-2/5">
        <div className="rounded-2xl mb-2">
          <SearchProduct search={search} setSearch={setSearch} />
        </div>

        {!search && !isPending && (
          <>
            <PaymeTypeCards
              type={"sale"}
              activeDraft={activeDraft}
              activeSelectPaymetype={activeSelectPaymetype}
              setActivePaymentSelectType={setActivePaymentSelectType}
              updateDraftPayment={updateDraftSalePayment}
              activeOnlyType={activeOnlyType}
              setActiveOnlyType={setActiveOnlyType}
            />
            <PaymentSection
              type={"sale"}
              activeDraft={activeDraft}
              activeSelectPaymetype={activeSelectPaymetype}
              value={value}
              setValue={setValue}
              updateDraftDiscount={updateDraftSaleDiscount}
              updateDraftPayment={updateDraftSalePayment}
            />
            <OrderActions
              type={"sale"}
              draft={draftSales}
              activeDraft={activeDraft}
              payModal={payModal}
              setPayModal={setPayModal}
              deleteDraft={deleteDraftSale}
              updateDraftDiscount={updateDraftSaleDiscount}
              activeSelectPaymetype={activeSelectPaymetype}
              setActivePaymentSelectType={setActivePaymentSelectType}
              complateActiveDraft={completeActiveDraftSale}
            />
          </>
        )}

        {search && !isPending && (
          <>
            <SearchProductTable
              type="sale"
              debouncedSearch={debouncedSearch}
              setSearchValue={setSearch}
              data={data ?? []}
              setExpandedRow={setExpandedRow}
              setExpandedId={setExpandedId}
            />
          </>
        )}

        <AddProductModal
          type={"add"}
          setType={() => {}}
          setBarcode={setBarcode}
          barcode={barcode}
          isOpen={isOpenAddProduct}
          setIsOpen={setIsOpenAddProduct}
          productPriceType={productPriceType}
        />
      </div>
    </div>
  );
};

export default SalePage;
