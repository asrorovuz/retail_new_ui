import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { columns } from "./table/columns";
import { Button, Dialog, Input, Select, Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import classNames from "@/shared/lib/classNames";
import TBody from "@/shared/ui/kit/Table/TBody";
import type { DraftSaleSchema } from "@/@types/sale";
import Td from "@/shared/ui/kit/Table/Td";
import { useEffect, useMemo, useRef, useState } from "react";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { HiTrash } from "react-icons/hi";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import type { DraftRefundSchema } from "@/@types/refund";
import { CommonDeleteDialog } from "@/widgets/ui/delete-dialog/CommonDeleteDialog";
import type { DraftPurchaseSchema } from "@/@types/purchase";
import { getActivePrice } from "@/shared/lib/getActivatePrice";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
// import { truncate3 } from "@/shared/lib/truncate3";

type PropsType = {
    type: "sale" | "refund" | "purchase";
    setMark: any;
    draft: DraftSaleSchema[] | DraftRefundSchema[] | DraftPurchaseSchema[];
    activeDraft: DraftSaleSchema | DraftRefundSchema | DraftPurchaseSchema;
    expandedRow: string | null;
    expendedId: number | null;
    setSelectedRows?: any;
    selectedRows?: any;
    keyType?: "numeric" | "qwerty" | "fullkey";
    setActiveTypeKeyboard: (type: "numeric" | "qwerty") => void;
    setExpandedRow: React.Dispatch<React.SetStateAction<string | null>>;
    setExpandedId: React.Dispatch<React.SetStateAction<number | null>>;
    deleteDraftItem: (val: number) => void;
    updateDraftItemPrice: (index: number, amount: number) => void;
    updateDraftItemTotalPrice: (ind: number, total: number) => void;
    updateDraftItemQuantity: (ind: number, quantity: number) => void;
};

const PurchaseTable = ({
    type,
    setMark,
    activeDraft,
    expendedId,
    setExpandedId,
    setExpandedRow,
    setActiveTypeKeyboard,
    expandedRow,
    selectedRows,
    setSelectedRows,
    keyType,
    deleteDraftItem,
    updateDraftItemPrice,
    updateDraftItemTotalPrice,
    updateDraftItemQuantity,
}: PropsType) => {
    const [isEditing, setIsEditing] = useState({
        isOpen: false,
        type: "price",
    });
    const currentItem = activeDraft?.items?.[Number(expandedRow)] ?? null;
    const { updatePrices, products } = useDraftPurchaseStore();
    const [localValue, setLocalValue] = useState<string>(
        String(getActivePrice(currentItem, type, selectedRows) ?? 0),
    );
    const [localQuantity, setLocalQuantity] = useState<string>(
        String(currentItem?.quantity ?? 0),
    );
    const [marginByProduct, setMarginByProduct] = useState<
        Record<number, string>
    >({});
    const marginPercent =
        currentItem?.productId != null
            ? (marginByProduct[currentItem.productId] ?? "")
            : "";
    const [confirmDelete, setConfirmDelete] = useState(false);
    const onDeleteDraftItem = () => {
        if (expandedRow) {
            deleteDraftItem(+expandedRow);
            setExpandedRow(null);
        }
    };

    const decrease = () => {
        if (currentItem?.quantity === 1) {
            setConfirmDelete(true);
            return;
        }

        const newVal = (currentItem?.quantity || 0) - 1;
        if (newVal > 0) {
            const price = getActivePrice(currentItem, type, selectedRows);
            updateDraftItemQuantity(Number(expandedRow), newVal);
            updateDraftItemTotalPrice(Number(expandedRow), newVal * price);
        }
    };

    const increase = () => {
        const newVal = (currentItem?.quantity || 0) + 1;
        updateDraftItemQuantity(Number(expandedRow), newVal);
        const price = getActivePrice(currentItem, type, selectedRows);

        updateDraftItemTotalPrice(Number(expandedRow), newVal * price);
    };

    const totalPrice = useMemo(() => {
        return (
            activeDraft?.items?.reduce(
                (sum, current) => sum + (current?.totalAmount || 0),
                0,
            ) ?? 0
        );
    }, [activeDraft]);

    const product = useMemo(() => {
        return products?.find(
            (p: any) => p.productId === currentItem?.productId,
        );
    }, [products, currentItem?.productId]);

    const retailPrice = useMemo(() => {
        return product?.prices?.find(
            (p: any) => p?.product_price_type?.is_primary,
        );
    }, [product]);

    const bulkPrice = useMemo(() => {
        return product?.prices?.find(
            (p: any) => !p?.product_price_type?.is_primary,
        );
    }, [product]);

    // qaysi price tanlangan
    const selectedType = selectedRows?.[currentItem?.productId] ? 2 : 1;

    // input value (string saqlaymiz — Number ga o'tkazmaymiz)
    const selectedPrice =
        selectedType === 1
            ? (retailPrice?.amount ?? "0")
            : (bulkPrice?.amount ?? "0");

    const handleMarginChange = (raw: string) => {
        if (!currentItem) return;
        setMarginByProduct((prev) => ({
            ...prev,
            [currentItem.productId]: raw,
        }));
        const pct = Number(raw);
        if (isNaN(pct) || !retailPrice?.id) return;
        const newRetail = Math.round(
            (currentItem.priceAmount ?? 0) * (1 + pct / 100),
        );
        updatePrices(
            { id: currentItem.productId, price_id: retailPrice.id },
            String(newRetail),
        );
    };

    // expandedRow almashganda editing panelni yopish
    useEffect(() => {
        setIsEditing({ isOpen: false, type: "price" });
    }, [expandedRow]);

    // currentItem?.productId o'zgarganda (o'chirilsa yoki boshqa qatorga o'tilsa)
    useEffect(() => {
        const productId = currentItem?.productId;
        if (productId != null) {
            // Yangi product uchun selectni Rozichga qaytarish
            setSelectedRows?.((prev: any) => ({ ...prev, [productId]: false }));
        } else {
            // Product o'chirildi yoki jadval bo'shadi — panelni yopish
            setExpandedRow(null);
        }
    }, [currentItem?.productId]);

    useEffect(() => {
        setLocalQuantity(String(currentItem?.quantity ?? 0));
    }, [currentItem, type, selectedRows]);

    useEffect(() => {
        setLocalValue(
            String(getActivePrice(currentItem, type, selectedRows) ?? 0),
        );
    }, [currentItem, type, selectedRows]);

    useEffect(() => {
        if (expendedId) {
            let itemId = table
                .getRowModel()
                .rows.find(
                    (item) => item?.original?.productId === expendedId,
                )?.id;
            setExpandedId(null);
            setExpandedRow(itemId!);
            setIsEditing({
                isOpen: true,
                type: "quantity",
            });
        }
    }, [expendedId]);

    const increaseRef = useRef(increase);
    increaseRef.current = increase;
    const decreaseRef = useRef(decrease);
    decreaseRef.current = decrease;

    const keyTypeRef = useRef(keyType);
    keyTypeRef.current = keyType;
    const expandedRowRef = useRef(expandedRow);
    expandedRowRef.current = expandedRow;
    const itemsRef = useRef(activeDraft?.items);
    itemsRef.current = activeDraft?.items;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if (isEditing.isOpen) return;

            const items = itemsRef.current;

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                if (keyTypeRef.current === "qwerty") return;
                if (!items?.length) return;
                e.preventDefault();
                const currentIndex =
                    expandedRowRef.current !== null
                        ? Number(expandedRowRef.current)
                        : -1;
                const next =
                    e.key === "ArrowDown"
                        ? Math.min(currentIndex + 1, items.length - 1)
                        : Math.max(currentIndex - 1, 0);
                setExpandedRow(String(next));
            } else if (e.key === "ArrowRight") {
                if (!expandedRowRef.current) return;
                e.preventDefault();
                increaseRef.current();
            } else if (e.key === "ArrowLeft") {
                if (!expandedRowRef.current) return;
                e.preventDefault();
                decreaseRef.current();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEditing.isOpen]);

    const table = useReactTable({
        data: activeDraft?.items ?? [],
        columns: columns(setMark, type, selectedRows),
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            expanded: expandedRow ? { [expandedRow]: true } : {},
        },
    });

    return (
        <>
            <div className="overflow-hidden flex-1 rounded-lg">
                <div className="border-2 border-slate-200 overflow-y-auto rounded-lg h-full">
                    <div className="h-full flex flex-col justify-between">
                        <Table
                            className="table-fixed"
                            tabIndex={Number(expandedRow)}
                            key={activeDraft?.id}
                            overflow={false}
                            compact={true}
                        >
                            <THead className={"sticky top-0 bg-white"}>
                                {table?.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map(
                                            (header, ind) => {
                                                return (
                                                    <Th
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        style={{
                                                            width: header.column.getSize(),
                                                        }}
                                                        className={classNames(
                                                            "border",
                                                            header.column
                                                                .columnDef.meta
                                                                ?.headerClassName,
                                                            ind
                                                                ? "text-right"
                                                                : "text-left",
                                                        )}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                    </Th>
                                                );
                                            },
                                        )}
                                    </Tr>
                                ))}
                            </THead>

                            <TBody>
                                {table.getRowModel().rows.length > 0 ? (
                                    table
                                        .getRowModel()
                                        .rows.map((row, rowIndex) => {
                                            return (
                                                <Tr
                                                    key={row.id}
                                                    onClick={() => {
                                                        setExpandedRow(
                                                            String(rowIndex),
                                                        );
                                                    }}
                                                    className={classNames(
                                                        expandedRow?.toString() ===
                                                            row.id &&
                                                            "bg-green-200",
                                                        "!h-max cursor-pointer text-black",
                                                    )}
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell, index) => (
                                                            <Td
                                                                key={cell.id}
                                                                style={{
                                                                    width: cell.column.getSize(),
                                                                }}
                                                                className={classNames(
                                                                    cell.column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.bodyCellClassName,
                                                                    "p-2 text-xs",
                                                                )}
                                                            >
                                                                <div
                                                                    className={
                                                                        !index
                                                                            ? "min-w-[220px]"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </div>
                                                            </Td>
                                                        ))}
                                                </Tr>
                                            );
                                        })
                                ) : (
                                    // 🟢 Bo‘sh holatda — Empty chiqadi
                                    <Tr key="empty">
                                        <Td
                                            className="!py-20"
                                            colSpan={
                                                table.getAllColumns().length
                                            }
                                        >
                                            <Empty
                                                textSize="text-base"
                                                size={60}
                                            />
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                        <div className="w-full sticky bottom-0 bg-white border-t border-slate-200">
                            <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                                <div className="text-2xl font-medium text-slate-500">
                                    Итого:{" "}
                                </div>{" "}
                                <div
                                    className={classNames(
                                        "text-2xl font-semibold text-green-600",
                                    )}
                                >
                                    <FormattedNumber value={totalPrice} />
                                </div>
                            </div>

                            <div
                                className={classNames(
                                    expandedRow && activeDraft?.items?.length
                                        ? "flex items-center justify-between gap-x-2"
                                        : "hidden",
                                    `py-2 px-1 bg-slate-200 border-t border-slate-200`,
                                )}
                            >
                                {isEditing?.isOpen &&
                                isEditing?.type === "price" ? (
                                    <Input
                                        size="sm"
                                        type="number"
                                        space={false}
                                        autoFocus={true}
                                        numberMode={
                                            currentItem?.productPackageName ===
                                            "шт"
                                                ? "int"
                                                : "float"
                                        }
                                        className="!w-[35%] h-8"
                                        value={localValue ?? 0}
                                        onFocus={() =>
                                            setActiveTypeKeyboard("numeric")
                                        }
                                        onChange={(val) => {
                                            const raw = val?.target?.value;
                                            setLocalValue(raw);

                                            const newPrice = Number(raw);
                                            if (isNaN(newPrice)) return;
                                            const price = getActivePrice(
                                                {
                                                    ...currentItem,
                                                    priceAmount: newPrice,
                                                },
                                                type,
                                                selectedRows,
                                            );

                                            updateDraftItemPrice(
                                                Number(expandedRow),
                                                newPrice,
                                            );
                                            updateDraftItemTotalPrice(
                                                Number(expandedRow),
                                                price * currentItem.quantity,
                                            );
                                        }}
                                        onBlur={() => {
                                            setIsEditing({
                                                isOpen: false,
                                                type: "",
                                            });
                                        }}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === "Escape"
                                            ) {
                                                (
                                                    e.target as HTMLInputElement
                                                ).blur();
                                            }
                                        }}
                                    />
                                ) : (
                                    <div
                                        onClick={() =>
                                            setIsEditing({
                                                isOpen: true,
                                                type: "price",
                                            })
                                        }
                                        className="bg-white h-8 w-[35%] p-2 flex items-center justify-between gap-2 rounded-lg"
                                    >
                                        Цена:
                                        <FormattedNumber
                                            value={
                                                currentItem?.priceAmount ?? 0
                                            }
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-x-1 w-1/4">
                                    {isEditing?.type !== "quantity" &&
                                        (() => {
                                            const showDeleteDialog = !(
                                                isEditing?.type !==
                                                    "quantity" &&
                                                currentItem?.quantity > 1
                                            );

                                            const minusButton = (
                                                <Button
                                                    variant="solid"
                                                    className="w-8 h-8 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800"
                                                    onClick={decrease}
                                                >
                                                    -
                                                </Button>
                                            );

                                            return showDeleteDialog ? (
                                                <CommonDeleteDialog
                                                    description={`Удалить товар "${currentItem?.productName}"? Действие нельзя будет отменить.`}
                                                    onDelete={onDeleteDraftItem}
                                                >
                                                    {minusButton}
                                                </CommonDeleteDialog>
                                            ) : (
                                                minusButton
                                            );
                                        })()}

                                    {isEditing?.isOpen &&
                                    isEditing?.type === "quantity" ? (
                                        <Input
                                            size="md"
                                            type="number"
                                            className="h-8"
                                            autoFocus={true}
                                            space={false}
                                            numberMode={
                                                currentItem?.productPackageName ===
                                                "шт"
                                                    ? "int"
                                                    : "float"
                                            }
                                            value={localQuantity}
                                            onFocus={() =>
                                                setActiveTypeKeyboard("numeric")
                                            }
                                            onChange={(val) => {
                                                const raw = val?.target?.value;
                                                setLocalQuantity(raw);
                                                {
                                                    /* ← avval local state */
                                                }

                                                const qty = Number(raw);
                                                if (isNaN(qty)) return;
                                                const price = getActivePrice(
                                                    currentItem,
                                                    type,
                                                    selectedRows,
                                                );

                                                updateDraftItemQuantity(
                                                    Number(expandedRow),
                                                    qty,
                                                );
                                                updateDraftItemTotalPrice(
                                                    Number(expandedRow),
                                                    qty * price,
                                                );
                                            }}
                                            onBlur={() => {
                                                setIsEditing({
                                                    isOpen: false,
                                                    type: "",
                                                });
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" ||
                                                    e.key === "Escape"
                                                ) {
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).blur();
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div
                                            onClick={() =>
                                                setIsEditing({
                                                    isOpen: true,
                                                    type: "quantity",
                                                })
                                            }
                                            className="w-full h-8 text-xs font-medium text-slate-800 flex items-center justify-center bg-white rounded-lg"
                                        >
                                            <FormattedNumber
                                                value={currentItem?.quantity}
                                            />
                                        </div>
                                    )}

                                    {isEditing?.type !== "quantity" && (
                                        <Button
                                            variant="solid"
                                            className={classNames(
                                                "w-10 h-8 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800",
                                            )}
                                            onClick={increase}
                                        >
                                            +
                                        </Button>
                                    )}
                                </div>

                                {isEditing?.isOpen &&
                                isEditing?.type === "totalPrice" ? (
                                    <Input
                                        size="sm"
                                        type="number"
                                        space={false}
                                        autoFocus
                                        className="!w-[35%] h-8"
                                        value={currentItem?.totalAmount}
                                        onFocus={() =>
                                            setActiveTypeKeyboard("numeric")
                                        }
                                        onChange={(val) => {
                                            const recalculatedQuantity =
                                                Number(val?.target?.value) /
                                                currentItem?.quantity;
                                            (updateDraftItemPrice(
                                                Number(expandedRow),
                                                recalculatedQuantity,
                                            ),
                                                updateDraftItemTotalPrice(
                                                    Number(expandedRow),
                                                    Number(val?.target?.value),
                                                ));
                                        }}
                                        onBlur={() => {
                                            setIsEditing({
                                                isOpen: false,
                                                type: "",
                                            });
                                        }}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === "Escape"
                                            ) {
                                                (
                                                    e.target as HTMLInputElement
                                                ).blur();
                                            }
                                        }}
                                    />
                                ) : (
                                    <div
                                        onClick={() => {
                                            setIsEditing({
                                                isOpen: true,
                                                type: "totalPrice",
                                            });
                                            //   if (currentItem?.productPackageName?.toLowerCase() !== "шт")
                                        }}
                                        className="bg-white h-8 w-[35%] p-2 flex items-center justify-between gap-2 rounded-lg"
                                    >
                                        Сумма:
                                        <FormattedNumber
                                            value={currentItem?.totalAmount}
                                        />
                                    </div>
                                )}

                                <CommonDeleteDialog
                                    description={`Удалить товар "${currentItem?.productName}"? Действие нельзя будет отменить.`}
                                    onDelete={onDeleteDraftItem}
                                >
                                    <Button
                                        variant="plain"
                                        size="sm"
                                        icon={<HiTrash size={20} />}
                                        className="bg-red-100 text-red-500 hover:text-red-400 active:scale-90 active:bg-red-200 transition-all duration-300 h-8 w-8"
                                    />
                                </CommonDeleteDialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-200 p-2 h-[15.7vh]">
                <div className="grid grid-cols-3 gap-x-1 items-center mb-4">
                    {/* SELECT */}
                    <Select
                        size="sm"
                        options={[
                            { value: 1, label: "Розн. цена" },
                            { value: 2, label: "Опт. цена" },
                        ]}
                        isSearchable={false}
                        className="text-xs"
                        value={
                            selectedRows?.[currentItem?.productId]
                                ? { value: 2, label: "Опт. цена" }
                                : { value: 1, label: "Розн. цена" }
                        }
                        onChange={(val: any) => {
                            setSelectedRows((prev: any) => ({
                                ...prev,
                                [currentItem?.productId]: val.value === 2,
                            }));
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                height: "30px",
                                minHeight: "30px",
                                borderRadius: "8px",
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                    />

                    {/* INPUT PRICE */}
                    <Input
                        size="sm"
                        type="number"
                        space={false}
                        className="!w-[135px] h-[30px] text-xs"
                        value={selectedPrice}
                        onFocus={() => setActiveTypeKeyboard("numeric")}
                        onChange={(val) => {
                            const rawAmount = val.target.value;
                            const priceId =
                                selectedType === 1
                                    ? retailPrice?.id
                                    : bulkPrice?.id;
                            updatePrices(
                                {
                                    id: currentItem?.productId,
                                    price_id: priceId,
                                },
                                rawAmount || "0",
                            );
                        }}
                    />

                    {/* INFO + Marja */}
                    <div className="flex gap-x-2 text-sm font-normal text-slate-800">
                        <Input
                            type="number"
                            placeholder="%"
                            disabled={selectedType === 2}
                            value={selectedType === 2 ? "" : marginPercent}
                            onChange={(e) => handleMarginChange(e.target.value)}
                            onFocus={() => setActiveTypeKeyboard("numeric")}
                            className="!w-12 !h-8"
                            size="sm"
                        />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between gap-x-1">
                                <span className="text-slate-600 shrink-0">
                                    Розничная:
                                </span>

                                <FormattedNumber
                                    value={Number(retailPrice?.amount ?? 0)}
                                />
                            </div>
                            <div className="flex justify-between gap-x-2">
                                <span className="text-slate-600">Оптовая:</span>
                                <FormattedNumber
                                    value={Number(bulkPrice?.amount ?? 0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onRequestClose={() => setConfirmDelete(false)}
                title="Внимание"
                width={400}
            >
                <div className="grid gap-7 px-1">
                    <span className="text-gray-600">
                        Вы действительно хотите удалить товар &quot;
                        {currentItem?.productName}&quot;?
                    </span>
                    <div className="flex justify-end items-center gap-2">
                        <Button onClick={() => setConfirmDelete(false)}>
                            Назад
                        </Button>
                        <Button
                            variant="solid"
                            className="bg-red-700 text-white hover:bg-red-700 hover:opacity-90"
                            onClick={() => {
                                onDeleteDraftItem();
                                setConfirmDelete(false);
                            }}
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default PurchaseTable;
