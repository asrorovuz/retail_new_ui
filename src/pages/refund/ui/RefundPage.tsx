import type {
    // DraftRefundPayoutAmountSchema,
    DraftRefundSchema,
} from "@/@types/refund";
import { PaymentTypes } from "@/app/constants/payment.types";
import { AccountPermissions } from "@/app/constants/permissions";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import {
    useAllProductApi,
    useFindBarcode,
} from "@/entities/products/repository";
import { getPackageInfoByMarkingApi } from "@/entities/products/api";
import { useCheckRefundApi } from "@/entities/refund/repository";
import Cashbox from "@/features/cashbox";
import FavouriteProduct from "@/features/favourite-product";
import { RefundCheckModal } from "@/features/modals";
import OrderActions from "@/features/order-actions";
import PaymeTypeCards from "@/features/payme-type-cards";
import PaymentSection from "@/features/payment-section";
import SaleAndRefunTable from "@/features/sale-refund-table";
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

const RefundPage = () => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [expendedId, setExpandedId] = useState<number | null>(null);
    const [refundCheckData, setRefundCheckData] = useState<any>();
    const [checkCode, setCheckDode] = useState("");
    const [barcode, setBarcode] = useState<string | null>(null);
    const [barcodeMark, setBarcodeMark] = useState("");
    const [mark, setMark] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [value, setValue] = useState<string>("0");
    const [payModal, setPayModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>(
        {},
    );
    const [activeSelectPaymetype, setActivePaymentSelectType] =
        useState<number>(1);
    const [refundCheckModal, setRefundCheckModal] = useState<{
        isOpen: boolean;
        ids: number[];
    }>({
        isOpen: false,
        ids: [],
    });
    const [activeType, setActiveType] = useState<
        "numeric" | "qwerty" | "fullkey"
    >("numeric");
    const debouncedSearch = useDebounce(search, 500);
    const navigate = useNavigate();
    const checkPermission = useCheckPermission();

    const { data } = useAllProductApi(50, 1, debouncedSearch || "");
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
        (store) => store.deleteDraftRefund,
    );
    const deleteDraftRefundItem = useDraftRefundStore(
        (store) => store.deleteDraftRefundItem,
    );
    const updateDraftDraftItemPrice = useDraftRefundStore(
        (store) => store.updateDraftRefundItemPrice,
    );
    const updateDraftDraftItemTotalPrice = useDraftRefundStore(
        (store) => store.updateDraftRefundItemTotalPrice,
    );
    const updateDraftRefundItemQuantity = useDraftRefundStore(
        (store) => store.updateDraftRefundItemQuantity,
    );
    const updateDraftRefundPayout = useDraftRefundStore(
        (store) => store.updateDraftRefundPayout,
    );
    const completeActiveDraftRefund = useDraftRefundStore(
        (store) => store.completeActiveDraftRefund,
    );
    // const updateDraftRefundItem = useDraftRefundStore(
    //     (store) => store.updateDraftRefundItem,
    // );
    // const deleteDraftRefundMark = useDraftRefundStore(
    //     (store) => store.deleteDraftRefundMark,
    // );

    const activeDraft: DraftRefundSchema =
        draftRefunds?.find((s) => s.isActive) ?? draftRefunds[0];

    const handleRefundCheckInputItem = (selectedIds: number[]) => {
        if (!refundCheckData?.items?.length) return;
        const newDraftRefund: DraftRefundSchema = {
            items: [],
            isActive: true,
            discountAmount: "0",
            payout: {
                amounts: PaymentTypes.map((paymentType) => ({
                    amount: "0",
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
                    (i) => i.productId === product.id,
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
        if (!payModal) {
            const onScan = eventBus.on("BARCODE_SCANNED", async (code) => {
                if (code && code?.trim().startsWith("*")) {
                    const newBarcode = code?.slice(1);
                    setCheckDode(newBarcode);
                    setRefundCheckModal((prev) => ({ ...prev, isOpen: true }));
                    return;
                }
                const isMarking = !/^\d+$/.test(code) && code.length > 14;
                if (isMarking) {
                    try {
                        const res = await getPackageInfoByMarkingApi(code);
                        const product = res.product;

                        for (let i = 0; i < res.quantity; i++) {
                            handleScannedProduct(
                                product,
                                "refund",
                                setExpandedId,
                                selectedRows,
                                res?.marks[i],
                            );
                        }
                    } catch {
                        showErrorLocalMessage("Марка не найдена");
                    }
                    return;
                }
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
        if (isSuccess && !isFetching && !payModal) {
            if (findBarcodeData) {
                handleScannedProduct(
                    findBarcodeData,
                    "refund",
                    setExpandedId,
                    selectedRows,
                    barcodeMark,
                );
                setBarcode(null);
            }
        }
    }, [isSuccess, findBarcodeData, isFetching]);

    useEffect(() => {
        if (!isError || payModal) return;
        showErrorLocalMessage("Товар не найден");
        setBarcode(null);
    }, [isError]);

    useEffect(() => {
        if (checkData) {
            setRefundCheckData(checkData);
        }
    }, [checkData]);

    return (
        <div className="flex gap-x-2 bg-white h-screen overflow-hidden p-2">
            <div className="bg-white w-[65%] flex flex-col gap-y-2">
                <Cashbox
                    type={"refund"}
                    drafts={draftRefunds}
                    addNewDraft={addDraftRefund}
                    activateDraft={activateDraftRefund}
                />
                <SaleAndRefunTable
                    type="refund"
                    setMark={setMark}
                    draft={draftRefunds}
                    activeDraft={activeDraft}
                    expandedRow={expandedRow}
                    selectedRows={selectedRows}
                    expendedId={expendedId}
                    keyType={activeType}
                    setActiveTypeKeyboard={setActiveType}
                    setExpandedRow={setExpandedRow}
                    setSelectedRows={setSelectedRows}
                    setExpandedId={setExpandedId}
                    deleteDraftItem={deleteDraftRefundItem}
                    updateDraftItemPrice={updateDraftDraftItemPrice}
                    updateDraftItemTotalPrice={updateDraftDraftItemTotalPrice}
                    updateDraftItemQuantity={updateDraftRefundItemQuantity}
                />
                <FavouriteProduct
                    type="refund"
                    selectedRows={selectedRows}
                    setExpandedRow={setExpandedRow}
                    setExpandedId={setExpandedId}
                />
                <Footer deleteDraft={deleteDraftRefund} draft={draftRefunds} />
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
                                type="refund"
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
                            type={"refund"}
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
                                onClick={() => navigate("/refund-history")}
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
                                Продажа
                            </Button>
                        </>
                    </div>
                )}

                <PaymentSection
                    type={"refund"}
                    activeDraft={activeDraft}
                    activeSelectPaymetype={activeSelectPaymetype}
                    value={value}
                    setValue={setValue}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    updateDraftPayment={updateDraftRefundPayout}
                />

                <OrderActions
                    type={"refund"}
                    keyType={activeType}
                    draft={draftRefunds}
                    activeDraft={activeDraft}
                    payModal={payModal}
                    selectedRows={selectedRows}
                    setPayModal={setPayModal}
                    activeSelectPaymetype={activeSelectPaymetype}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    complateActiveDraft={completeActiveDraftRefund}
                />

                <RefundCheckModal
                    loading={isCheckPending}
                    isOpen={refundCheckModal?.isOpen}
                    setRefundCheckModal={setRefundCheckModal}
                    handleRefundCheckInputItem={handleRefundCheckInputItem}
                    items={refundCheckData?.items || []}
                />

                {mark ? (
                    <ViewMark
                        itemId={mark}
                        onClose={() => setMark(null)}
                        activeDraft={activeDraft}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default RefundPage;
