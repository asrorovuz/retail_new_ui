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
import { useCheckPermission } from "@/shared/lib/checkPermission";
import { AccountPermissions } from "@/app/constants/permissions";
import QuertyKeyboard from "@/widgets/ui/keyboard/QuertyKeyboard";

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
    const checkPermission = useCheckPermission();

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
    const updateDraftSaleItemPriceBulk = useDraftSaleStore(
        (store) => store.updateDraftSaleItemPriceBulk,
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
        <div className="flex gap-x-2 bg-white h-screen overflow-hidden p-2">
            <div className="bg-white w-[65%] flex flex-col gap-y-2">
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
                    updateDraftItemPriceBulk={updateDraftSaleItemPriceBulk}
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

            <div className="bg-white w-[35%] flex flex-col gap-y-2">
                <Header />
                <div className={classNames("rounded-lg p-1 flex flex-col gap-2", activeType === "qwerty" && "h-full")}>
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
                            <QuertyKeyboard
                                setActiveType={setActiveType}
                                setSearch={setSearch}
                            />
                        </>
                    )}
                </div>
                {activeType === "numeric" && (
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
                )}
                {activeType === "numeric" && (
                    <div className="flex gap-x-1">
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
                            {checkPermission(
                                AccountPermissions.AccountPermissionProductView,
                            ) && (
                                <Button
                                    onClick={() => navigate("/products")}
                                    size="sm"
                                    className={classNames(
                                        "flex flex-col justify-center items-center overflow-hidden",
                                    )}
                                >
                                    Товары
                                </Button>
                            )}
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

                <PaymentSection
                    type={"sale"}
                    activeDraft={activeDraft}
                    activeSelectPaymetype={activeSelectPaymetype}
                    value={value}
                    setValue={setValue}
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
