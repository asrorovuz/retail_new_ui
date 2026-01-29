import type { DraftPurchaseSchema } from "@/@types/purchase";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useAllProductApi,
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import Cashbox from "@/features/cashbox";
import FavouriteProduct from "@/features/favourite-product";
import { AddProductModal } from "@/features/modals";
import OrderActions from "@/features/order-actions";
import PaymeTypeCards from "@/features/payme-type-cards";
import PaymentSection from "@/features/payment-section";
import SaleAndRefunTable from "@/features/sale-refund-table";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import ViewMark from "@/features/viewMark";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { handleScannedProduct } from "@/shared/lib/handleScannedProduct";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import { useEffect, useState } from "react";

const PurchasePrice = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [barcodeMark, setBarcodeMark] = useState("");
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [value, setValue] = useState<string>("0");
  const [payModal, setPayModal] = useState(false);
  const [mark, setMark] = useState<number | null>(null);
  const [activeOnlyType, setActiveOnlyType] = useState({
    isOpen: false,
    ind: -1,
  });
  const [activeSelectPaymetype, setActivePaymentSelectType] =
    useState<number>(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { settings } = useSettingsStore((s) => s);
  const { draftPurchases, addDraftPurchase, activateDraftPurchase } =
    useDraftPurchaseStore((store) => store);
  const deleteDraftPurchaseItem = useDraftPurchaseStore(
    (store) => store.deleteDraftPurchaseItem
  );
  const deleteDraftPurchase = useDraftPurchaseStore(
    (store) => store.deleteDraftPurchase
  );
  const updateDraftPurchaseDiscount = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseDiscount
  );
  const updateDraftPurchaseItemPrice = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseItemPrice
  );
  const updateDraftPurchaseItemQuantity = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseItemQuantity
  );
  const updateDraftPurchaseItemTotalPrice = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseItemTotalPrice
  );
  const updateDraftPurchasePayout = useDraftPurchaseStore(
    (store) => store.updateDraftPurchasePayout
  );
  const completeActiveDraftPurchase = useDraftPurchaseStore(
    (store) => store.completeActiveDraftPurchase
  );
  const deleteDraftPurchaseMark = useDraftPurchaseStore(
    (store) => store.deleteDraftPurchaseMark
  );

  const { data, isPending } = useAllProductApi(50, 1, debouncedSearch || "");
  const {
    data: findBarcodeData,
    isSuccess,
    isError,
    isFetching,
  } = useFindBarcode(barcode);
  const { data: productPriceType } = usePriceTypeApi();

  const activeDraft: DraftPurchaseSchema =
    draftPurchases?.find((s) => s.isActive) ?? draftPurchases[0];

  useEffect(() => {
    if (!payModal) {
      const onScan = eventBus.on("BARCODE_SCANNED", (code) => {
        const val: string = handleBarcodeScanned(code);
        if (val) {
          setBarcodeMark(code);
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
        handleScannedProduct(findBarcodeData, "purchase", setExpandedId, barcodeMark);
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
      <div className="bg-white p-3 rounded-2xl w-full">
        <Cashbox
          type={"purchase"}
          drafts={draftPurchases}
          addNewDraft={addDraftPurchase}
          activateDraft={activateDraftPurchase}
        />
        <SaleAndRefunTable
          type="purchase"
          draft={draftPurchases}
          setMark={setMark}
          activeDraft={activeDraft}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          expendedId={expendedId}
          setExpandedId={setExpandedId}
          deleteDraftItem={deleteDraftPurchaseItem}
          updateDraftItemPrice={updateDraftPurchaseItemPrice}
          updateDraftItemTotalPrice={updateDraftPurchaseItemTotalPrice}
          updateDraftItemQuantity={updateDraftPurchaseItemQuantity}
        />
        <FavouriteProduct
          type="purchase"
          setExpandedRow={setExpandedRow}
          setExpandedId={setExpandedId}
        />
      </div>

      <div className="bg-white p-3 rounded-2xl w-[320px]">
        <div className="rounded-2xl mb-2">
          <SearchProduct search={search} setSearch={setSearch} />
        </div>

        {!search && !isPending && (
          <>
            <PaymeTypeCards
              type={"purchase"}
              activeDraft={activeDraft}
              activeSelectPaymetype={activeSelectPaymetype}
              setActivePaymentSelectType={setActivePaymentSelectType}
              updateDraftPayment={updateDraftPurchasePayout}
              activeOnlyType={activeOnlyType}
              setActiveOnlyType={setActiveOnlyType}
            />
            <PaymentSection
              type={"purchase"}
              activeDraft={activeDraft}
              activeSelectPaymetype={activeSelectPaymetype}
              value={value}
              setValue={setValue}
              updateDraftDiscount={updateDraftPurchaseDiscount}
              updateDraftPayment={updateDraftPurchasePayout}
            />
            <OrderActions
              type={"purchase"}
              draft={draftPurchases}
              activeDraft={activeDraft}
              payModal={payModal}
              setPayModal={setPayModal}
              addNewDraft={addDraftPurchase}
              deleteDraft={deleteDraftPurchase}
              updateDraftDiscount={updateDraftPurchaseDiscount}
              activeSelectPaymetype={activeSelectPaymetype}
              setActivePaymentSelectType={setActivePaymentSelectType}
              complateActiveDraft={completeActiveDraftPurchase}
            />
          </>
        )}

        {search && !isPending && (
          <>
            <SearchProductTable
              type="purchase"
              debouncedSearch={debouncedSearch}
              data={data ?? []}
              setExpandedRow={setExpandedRow}
              setExpandedId={setExpandedId}
            />
          </>
        )}

        <AddProductModal
          type={"add"}
          setBarcode={setBarcode}
          barcode={barcode}
          isOpen={isOpenAddProduct}
          setIsOpen={setIsOpenAddProduct}
          productPriceType={productPriceType!}
        />

        {mark ? (
          <ViewMark
            item={mark}
            onClose={() => setMark(null)}
            activeDraft={activeDraft}
            deleteDraftMark={deleteDraftPurchaseMark}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PurchasePrice;
