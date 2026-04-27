import type {
    // DraftSalePaymentAmountSchema,
    DraftSaleSchema,
} from "@/@types/sale";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import {
    useAllProductApi,
    useFindBarcode,
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
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import OrderActions from "@/features/order-actions";
// import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import classNames from "@/shared/lib/classNames";
import Footer from "@/widgets/ui/footer/Footer";
import { Button } from "@/shared/ui/kit";
import { useNavigate } from "react-router-dom";
import ViewMark from "@/features/viewMark";
import PaymentDebtsModal from "@/features/modals/ui/PaymentDebtsModal";
import { Header } from "@/widgets";

const SalePage = () => {
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search ?? "", 500);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [barcodeMark, setBarcodeMark] = useState("");
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [expendedId, setExpandedId] = useState<number | null>(null);
    const [value, setValue] = useState<string>("0");
    const [mark, setMark] = useState<number | null>(null);
    const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>(
        {},
    );
    const [payModal, setPayModal] = useState(false);
    const [activeSelectPaymetype, setActivePaymentSelectType] =
        useState<number>(1);
    const [dobtModal, setDebtModal] = useState(false);

    const navigate = useNavigate();

    const [activeType, setActiveType] = useState<
        "numeric" | "qwerty" | "fullkey"
    >("numeric");

    const { draftSales, addDraftSale, activateDraftSale } = useDraftSaleStore(
        (store) => store,
    );

    const { data } = useAllProductApi(50, 1, debouncedSearch || "");
    const {
        data: findBarcodeData,
        isSuccess,
        isError,
        isFetching,
    } = useFindBarcode(barcode);

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
        showErrorLocalMessage("Товар не найден");
        setBarcode(null);
    }, [isError]);

    return (
        <div className="flex gap-x-3">
            <div className="bg-white w-3/5 rounded-2xl p-3 flex flex-col gap-y-3">
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
                    activeDraft={activeDraft}
                    expandedRow={expandedRow}
                    selectedRows={selectedRows}
                    expendedId={expendedId}
                    setActiveTypeKeyboard={setActiveType}
                    setExpandedRow={setExpandedRow}
                    setSelectedRows={setSelectedRows}
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
                <Footer deleteDraft={deleteDraftSale} draft={draftSales} />
            </div>
            <div className="bg-white w-2/5 rounded-2xl p-3 flex flex-col gap-y-3 h-full">
                <Header />
                <div className="rounded-2xl bg-slate-200 p-1">
                    <SearchProduct
                        search={search}
                        activeType={activeType}
                        setSearch={setSearch}
                        setActiveType={setActiveType}
                    />
                    {activeType === "qwerty" && (
                        <>
                            <SearchProductTable
                                type="sale"
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
                    <div className="rounded-2xl bg-slate-200 p-1">
                        <>
                            <PaymeTypeCards
                                type={"sale"}
                                activeDraft={activeDraft}
                                activeSelectPaymetype={activeSelectPaymetype}
                                setActivePaymentSelectType={
                                    setActivePaymentSelectType
                                }
                            />
                        </>
                    </div>
                )}
                {activeType === "numeric" && (
                    <div className="rounded-2xl bg-slate-200 p-1 flex gap-x-1">
                        <>
                            <Button
                                onClick={() => navigate("/sales-history")}
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
                            <Button
                                onClick={() => navigate("/refund")}
                                size="sm"
                                className={classNames(
                                    "flex flex-col justify-center items-center overflow-hidden",
                                )}
                            >
                                Возвраты
                            </Button>
                            <Button
                                onClick={() => setDebtModal(true)}
                                size="sm"
                                className={classNames(
                                    "flex flex-col justify-center items-center overflow-hidden",
                                )}
                            >
                                Оплатить долг
                            </Button>
                        </>
                    </div>
                )}
                {/* {activeType === "numeric" && (
                    <div className="rounded-2xl bg-slate-200 p-1">
                        <>
                            <div className="grid grid-cols-4 gap-1 mb-1">
                                {["20000", "50000", "100000", "200000"].map(
                                    (amountStr) => (
                                        <div
                                            key={amountStr}
                                            onClick={() => {
                                                const amount =
                                                    amountStr.toString(); // string tipiga o'tkazamiz
                                                const payments: DraftSalePaymentAmountSchema[] =
                                                    activeDraft?.payment?.amounts?.map(
                                                        (p) => ({
                                                            ...p,
                                                        }),
                                                    ) ?? [];

                                                const existingIndex =
                                                    payments.findIndex(
                                                        (p) =>
                                                            p.paymentType === 1,
                                                    );

                                                let updatedAmounts: DraftSalePaymentAmountSchema[];

                                                if (
                                                    existingIndex >= 0 &&
                                                    payments[existingIndex]
                                                        .amount === amount
                                                ) {
                                                    payments[existingIndex] = {
                                                        ...payments[
                                                            existingIndex
                                                        ],
                                                        amount: "0",
                                                    };
                                                    updatedAmounts = payments;

                                                    setValue("0");
                                                } else if (existingIndex >= 0) {
                                                    // mavjud bo‘lsa, amount-ni yangilaymiz
                                                    payments[existingIndex] = {
                                                        ...payments[
                                                            existingIndex
                                                        ],
                                                        amount,
                                                    };
                                                    updatedAmounts = payments;
                                                } else {
                                                    // yo‘q bo‘lsa, yangi qo‘shamiz
                                                    updatedAmounts = [
                                                        ...payments,
                                                        {
                                                            paymentType: 1,
                                                            amount,
                                                        },
                                                    ];
                                                }

                                                setActivePaymentSelectType(1);
                                                setValue(amount);
                                                updateDraftSalePayment(
                                                    updatedAmounts,
                                                );
                                            }}
                                            className={classNames(
                                                "h-9 px-4 text-sm flex items-center justify-center cursor-pointer rounded-lg bg-white font-medium transition-all",
                                                activeDraft?.payment?.amounts.find(
                                                    (p) =>
                                                        p.paymentType === 1 &&
                                                        p.amount === amountStr,
                                                )
                                                    ? "text-blue-500"
                                                    : "",
                                            )}
                                        >
                                            <FormattedNumber
                                                value={+amountStr}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </>
                    </div>
                )} */}
                <PaymentSection
                    type={"sale"}
                    activeDraft={activeDraft}
                    activeSelectPaymetype={activeSelectPaymetype}
                    value={value}
                    setValue={setValue}
                    setSearch={setSearch}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    updateDraftDiscount={updateDraftSaleDiscount}
                    updateDraftPayment={updateDraftSalePayment}
                />

                <OrderActions
                    type={"sale"}
                    keyType={activeType}
                    draft={draftSales}
                    activeDraft={activeDraft}
                    payModal={payModal}
                    selectedRows={selectedRows}
                    addNewDraft={addDraftSale}
                    setPayModal={setPayModal}
                    activeSelectPaymetype={activeSelectPaymetype}
                    updateDraftSaleDiscount={updateDraftSaleDiscount}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    complateActiveDraft={completeActiveDraftSale}
                />
            </div>
            {mark ? (
                <ViewMark
                    itemId={mark}
                    onClose={() => setMark(null)}
                    activeDraft={activeDraft}
                />
            ) : null}

            <PaymentDebtsModal
                dobtModal={dobtModal}
                setDebitModal={setDebtModal}
            />
        </div>
    );
};

export default SalePage;
