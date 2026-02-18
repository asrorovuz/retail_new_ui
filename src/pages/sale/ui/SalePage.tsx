import type {
  DraftSalePaymentAmountSchema,
  DraftSaleSchema,
} from "@/@types/sale";
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
import ViewMark from "@/features/viewMark";
import { Button } from "@/shared/ui/kit";
import { TfiReload } from "react-icons/tfi";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import classNames from "@/shared/lib/classNames";
import { LogoutSvg } from "@/shared/ui/svg/LogoutSvg";
import Alert from "@/shared/ui/kit-pro/alert/Alert";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { getActivePrice } from "@/shared/lib/getActivatePrice";

const SalePage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [barcodeMark, setBarcodeMark] = useState("");
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const [value, setValue] = useState<string>("0");
  const [mark, setMark] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [payModal, setPayModal] = useState(false);
  const [activeSelectPaymetype, setActivePaymentSelectType] =
    useState<number>(1);
  const [showAlert, setShowAlert] = useState(false);
  const [activeType, setActiveType] = useState<"numeric" | "qwerty">("numeric");

  const { draftSales, addDraftSale, activateDraftSale } = useDraftSaleStore(
    (store) => store,
  );

  const { logout } = useAuthContext();

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
    (store) => store.deleteDraftSaleItem,
  );
  const updateDraftSaleItemPrice = useDraftSaleStore(
    (store) => store.updateDraftSaleItemPrice,
  );
  const updateDraftSaleItemQuantity = useDraftSaleStore(
    (store) => store.updateDraftSaleItemQuantity,
  );
  const updateDraftSaleItemTotalPrice = useDraftSaleStore(
    (store) => store.updateDraftSaleItemTotalPrice,
  );
  const updateDraftSaleDiscount = useDraftSaleStore(
    (store) => store.updateDraftSaleDiscount,
  );
  const updateDraftSalePayment = useDraftSaleStore(
    (store) => store.updateDraftSalePayment,
  );
  const completeActiveDraftSale = useDraftSaleStore(
    (store) => store.completeActiveDraftSale,
  );
  const deleteDraftSaleMark = useDraftSaleStore(
    (store) => store.deleteDraftSaleMark,
  );

  const activeDraft: DraftSaleSchema =
    draftSales?.find((s) => s.isActive) ?? draftSales[0];

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
          "sale",
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
    if (settings?.enable_create_unknown_product) {
      setBarcode(barcode);
      setIsOpenAddProduct(true);
    } else {
      showErrorLocalMessage("Товар не найден");
      setBarcode(null);
    }
  }, [isError]);

  return (
    <div className="grid grid-cols-2 gap-x-3">
      <div className="bg-white rounded-2xl p-3">
        <Cashbox
          type={"sale"}
          drafts={draftSales}
          addNewDraft={addDraftSale}
          activateDraft={activateDraftSale}
        />
        <SaleAndRefunTable
          type="sale"
          setMark={setMark}
          draft={draftSales}
          setActiveTypeKeyboard={setActiveType}
          activeDraft={activeDraft}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          expendedId={expendedId}
          setExpandedId={setExpandedId}
          deleteDraftItem={deleteDraftSaleItem}
          updateDraftItemPrice={updateDraftSaleItemPrice}
          updateDraftItemTotalPrice={updateDraftSaleItemTotalPrice}
          updateDraftItemQuantity={updateDraftSaleItemQuantity}
        />
        <FavouriteProduct
          type="sale"
          selectedRows={selectedRows}
          setExpandedRow={setExpandedRow}
          setExpandedId={setExpandedId}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <Button
              onClick={() => setShowAlert(true)}
              className="bg-red-100 h-8 text-red-500 text-xs font-semibold active:bg-red-200 active:text-red-500 hover:text-red-500 transition duration-300"
              variant="plain"
              size="sm"
              icon={<LogoutSvg height={20} width={20} />}
            >
              Выход
            </Button>
            <Button
              variant="default"
              type="button"
              size="sm"
              className="!text-red-500 h-8 py-0 ring-0 hover:ring-0 active:ring-0 hover:border-red-500 active:border-red-500 active:text-red-600"
            >
              Удалить окно
            </Button>
          </div>
          <div className="flex items-center gap-x-2">
            <Button className="h-8 py-0" size="sm" type="button">
              Другие
            </Button>
            <Button
              className="h-8 py-0"
              size="sm"
              icon={<TfiReload />}
              variant="solid"
              type="button"
            >
              Смена
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-3">
        <div className="rounded-2xl mb-3 bg-slate-200 p-1">
          <SearchProduct
            search={search}
            setSearch={setSearch}
            setActiveType={setActiveType}
            activeType={activeType}
          />
          {search && !isPending && (
            <>
              <SearchProductTable
                type="sale"
                debouncedSearch={debouncedSearch}
                selectedRows={selectedRows}
                data={data ?? []}
                setExpandedRow={setExpandedRow}
                setExpandedId={setExpandedId}
              />
            </>
          )}
        </div>
        <div className="rounded-2xl bg-slate-200 mb-3 p-1">
          {!search && !isPending && (
            <>
              <PaymeTypeCards
                type={"sale"}
                activeDraft={activeDraft}
                activeSelectPaymetype={activeSelectPaymetype}
                setActivePaymentSelectType={setActivePaymentSelectType}
              />
            </>
          )}
        </div>
        <div className="rounded-2xl bg-slate-200 mb-3 p-1">
          {!search && !isPending && (
            <>
              <div className="flex items-center gap-1 mb-1">
                {["20000", "50000", "100000", "200000"].map((amountStr) => (
                  <div
                    key={amountStr}
                    onClick={() => {
                      const amount = amountStr.toString(); // string tipiga o'tkazamiz
                      const payments: DraftSalePaymentAmountSchema[] =
                        activeDraft?.payment?.amounts?.map((p) => ({
                          ...p,
                        })) ?? [];

                      const existingIndex = payments.findIndex(
                        (p) => p.paymentType === 1,
                      );

                      let updatedAmounts: DraftSalePaymentAmountSchema[];

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
                      updateDraftSalePayment(updatedAmounts);
                    }}
                    className={classNames(
                      "h-9 px-4 text-sm flex items-center cursor-pointer rounded-lg bg-white font-medium transition-all",
                      activeDraft?.payment?.amounts.find(
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

              <PaymentSection
                type={"sale"}
                activeDraft={activeDraft}
                activeSelectPaymetype={activeSelectPaymetype}
                value={value}
                setValue={setValue}
                activeType={activeType}
                updateDraftDiscount={updateDraftSaleDiscount}
                updateDraftPayment={updateDraftSalePayment}
              />
            </>
          )}
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
    </div>
    // <div className="flex justify-between gap-x-2 h-[calc(100vh-90px)]">

    //   <div className="bg-white p-3 rounded-2xl w-[320px]">

    //     {!search && !isPending && (
    //       <>

    //         <OrderActions
    //           type={"sale"}
    //           draft={draftSales}
    //           activeDraft={activeDraft}
    //           payModal={payModal}
    //           selectedRows={selectedRows}
    //           addNewDraft={addDraftSale}
    //           setPayModal={setPayModal}
    //           deleteDraft={deleteDraftSale}
    //           updateDraftDiscount={updateDraftSaleDiscount}
    //           activeSelectPaymetype={activeSelectPaymetype}
    //           setActivePaymentSelectType={setActivePaymentSelectType}
    //           complateActiveDraft={completeActiveDraftSale}
    //         />
    //       </>
    //     )}

    //     <AddProductModal
    //       type={"add"}
    //       setBarcode={setBarcode}
    //       barcode={barcode}
    //       isOpen={isOpenAddProduct}
    //       setIsOpen={setIsOpenAddProduct}
    //       productPriceType={productPriceType!}
    //     />

    //     {mark ? (
    //       <ViewMark
    //         item={mark}
    //         onClose={() => setMark(null)}
    //         activeDraft={activeDraft}
    //         deleteDraftMark={deleteDraftSaleMark}
    //       />
    //     ) : null}
    //   </div>
    // </div>
  );
};

export default SalePage;
