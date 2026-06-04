import { useContragentApi } from "@/entities/history/repository";
import { ReturnPurchaseTable } from "@/features/return-purchase";
import { useReturnPurchaseDraftStore } from "@/app/store/useReturnPurchaseDraftStore";
import { Button, Select } from "@/shared/ui/kit";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/widgets/ui/footer/Footer";
import { Header } from "@/widgets";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import QuertyKeyboard from "@/widgets/ui/keyboard/QuertyKeyboard";
import { useDebounce } from "@/shared/lib/useDebounce";
import {
    useAllProductApi,
    useFindBarcode,
} from "@/entities/products/repository";
import PaymeTypeCards from "@/features/payme-type-cards";
import eventBus from "@/shared/lib/eventBus";
import { handleBarcodeScanned } from "@/shared/lib/handleScannedBarcode";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { handleScannedProduct } from "@/shared/lib/handleScannedProduct";
import classNames from "@/shared/lib/classNames";
import { useNavigate } from "react-router-dom";
import PaymentSection from "@/features/payment-section";
import ViewMark from "@/features/viewMark";
import OrderActions from "@/features/order-actions";

const ReturnPurchaseOperation = () => {
    const navigate = useNavigate();
    const [, setExpandedRow] = useState<string | null>(null);
    const [, setExpandedId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [activeType, setActiveType] = useState<
        "numeric" | "qwerty" | "fullkey"
    >("numeric");
    const [selectedRows] = useState<Record<number, boolean>>({});
    const [mark, setMark] = useState<number | null>(null);
    const [value, setValue] = useState<string>("0");
    const [activeSelectPaymetype, setActivePaymentSelectType] =
        useState<number>(1);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [barcodeMark, setBarcodeMark] = useState("");
    const [payModal, setPayModal] = useState(false);
    const [isBlockSell, setIsBlockSell] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const { data: contractorData } = useContragentApi();
    const { data } = useAllProductApi(50, 1, debouncedSearch || "");
    const {
        data: findBarcodeData,
        isSuccess,
        isError,
        isFetching,
    } = useFindBarcode(barcode);

    const {
        setReturnPurchaseContractorId,
        deleteDraftReturnPurchase,
        draftReturnPurchases,
        updateDraftReturnPurchasePayout,
        completeActiveDraftReturnPurchase
    } = useReturnPurchaseDraftStore();

    const activeDraft = draftReturnPurchases.find((d) => d.isActive) ?? draftReturnPurchases[0];

    const selectOption = useMemo(() => {
        return contractorData
            ?.filter((el: any) => el?.is_supplier)
            ?.map((item: any) => ({
                value: item?.id,
                label: item?.name,
            }));
    }, [contractorData]);

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
        if (isSuccess && !isFetching && !payModal) {
            if (findBarcodeData) {
                handleScannedProduct(
                    findBarcodeData,
                    "return_purchase",
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
                <div className="p-1 rounded-lg flex items-center justify-between gap-x-2 bg-slate-200">
                    <span className="uppercase font-semibold text-slate-900">
                        Возврат товара поставщику
                    </span>
                    <Select
                        size="sm"
                        options={selectOption}
                        placeholder="Поставщик"
                        value={
                            selectOption?.find(
                                (opt: any) =>
                                    opt.value === activeDraft?.contractor_id,
                            ) ?? null
                        }
                        isClearable
                        onChange={(val: any) => {
                            const id = val ? val.value : null;
                            setReturnPurchaseContractorId(id);
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                height: "32px",
                                width: "180px",
                                minHeight: "32px",
                                borderRadius: "8px",
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                        className="text-xs"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                    />
                </div>

                <ReturnPurchaseTable />
                <Footer
                    deleteDraft={deleteDraftReturnPurchase}
                    draft={draftReturnPurchases}
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
                            type="return_purchase"
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
                                onClick={() => navigate("/return-purchase-history")}
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
                    type={"return_purchase"}
                    activeDraft={activeDraft}
                    activeSelectPaymetype={activeSelectPaymetype}
                    value={value}
                    setValue={setValue}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    updateDraftPayment={updateDraftReturnPurchasePayout}
                    isBlockSell={isBlockSell}
                    setIsBlockSell={setIsBlockSell}
                />

                <OrderActions
                    type={"return_purchase"}
                    keyType={activeType}
                    draft={draftReturnPurchases}
                    activeDraft={activeDraft}
                    payModal={payModal}
                    selectedRows={selectedRows}
                    setPayModal={setPayModal}
                    activeSelectPaymetype={activeSelectPaymetype}
                    setActivePaymentSelectType={setActivePaymentSelectType}
                    complateActiveDraft={completeActiveDraftReturnPurchase}
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

export default ReturnPurchaseOperation;
