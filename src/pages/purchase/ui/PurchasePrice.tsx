import type {
    // DraftPurchasePayoutAmountSchema,
    DraftPurchaseSchema,
} from "@/@types/purchase";
import { AccountPermissions } from "@/app/constants/permissions";
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
import { useCheckPermission } from "@/shared/lib/checkPermission";
import classNames from "@/shared/lib/classNames";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { handleScannedProduct } from "@/shared/lib/handleScannedProduct";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import { Button } from "@/shared/ui/kit";
// import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { Header } from "@/widgets";
import Footer from "@/widgets/ui/footer/Footer";
import QuertyKeyboard from "@/widgets/ui/keyboard/QuertyKeyboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchasePrice = () => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [expendedId, setExpandedId] = useState<number | null>(null);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [barcodeMark, setBarcodeMark] = useState("");
    const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>(
        {},
    );
    const [value, setValue] = useState<string>("0");
    const [payModal, setPayModal] = useState(false);
    const [mark, setMark] = useState<number | null>(null);
    const [activeType, setActiveType] = useState<
        "numeric" | "qwerty" | "fullkey"
    >("numeric");
    const [activeSelectPaymetype, setActivePaymentSelectType] =
        useState<number>(1);
    const [search, setSearch] = useState("");
    const [localContractorId, setLocalContractorId] = useState<number | null>(null);

    const checkPermission = useCheckPermission();

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
    const setContractorId = useDraftPurchaseStore((store) => store.setContractorId)
    // const deleteDraftPurchaseMark = useDraftPurchaseStore(
    //     (store) => store.deleteDraftPurchaseMark,
    // );

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
        if (activeDraft?.contractor_id) {
            setLocalContractorId(activeDraft.contractor_id);
        }
    }, [activeDraft?.id]);

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
        <div className="flex gap-x-2 bg-white h-screen overflow-hidden p-2">
            <div className="bg-white w-[65%] flex flex-col gap-y-2">
                <Cashbox
                    type={"purchase"}
                    drafts={draftPurchases}
                    addNewDraft={addDraftPurchase}
                    activateDraft={activateDraftPurchase}
                    payModal={payModal}
                    setLocalContractorId={setLocalContractorId}
                    localContractorId={localContractorId}
                    setExpandedId={setExpandedId}
                />
                <PurchaseTable
                    type="purchase"
                    setMark={setMark}
                    draft={draftPurchases}
                    activeDraft={activeDraft}
                    expandedRow={expandedRow}
                    selectedRows={selectedRows}
                    expendedId={expendedId}
                    keyType={activeType}
                    setActiveTypeKeyboard={setActiveType}
                    setExpandedRow={setExpandedRow}
                    setSelectedRows={setSelectedRows}
                    setExpandedId={setExpandedId}
                    deleteDraftItem={deleteDraftPurchaseItem}
                    updateDraftItemPrice={updateDraftPurchaseItemPrice}
                    updateDraftItemTotalPrice={
                        updateDraftPurchaseItemTotalPrice
                    }
                    updateDraftItemQuantity={updateDraftPurchaseItemQuantity}
                />
                <Footer
                    deleteDraft={deleteDraftPurchase}
                    draft={draftPurchases}
                />
            </div>
            <div className="bg-white w-[35%] flex flex-col gap-y-2">
                <Header />
                <SearchProduct
                    search={search}
                    activeType={activeType}
                    setSearch={setSearch}
                    setActiveType={setActiveType}
                />
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
                        <QuertyKeyboard
                            setActiveType={setActiveType}
                            setSearch={setSearch}
                        />
                    </>
                )}
                {activeType === "numeric" && (
                    <>
                        <PaymeTypeCards
                            type={"purchase"}
                            activeDraft={activeDraft}
                            activeSelectPaymetype={activeSelectPaymetype}
                            setActivePaymentSelectType={
                                setActivePaymentSelectType
                            }
                        />
                    </>
                )}
                {activeType === "numeric" && (
                    <div className="rounded-lg flex gap-x-1">
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
                                onClick={() => navigate("/sales")}
                                size="sm"
                                className={classNames(
                                    "flex flex-col justify-center items-center overflow-hidden",
                                )}
                            >
                                Продажи
                            </Button>
                        </>
                    </div>
                )}

                <PaymentSection
                    type={"purchase"}
                    activeDraft={activeDraft}
                    activeSelectPaymetype={activeSelectPaymetype}
                    value={value}
                    setValue={setValue}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    updateDraftDiscount={updateDraftPurchaseDiscount}
                    updateDraftPayment={updateDraftPurchasePayout}
                />
                <OrderActions
                    type={"purchase"}
                    keyType={activeType}
                    draft={draftPurchases}
                    activeDraft={activeDraft}
                    payModal={payModal}
                    selectedRows={selectedRows}
                    setPayModal={setPayModal}
                    activeSelectPaymetype={activeSelectPaymetype}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    complateActiveDraft={completeActiveDraftPurchase}
                    setContractorIDStore={setContractorId}
                    localContractorId={localContractorId}
                    setLocalContractorId={setLocalContractorId}
                />
            </div>
            {mark ? (
                <ViewMark
                    itemId={mark}
                    onClose={() => setMark(null)}
                    activeDraft={activeDraft}
                />
            ) : null}
        </div>
    );
};

export default PurchasePrice;
