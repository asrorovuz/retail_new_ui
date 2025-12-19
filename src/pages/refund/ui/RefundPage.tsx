import type { DraftRefundSchema } from "@/@types/refund";
import { PaymentTypes } from "@/app/constants/payment.types";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useAllProductApi,
  useFindBarcode,
  usePriceTypeApi,
} from "@/entities/products/repository";
import { useCheckRefundApi } from "@/entities/refund/repository";
import Cashbox from "@/features/cashbox";
import FavouriteProduct from "@/features/favourite-product";
import { AddProductModal, RefundCheckModal } from "@/features/modals";
import OrderActions from "@/features/order-actions";
import PaymeTypeCards from "@/features/payme-type-cards";
import PaymentSection from "@/features/payment-section";
import SaleAndRefunTable from "@/features/sale-refund-table";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { handleScannedProduct } from "@/shared/lib/handleScannedProduct";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import { useEffect, useState } from "react";

const RefundPage = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expendedId, setExpandedId] = useState<number | null>(null);
  const [refundCheckData, setRefundCheckData] = useState<any>();
  const [checkCode, setCheckDode] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string>("0");
  const [payModal, setPayModal] = useState(false);
  const [activeSelectPaymetype, setActivePaymentSelectType] =
    useState<number>(1);
  const [activeOnlyType, setActiveOnlyType] = useState({
    isOpen: false,
    ind: -1,
  });
  const [refundCheckModal, setRefundCheckModal] = useState<{
    isOpen: boolean;
    ids: number[];
  }>({
    isOpen: false,
    ids: [],
  });
  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending } = useAllProductApi(50, 1, debouncedSearch || "");
  const { data: productPriceType } = usePriceTypeApi();
  const {
    data: findBarcodeData,
    isSuccess,
    isError,
    isFetching,
  } = useFindBarcode(barcode);

  const { data: checkData, isPending: isCheckPending } =
    useCheckRefundApi(checkCode);

  const { draftRefunds, addDraftRefund, activateDraftRefund } =
    useDraftRefundStore((store) => store);
  const deleteDraftRefund = useDraftRefundStore(
    (store) => store.deleteDraftRefund
  );
  const deleteDraftRefundItem = useDraftRefundStore(
    (store) => store.deleteDraftRefundItem
  );
  const updateDraftDraftItemPrice = useDraftRefundStore(
    (store) => store.updateDraftRefundItemPrice
  );
  const updateDraftDraftItemTotalPrice = useDraftRefundStore(
    (store) => store.updateDraftRefundItemTotalPrice
  );
  const updateDraftRefundItemQuantity = useDraftRefundStore(
    (store) => store.updateDraftRefundItemQuantity
  );
  const updateDraftRefundPayout = useDraftRefundStore(
    (store) => store.updateDraftRefundPayout
  );
  const updateDraftRefundDiscount = useDraftRefundStore(
    (store) => store.updateDraftRefundDiscount
  );
  const completeActiveDraftRefund = useDraftRefundStore(
    (store) => store.completeActiveDraftRefund
  );
  const { settings } = useSettingsStore((s) => s);

  const activeDraft: DraftRefundSchema =
    draftRefunds?.find((s) => s.isActive) ?? draftRefunds[0];

  const handleRefundCheckInputItem = (selectedIds: number[]) => {
    if (!refundCheckData?.items?.length) return;
    // 1️⃣ Eski refundni tozalaymiz (faqat yangi boshlangan refund uchun)
    const newDraftRefund: DraftRefundSchema = {
      items: [],
      isActive: true,
      discountAmount: 0,
      payout: {
        amounts: PaymentTypes.map((paymentType) => ({
          amount: 0,
          paymentType: paymentType.type,
        })),
      },
    };

    // ⚡ Yangi refundni yaratamiz va uni lokalga saqlab ishlatamiz
    const tempRefund = { ...newDraftRefund };
    refundCheckData.items
      .filter((item: any) => selectedIds.includes(item.id))
      .forEach((item: any) => {
        const product = item.warehouse_operation_from?.product;
        // const productPackage = item.warehouse_operation_from?.product_package;
        if (!product) return;

        const priceAmount = item?.price_amount || 0;

        // 🔒 Local tekshiruv (state emas)
        const isAlreadyAdded = tempRefund.items.some(
          (i) => i.productId === product.id
        );
        if (isAlreadyAdded) return;

        tempRefund.items.push({
          productId: product.id,
          productName: product.name,
          productPackageName: product.measurement_name,
          priceAmount: item?.price_amount || 0,
          priceTypeId: item?.price_type_id || 0,
          quantity: item.quantity || 1,
          totalAmount: (item.quantity || 1) * priceAmount,
          catalogName: product.catalog_name,
          catalogCode: product.catalog_code,
        });
      });

    // 🔚 Oxirida bir marta set qilamiz
    addDraftRefund(tempRefund);
  };

  useEffect(() => {
    if (activeSelectPaymetype === 0) {
      setValue(activeDraft?.discountAmount?.toString() || "0");
    }
  }, [activeSelectPaymetype, activeDraft?.discountAmount]);

  useEffect(() => {
    if (!payModal) {
      const onScan = eventBus.on("BARCODE_SCANNED", (code) => {
        if (code && code?.trim().startsWith("*")) {
          const newBarcode = code?.slice(1);
          setCheckDode(newBarcode);
          setRefundCheckModal((prev) => ({ ...prev, isOpen: true }));
        } else {
          const val: string = handleBarcodeScanned(code);
          if (val) {
            setBarcode(val);
          }
        }
      });

      return () => eventBus.remove("BARCODE_SCANNED", onScan);
    }
  }, []);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      if (findBarcodeData) {
        handleScannedProduct(findBarcodeData, "refund");
        setBarcode(null);
      }
    }
  }, [isSuccess, findBarcodeData, isFetching]);

  useEffect(() => {
    if (isError) {
      if (settings?.enable_create_unknown_product) {
        setBarcode(barcode);
        setIsOpenAddProduct(true);
      } else {
        showErrorLocalMessage("Товар не найден");
        setBarcode(null);
      }
    }
  }, [isError]);

  useEffect(() => {
    if (checkData) {
      setRefundCheckData(checkData);
    }
  }, [checkData]);

  return (
    <div className="flex justify-between gap-x-2 h-[calc(100vh-90px)]">
      <div className="bg-white p-3 rounded-2xl w-3/5">
        <Cashbox
          type={"refund"}
          drafts={draftRefunds}
          addNewDraft={addDraftRefund}
          activateDraft={activateDraftRefund}
        />
        <SaleAndRefunTable
          type="refund"
          draft={draftRefunds}
          activeDraft={activeDraft}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          expendedId={expendedId}
          setExpandedId={setExpandedId}
          deleteDraftItem={deleteDraftRefundItem}
          updateDraftItemPrice={updateDraftDraftItemPrice}
          updateDraftItemTotalPrice={updateDraftDraftItemTotalPrice}
          updateDraftItemQuantity={updateDraftRefundItemQuantity}
        />
        <FavouriteProduct
          type="refund"
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
              type={"refund"}
              activeDraft={activeDraft}
              activeSelectPaymetype={activeSelectPaymetype}
              setActivePaymentSelectType={setActivePaymentSelectType}
              updateDraftPayment={updateDraftRefundPayout}
              activeOnlyType={activeOnlyType}
              setActiveOnlyType={setActiveOnlyType}
            />
            <PaymentSection
              type={"refund"}
              activeDraft={activeDraft}
              activeSelectPaymetype={activeSelectPaymetype}
              value={value}
              setValue={setValue}
              updateDraftDiscount={updateDraftRefundDiscount}
              updateDraftPayment={updateDraftRefundPayout}
            />
            <OrderActions
              type={"refund"}
              draft={draftRefunds}
              activeDraft={activeDraft}
              payModal={payModal}
              setPayModal={setPayModal}
              deleteDraft={deleteDraftRefund}
              updateDraftDiscount={updateDraftRefundDiscount}
              activeSelectPaymetype={activeSelectPaymetype}
              setActivePaymentSelectType={setActivePaymentSelectType}
              complateActiveDraft={completeActiveDraftRefund}
            />
          </>
        )}

        {search && !isPending && (
          <>
            <SearchProductTable
              type="refund"
              debouncedSearch={debouncedSearch}
              data={data ?? []}
              setExpandedRow={setExpandedRow}
              setExpandedId={setExpandedId}
            />
          </>
        )}

        <RefundCheckModal
          loading={isCheckPending}
          isOpen={refundCheckModal?.isOpen}
          setRefundCheckModal={setRefundCheckModal}
          handleRefundCheckInputItem={handleRefundCheckInputItem}
          items={refundCheckData?.items || []}
        />

        <AddProductModal
          type={"add"}
          setType={() => {}}
          setBarcode={setBarcode}
          barcode={barcode}
          isOpen={isOpenAddProduct}
          setIsOpen={setIsOpenAddProduct}
          productPriceType={productPriceType!}
        />
      </div>
    </div>
  );
};

export default RefundPage;
