import { messages } from "@/app/constants/message.request";
import { AccountPermissions } from "@/app/constants/permissions";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useWriteOfStore } from "@/app/store/useWriteofStroe";
import { useAllProductApi } from "@/entities/products/repository";
import { useCreateWriteoff } from "@/entities/revision/repository";
import RevisionTable from "@/features/revision/RevisionTable";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import { useCheckPermission } from "@/shared/lib/checkPermission";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import { Button } from "@/shared/ui/kit";
import { Header } from "@/widgets";
import Footer from "@/widgets/ui/footer/Footer";
import NumericKeyboard from "@/widgets/ui/keyboard/NumericKeyboard";
import QuertyKeyboard from "@/widgets/ui/keyboard/QuertyKeyboard";
import { useState } from "react";
import { LuDelete } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const WriteOffOperation = () => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [expendedId, setExpandedId] = useState<number | null>(null);
    const [activeType, setActiveType] = useState<
        "numeric" | "qwerty" | "fullkey"
    >("numeric");
    const [search, setSearch] = useState<string>("");

    const { mutate: createMutate, isPending: createLoading } =
        useCreateWriteoff();

    const navigate = useNavigate();
    const checkPermission = useCheckPermission();

    const { draftWriteOfs, updateDraftWriteOfItemQuantity, clearDraftWriteOf } =
        useWriteOfStore();
    const deleteDraftWriteOfItem = useWriteOfStore(
        (store) => store.deleteDraftWriteOfItem,
    );
    const warhouseId = useSettingsStore((s) => s.wareHouseId);

    const debouncedSearch = useDebounce(search ?? "", 500);
    const { data } = useAllProductApi(50, 1, debouncedSearch || "");

    const onSubmit = () => {
        const items = draftWriteOfs[0]?.items?.map((el) => {
            return {
                product_id: el?.productId,
                quantity: el?.quantity,
                warehouse_id: warhouseId ?? el?.warehouseId,
            };
        });

        const data = {
            is_approved: true,
            items: items,
        };

        createMutate(data, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                clearDraftWriteOf();
            },
            onError(error) {
                showErrorMessage(error);
            },
        });
    };

    return (
        <div className="flex gap-x-2 bg-white h-screen overflow-hidden p-2">
            <div className="bg-white w-[65%] flex flex-col gap-y-2">
                <div className="flex p-1 h-9 bg-slate-200 text-slate-800 justify-between rounded-lg">
                    <span className="bg-white flex items-center p-2 rounded-md">
                        Окно
                    </span>
                    <span className="text-xl">Списать товар</span>
                </div>
                <RevisionTable
                    type="writeof"
                    activeDraft={draftWriteOfs[0]}
                    expandedRow={expandedRow}
                    expendedId={expendedId}
                    keyType={activeType}
                    setActiveTypeKeyboard={setActiveType}
                    setExpandedRow={setExpandedRow}
                    setExpandedId={setExpandedId}
                    deleteDraftItem={deleteDraftWriteOfItem}
                    updateDraftItemQuantity={updateDraftWriteOfItemQuantity}
                />
                <div className="h-[20vh] bg-slate-200 rounded-lg flex items-center justify-center">
                    <textarea
                        placeholder="Добавить комментарий для ревизии"
                        disabled
                        className="w-full h-full rounded-lg p-1 text-xl"
                    />
                </div>
                <Footer />
            </div>
            <div className="bg-white w-[35%] flex flex-col h-full gap-y-2">
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
                            type="writeof"
                            data={data ?? []}
                            setActiveType={setActiveType}
                            debouncedSearch={debouncedSearch}
                            setExpandedRow={setExpandedRow}
                            setExpandedId={setExpandedId}
                        />
                        <QuertyKeyboard
                            setActiveType={setActiveType}
                            setSearch={setSearch}
                        />
                    </>
                )}
                {/* {activeType === "numeric" && (
                    <>
                        <PaymeTypeCards
                            type={"revision"}
                            activeDraft={draftWriteOfs[0]}
                            activeSelectPaymetype={1}
                            setActivePaymentSelectType={() => {}}
                        />
                    </>
                )} */}
                {activeType === "numeric" && (
                    <div className="rounded-lg bg-slate-200 p-1 flex gap-x-1">
                        <>
                            <Button
                                onClick={() => navigate("/writeoff")}
                                className={classNames(
                                    "flex flex-col justify-center items-center overflow-hidden h-[50px]",
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
                                        "flex flex-col justify-center items-center overflow-hidden h-[50px]",
                                    )}
                                >
                                    Товары
                                </Button>
                            )}
                            <Button
                                onClick={() => navigate("/sales")}
                                className={classNames(
                                    "flex flex-col justify-center items-center overflow-hidden h-[50px]",
                                )}
                            >
                                Продажи
                            </Button>
                        </>
                    </div>
                )}
                {activeType === "numeric" && (
                    <div className="rounded-lg flex-1 p-1 bg-slate-200 flex flex-col">
                        <>
                            <div className="h-full flex-1 flex items-center text-xl justify-center text-gray-700">
                                Остаток в системе: {0}
                            </div>

                            <div className="grid grid-cols-4 gap-1 mb-1">
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="plain"
                                    onClick={() => setActiveType("qwerty")}
                                    className="w-full bg-slate-300 text-slate-700"
                                >
                                    ABC
                                </Button>
                                <Button
                                    size="sm"
                                    type="button"
                                    disabled={true}
                                    variant="plain"
                                    className={classNames(
                                        "w-full bg-slate-300 text-slate-700",
                                    )}
                                >
                                    Скидка
                                </Button>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="plain"
                                    disabled={true}
                                    className="w-full bg-slate-300 text-slate-700"
                                >
                                    Oчистить
                                </Button>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="plain"
                                    disabled={true}
                                    className="w-full bg-slate-300 text-slate-700"
                                    icon={<LuDelete />}
                                ></Button>
                            </div>
                        </>
                        <NumericKeyboard />
                    </div>
                )}

                {activeType === "numeric" && (
                    <Button
                        size="sm"
                        onClick={onSubmit}
                        loading={createLoading}
                        variant="solid"
                        disabled={!draftWriteOfs[0]?.items?.length}
                        className="w-full text-base font-medium"
                    >
                        Оформить
                    </Button>
                )}
            </div>
        </div>
    );
};

export default WriteOffOperation;
