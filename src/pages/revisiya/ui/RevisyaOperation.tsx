import { messages } from "@/app/constants/message.request";
import { useRevisionStore } from "@/app/store/useRevision";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useAllProductApi } from "@/entities/products/repository";
import { useCreateregister } from "@/entities/revision/repository";
import PaymeTypeCards from "@/features/payme-type-cards";
import RevisionTable from "@/features/revision/RevisionTable";
import SearchProduct from "@/features/search-product";
import SearchProductTable from "@/features/search-product-table";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { useDebounce } from "@/shared/lib/useDebounce";
import { Button } from "@/shared/ui/kit";
import { Header } from "@/widgets";
import Footer from "@/widgets/ui/footer/Footer";
import { KeyboardSwitcher } from "@/widgets/ui/keyboard/Keybord";
import { useState } from "react";
import { LuDelete } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const RevisyaOperation = () => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [expendedId, setExpandedId] = useState<number | null>(null);
    const [activeType, setActiveType] = useState<
        "numeric" | "qwerty" | "fullkey"
    >("numeric");
    const [search, setSearch] = useState<string>("");

    const { mutate: createMutate, isPending: createLoading } =
        useCreateregister();

    const navigate = useNavigate();

    const {
        draftRevisions,
        updateDraftRevisionItemQuantity,
        clearDraftRevision,
    } = useRevisionStore();
    const deleteDraftRevisionItem = useRevisionStore(
        (store) => store.deleteDraftRevisionItem,
    );
    const warhouseId = useSettingsStore((s) => s.wareHouseId);

    const debouncedSearch = useDebounce(search ?? "", 500);
    const { data } = useAllProductApi(50, 1, debouncedSearch || "");

    const onSubmit = () => {
        const items = draftRevisions[0]?.items?.map((el) => {
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
                clearDraftRevision();
            },
            onError(error) {
                showErrorMessage(error);
            },
        });
    };

    return (
        <div className="flex gap-x-3">
            <div className="bg-white w-3/5 rounded-2xl p-3 flex flex-col gap-y-3">
                <div className="flex p-1 h-9 bg-slate-200 text-slate-800 justify-between rounded-lg mb-3">
                    <span className="bg-white flex items-center p-2 rounded-md">
                        Окно
                    </span>
                    <span>Ревизия</span>
                </div>
                <RevisionTable
                    type="revision"
                    activeDraft={draftRevisions[0]}
                    expandedRow={expandedRow}
                    expendedId={expendedId}
                    setActiveTypeKeyboard={setActiveType}
                    setExpandedRow={setExpandedRow}
                    setExpandedId={setExpandedId}
                    deleteDraftItem={deleteDraftRevisionItem}
                    updateDraftItemQuantity={updateDraftRevisionItemQuantity}
                />
                <div className="h-[27vh] bg-slate-200 rounded-2xl p-1 flex items-center justify-center">
                    <textarea
                        placeholder="Добавить комментарий для ревизии"
                        disabled
                        className="w-full h-full rounded-2xl p-1 text-xl"
                    />
                </div>
                <Footer />
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
                                type="revision"
                                data={data ?? []}
                                setActiveType={setActiveType}
                                debouncedSearch={debouncedSearch}
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
                                type={"revision"}
                                activeDraft={draftRevisions[0]}
                                activeSelectPaymetype={1}
                                setActivePaymentSelectType={() => {}}
                            />
                        </>
                    </div>
                )}
                {activeType === "numeric" && (
                    <div className="rounded-2xl bg-slate-200 p-1 flex gap-x-1">
                        <>
                            <Button
                                onClick={() => navigate("/revisiya")}
                                className={classNames(
                                    "flex flex-col justify-center items-center overflow-hidden h-[50px]",
                                )}
                            >
                                История
                            </Button>
                            <Button
                                onClick={() => navigate("/products")}
                                className={classNames(
                                    "flex flex-col justify-center items-center overflow-hidden h-[50px]",
                                )}
                            >
                                Товары
                            </Button>
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
                <div className="rounded-2xl bg-slate-200 p-1">
                    <>
                        {activeType === "numeric" && (
                            <div className="h-[11.5vh] flex items-center text-xl justify-center text-gray-700">
                                Остаток в системе: {0}
                            </div>
                        )}
                        {activeType === "numeric" && (
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
                        )}
                        <KeyboardSwitcher
                            activeType={activeType}
                            setActiveType={setActiveType}
                            setSearch={setSearch}
                        />
                    </>
                </div>

                {activeType === "numeric" && (
                    <div className="rounded-2xl bg-slate-200 p-1">
                        <Button
                            size="sm"
                            onClick={onSubmit}
                            loading={createLoading}
                            variant="solid"
                            disabled={!draftRevisions[0]?.items?.length}
                            className="w-full text-base font-medium"
                        >
                            Оформить
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevisyaOperation;
