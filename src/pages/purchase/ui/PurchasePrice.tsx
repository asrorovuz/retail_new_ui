import type {
  DraftPurchasePayoutAmountSchema,
  DraftPurchaseSchema,
} from "@/@types/purchase";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import {
  useAllProductApi,
  useFindBarcode,
} from "@/entities/products/repository";
import Cashbox from "@/features/cashbox";
import OrderActions from "@/features/order-actions";
import PaymeTypeCards from "@/features/payme-type-cards";
import PaymentSection from "@/features/payment-section";
import PurchaseTable from "@/features/sale-refund-table/ui/PurchaseTable";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import ViewMark from "@/features/viewMark";
import classNames from "@/shared/lib/classNames";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { handleScannedProduct } from "@/shared/lib/handleScannedProduct";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import { Button } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import Footer from "@/widgets/ui/footer/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchasePrice = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [barcodeMark, setBarcodeMark] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [value, setValue] = useState<string>("0");
  const [payModal, setPayModal] = useState(false);
  const [mark, setMark] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<
    "numeric" | "qwerty" | "fullkey"
  >("numeric");
  const [activeSelectPaymetype, setActivePaymentSelectType] =
    useState<number>(1);
  const [search, setSearch] = useState("");
  
  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();

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

  const { data } = useAllProductApi(50, 1, debouncedSearch || "");
  const {
    data: findBarcodeData,
    isSuccess,
    isError,
    isFetching,
  } = useFindBarcode(barcode);

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
          selectedRows,
          barcodeMark,
        );
        setBarcode(null); // qayta so‘rov yubormaslik uchun tozalaymiz
      }
    }
  }, [isSuccess, findBarcodeData, isFetching]);

  useEffect(() => {
    if (!isError || payModal) return;
    showErrorLocalMessage("Товар не найден");
    setBarcode(null);
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
        <PurchaseTable
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
        <Footer deleteDraft={deleteDraftPurchase} draft={draftPurchases} />
      </div>
      <div className="bg-white rounded-2xl p-3">
        <div className="rounded-2xl mb-3 bg-slate-200 p-1">
          <SearchProduct search={search} activeType={activeType} setSearch={setSearch} setActiveType={setActiveType} />
          {activeType === "qwerty" && (
            <>
              <SearchProductTable
                type="purchase"
                debouncedSearch={debouncedSearch}
                selectedRows={selectedRows}
                data={data ?? []}
                setActiveType={setActiveType}
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
        {activeType === "numeric" && (
          <div className="rounded-2xl bg-slate-200 mb-3 p-1 flex gap-x-1">
            <>
              <Button
                onClick={() => navigate("/purchase-history")}
                size="sm"
                className={classNames(
                  "flex flex-col justify-center items-center overflow-hidden",
                )}
              >
                История
              </Button>
              <Button
                onClick={() => navigate("/products")}
                size="sm"
                className={classNames(
                  "flex flex-col justify-center items-center overflow-hidden",
                )}
              >
                Товары
              </Button>
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
            activeSelectPaymetype={activeSelectPaymetype}
            setActivePaymentSelectType={setActivePaymentSelectType}
            complateActiveDraft={completeActiveDraftPurchase}
          />
        </div>
      </div>
      {mark ? (
        <ViewMark
          item={mark}
          onClose={() => setMark(null)}
          activeDraft={activeDraft}
          deleteDraftMark={deleteDraftPurchaseMark}
        />
      ) : null}
    </div>
  );
};

export default PurchasePrice;
