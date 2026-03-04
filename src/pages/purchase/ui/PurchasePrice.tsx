import type {
  DraftPurchasePayoutAmountSchema,
  DraftPurchaseSchema,
} from "@/@types/purchase";
import { useAuthContext } from "@/app/providers/AuthProvider";
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
import classNames from "@/shared/lib/classNames";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { handleScannedProduct } from "@/shared/lib/handleScannedProduct";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import Footer from "@/widgets/ui/footer/Footer";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const PurchasePrice = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [barcodeMark, setBarcodeMark] = useState("");
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [value, setValue] = useState<string>("0");
  const [payModal, setPayModal] = useState(false);
  const [mark, setMark] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [activeType, setActiveType] = useState<
    "numeric" | "qwerty" | "fullkey"
  >("numeric");
  const [activeOnlyType, setActiveOnlyType] = useState({
    isOpen: false,
    ind: -1,
  });
  const [activeSelectPaymetype, setActivePaymentSelectType] =
    useState<number>(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const setIsOpenNavigate =
    useOutletContext<React.Dispatch<React.SetStateAction<boolean>>>();
  const { logout } = useAuthContext();

  const { settings } = useSettingsStore((s) => s);
  const { draftPurchases, addDraftPurchase, activateDraftPurchase } =
    useDraftPurchaseStore((store) => store);
  const deleteDraftPurchaseItem = useDraftPurchaseStore(
    (store) => store.deleteDraftPurchaseItem,
  );
  const deleteDraftPurchase = useDraftPurchaseStore(
    (store) => store.deleteDraftPurchase,
  );
  const updateDraftPurchaseDiscount = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseDiscount,
  );
  const updateDraftPurchaseItemPrice = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseItemPrice,
  );
  const updateDraftPurchaseItemQuantity = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseItemQuantity,
  );
  const updateDraftPurchaseItemTotalPrice = useDraftPurchaseStore(
    (store) => store.updateDraftPurchaseItemTotalPrice,
  );
  const updateDraftPurchasePayout = useDraftPurchaseStore(
    (store) => store.updateDraftPurchasePayout,
  );
  const completeActiveDraftPurchase = useDraftPurchaseStore(
    (store) => store.completeActiveDraftPurchase,
  );
  const deleteDraftPurchaseMark = useDraftPurchaseStore(
    (store) => store.deleteDraftPurchaseMark,
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
        handleScannedProduct(
          findBarcodeData,
          "purchase",
          setExpandedId,
          barcodeMark,
        );
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
    <div className="grid grid-cols-2 gap-x-3">
      <div className="bg-white rounded-2xl p-3">
        <Cashbox
          type={"purchase"}
          drafts={draftPurchases}
          addNewDraft={addDraftPurchase}
          activateDraft={activateDraftPurchase}
        />
        <SaleAndRefunTable
          type="purchase"
          setMark={setMark}
          draft={draftPurchases}
          activeDraft={activeDraft}
          expandedRow={expandedRow}
          selectedRows={selectedRows}
          expendedId={expendedId}
          setActiveTypeKeyboard={setActiveType}
          setExpandedRow={setExpandedRow}
          setSelectedRows={setSelectedRows}
          setExpandedId={setExpandedId}
          deleteDraftItem={deleteDraftPurchaseItem}
          updateDraftItemPrice={updateDraftPurchaseItemPrice}
          updateDraftItemTotalPrice={updateDraftPurchaseItemTotalPrice}
          updateDraftItemQuantity={updateDraftPurchaseItemQuantity}
        />
        <FavouriteProduct
          type="purchase"
          selectedRows={selectedRows}
          setExpandedRow={setExpandedRow}
          setExpandedId={setExpandedId}
        />
        <Footer
          setIsOpenNavigate={setIsOpenNavigate}
          setShowAlert={setShowAlert}
        />
      </div>
      <div className="bg-white rounded-2xl p-3">
        <div className="rounded-2xl mb-3 bg-slate-200 p-1">
          <SearchProduct
            pageType="purchase"
            search={search}
            setActiveType={setActiveType}
          />
          {activeType === "qwerty" && (
            <>
              <SearchProductTable
                type="purchase"
                debouncedSearch={debouncedSearch}
                selectedRows={selectedRows}
                data={data ?? []}
                setExpandedRow={setExpandedRow}
                setExpandedId={setExpandedId}
              />
            </>
          )}
        </div>
        {activeType === "numeric" && (
          <div className="rounded-2xl bg-slate-200 mb-3 p-1">
            <>
              <PaymeTypeCards
                type={"purchase"}
                activeDraft={activeDraft}
                activeSelectPaymetype={activeSelectPaymetype}
                setActivePaymentSelectType={setActivePaymentSelectType}
              />
            </>
          </div>
        )}
        <div className="rounded-2xl bg-slate-200 mb-3 p-1">
          <>
            {activeType === "numeric" && (
              <div className="flex items-center gap-1 mb-1">
                {["20000", "50000", "100000", "200000"].map((amountStr) => (
                  <div
                    key={amountStr}
                    onClick={() => {
                      const amount = amountStr.toString(); // string tipiga o'tkazamiz
                      const payments: DraftPurchasePayoutAmountSchema[] =
                        activeDraft?.payout?.amounts?.map((p) => ({
                          ...p,
                        })) ?? [];

                      const existingIndex = payments.findIndex(
                        (p) => p.paymentType === 1,
                      );

                      let updatedAmounts: DraftPurchasePayoutAmountSchema[];

                      if (
                        existingIndex >= 0 &&
                        payments[existingIndex].amount === amount
                      ) {
                        payments[existingIndex] = {
                          ...payments[existingIndex],
                          amount: "0",
                        };
                        updatedAmounts = payments;

                        setValue("0");
                      } else if (existingIndex >= 0) {
                        // mavjud bo‘lsa, amount-ni yangilaymiz
                        payments[existingIndex] = {
                          ...payments[existingIndex],
                          amount,
                        };
                        updatedAmounts = payments;
                      } else {
                        // yo‘q bo‘lsa, yangi qo‘shamiz
                        updatedAmounts = [
                          ...payments,
                          { paymentType: 1, amount },
                        ];
                      }

                      setActivePaymentSelectType(1);
                      setValue(amount);
                      updateDraftPurchasePayout(updatedAmounts);
                    }}
                    className={classNames(
                      "h-9 px-4 text-sm flex items-center cursor-pointer rounded-lg bg-white font-medium transition-all",
                      activeDraft?.payout?.amounts.find(
                        (p) => p.paymentType === 1 && p.amount === amountStr,
                      )
                        ? "text-blue-500"
                        : "",
                    )}
                  >
                    <FormattedNumber value={+amountStr} />
                  </div>
                ))}
              </div>
            )}
            <PaymentSection
              type={"purchase"}
              activeDraft={activeDraft}
              activeSelectPaymetype={activeSelectPaymetype}
              value={value}
              setValue={setValue}
              setSearch={setSearch}
              activeType={activeType}
              setActiveType={setActiveType}
              setActivePaymentSelectType={setActivePaymentSelectType}
              updateDraftDiscount={updateDraftPurchaseDiscount}
              updateDraftPayment={updateDraftPurchasePayout}
            />
          </>
        </div>
        <div className="rounded-2xl bg-slate-200 p-1">
          <OrderActions
            type={"purchase"}
            draft={draftPurchases}
            activeDraft={activeDraft}
            payModal={payModal}
            selectedRows={selectedRows}
            addNewDraft={addDraftPurchase}
            setPayModal={setPayModal}
            deleteDraft={deleteDraftPurchase}
            activeSelectPaymetype={activeSelectPaymetype}
            setActivePaymentSelectType={setActivePaymentSelectType}
            complateActiveDraft={completeActiveDraftPurchase}
          />
        </div>
      </div>
      {showAlert && (
        <Alert
          type="warning"
          title="Выход из системы"
          content="Вы действительно хотите выйти из системы?"
          onCancel={() => setShowAlert(false)}
          onConfirm={() => {
            logout();
            setShowAlert(false);
          }}
        />
      )}
      {/* <div className="bg-white p-3 rounded-2xl w-[320px]">


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
      </div> */}
    </div>
  );
};

export default PurchasePrice;
