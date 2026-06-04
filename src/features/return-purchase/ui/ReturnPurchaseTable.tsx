import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { columns } from "@/features/sale-refund-table/ui/table/columns";
import { Button, Input, Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import classNames from "@/shared/lib/classNames";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import { useEffect, useMemo, useRef, useState } from "react";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { HiTrash } from "react-icons/hi";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import { CommonDeleteDialog } from "@/widgets/ui/delete-dialog/CommonDeleteDialog";
import { useReturnPurchaseDraftStore } from "@/app/store/useReturnPurchaseDraftStore";

const ReturnPurchaseTable = () => {
    const {
        draftReturnPurchases,
        deleteDraftReturnPurchaseItem,
        updateDraftReturnPurchaseItemPrice,
        updateDraftReturnPurchaseItemTotalPrice,
        updateDraftReturnPurchaseItemQuantity,
    } = useReturnPurchaseDraftStore();

    const activeDraft = draftReturnPurchases.find((d) => d.isActive);

    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState({ isOpen: false, type: "" });
    const [localValue, setLocalValue] = useState("0");
    const [localQuantity, setLocalQuantity] = useState("0");

    const currentItem = activeDraft?.items?.[Number(expandedRow)] ?? null;

    const totalPrice = useMemo(
        () =>
            activeDraft?.items?.reduce(
                (sum, item) => sum + (item?.totalAmount || 0),
                0,
            ) ?? 0,
        [activeDraft],
    );

    useEffect(() => {
        setLocalValue(String(currentItem?.priceAmount ?? 0));
        setLocalQuantity(String(currentItem?.quantity ?? 0));
    }, [currentItem]);

    const onDeleteDraftItem = () => {
        if (expandedRow !== null) {
            deleteDraftReturnPurchaseItem(+expandedRow);
            setExpandedRow(null);
        }
    };

    const decrease = () => {
        if (!currentItem || expandedRow === null) return;
        if (currentItem.quantity === 1) {
            deleteDraftReturnPurchaseItem(Number(expandedRow));
            setExpandedRow(null);
            return;
        }
        const newVal = currentItem.quantity - 1;
        updateDraftReturnPurchaseItemQuantity(Number(expandedRow), newVal);
        updateDraftReturnPurchaseItemTotalPrice(
            Number(expandedRow),
            newVal * currentItem.priceAmount,
        );
    };

    const increase = () => {
        if (!currentItem || expandedRow === null) return;
        const newVal = currentItem.quantity + 1;
        updateDraftReturnPurchaseItemQuantity(Number(expandedRow), newVal);
        updateDraftReturnPurchaseItemTotalPrice(
            Number(expandedRow),
            newVal * currentItem.priceAmount,
        );
    };

    const increaseRef = useRef(increase);
    increaseRef.current = increase;
    const decreaseRef = useRef(decrease);
    decreaseRef.current = decrease;
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
                if (expandedRowRef.current === null) return;
                e.preventDefault();
                increaseRef.current();
            } else if (e.key === "ArrowLeft") {
                if (expandedRowRef.current === null) return;
                e.preventDefault();
                decreaseRef.current();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEditing.isOpen]);

    const table = useReactTable({
        data: activeDraft?.items ?? [],
        columns: columns(() => {}, "purchase", {}),
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            expanded: expandedRow ? { [expandedRow]: true } : {},
        },
    });

    const showDeleteDialog = (currentItem?.quantity ?? 0) <= 1;

    const minusButton = (
        <Button
            variant="solid"
            className="w-8 h-8 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800"
            onClick={decrease}
        >
            -
        </Button>
    );

    return (
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
                        <THead className="sticky top-0 bg-white">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, ind) => (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                width: header.column.getSize(),
                                            }}
                                            className={classNames(
                                                "border",
                                                header.column.columnDef.meta
                                                    ?.headerClassName,
                                                ind
                                                    ? "text-right"
                                                    : "text-left",
                                            )}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </THead>

                        <TBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table
                                    .getRowModel()
                                    .rows.map((row, rowIndex) => (
                                        <Tr
                                            key={row.id}
                                            onClick={() =>
                                                setExpandedRow(String(rowIndex))
                                            }
                                            className={classNames(
                                                expandedRow?.toString() ===
                                                    row.id && "bg-green-200",
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
                                                                .columnDef.meta
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
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </div>
                                                    </Td>
                                                ))}
                                        </Tr>
                                    ))
                            ) : (
                                <Tr key="empty">
                                    <Td
                                        className="!py-20"
                                        colSpan={table.getAllColumns().length}
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
                        {/* Итого */}
                        <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                            <div className="text-2xl font-medium text-slate-500">
                                Итого:{" "}
                            </div>
                            <div className="text-2xl font-semibold text-green-600">
                                <FormattedNumber value={totalPrice} />
                            </div>
                        </div>

                        {/* Editing panel */}
                        <div
                            className={classNames(
                                expandedRow !== null &&
                                    activeDraft?.items?.length
                                    ? "flex items-center justify-between gap-x-2"
                                    : "hidden",
                                "py-2 px-1 bg-slate-200 border-t border-slate-200",
                            )}
                        >
                            {/* Narx */}
                            {isEditing.isOpen && isEditing.type === "price" ? (
                                <Input
                                    size="sm"
                                    type="number"
                                    space={false}
                                    autoFocus
                                    className="!w-[35%] h-8"
                                    value={localValue}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        setLocalValue(raw);
                                        const newPrice = Number(raw);
                                        if (isNaN(newPrice)) return;
                                        updateDraftReturnPurchaseItemPrice(
                                            Number(expandedRow),
                                            newPrice,
                                        );
                                        updateDraftReturnPurchaseItemTotalPrice(
                                            Number(expandedRow),
                                            newPrice *
                                                (currentItem?.quantity ?? 1),
                                        );
                                    }}
                                    onBlur={() =>
                                        setIsEditing({ isOpen: false, type: "" })
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === "Escape"
                                        )
                                            (
                                                e.target as HTMLInputElement
                                            ).blur();
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
                                        value={currentItem?.priceAmount ?? 0}
                                    />
                                </div>
                            )}

                            {/* Miqdor */}
                            <div className="flex items-center gap-x-1 w-1/4">
                                {isEditing.type !== "quantity" &&
                                    (showDeleteDialog ? (
                                        <CommonDeleteDialog
                                            description={`Удалить товар "${currentItem?.productName}"? Действие нельзя будет отменить.`}
                                            onDelete={onDeleteDraftItem}
                                        >
                                            {minusButton}
                                        </CommonDeleteDialog>
                                    ) : (
                                        minusButton
                                    ))}

                                {isEditing.isOpen &&
                                isEditing.type === "quantity" ? (
                                    <Input
                                        size="md"
                                        type="number"
                                        className="h-8"
                                        autoFocus
                                        space={false}
                                        value={localQuantity}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            setLocalQuantity(raw);
                                            const qty = Number(raw);
                                            if (isNaN(qty)) return;
                                            updateDraftReturnPurchaseItemQuantity(
                                                Number(expandedRow),
                                                qty,
                                            );
                                            updateDraftReturnPurchaseItemTotalPrice(
                                                Number(expandedRow),
                                                qty *
                                                    (currentItem?.priceAmount ??
                                                        0),
                                            );
                                        }}
                                        onBlur={() =>
                                            setIsEditing({
                                                isOpen: false,
                                                type: "",
                                            })
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === "Escape"
                                            )
                                                (
                                                    e.target as HTMLInputElement
                                                ).blur();
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
                                            value={currentItem?.quantity ?? 0}
                                        />
                                    </div>
                                )}

                                {isEditing.type !== "quantity" && (
                                    <Button
                                        variant="solid"
                                        className="w-10 h-8 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800"
                                        onClick={increase}
                                    >
                                        +
                                    </Button>
                                )}
                            </div>

                            {/* Summa */}
                            {isEditing.isOpen &&
                            isEditing.type === "totalPrice" ? (
                                <Input
                                    size="sm"
                                    type="number"
                                    space={false}
                                    autoFocus
                                    className="!w-[35%] h-8"
                                    value={currentItem?.totalAmount ?? 0}
                                    onChange={(e) => {
                                        const total = Number(e.target.value);
                                        const newPrice =
                                            total / (currentItem?.quantity || 1);
                                        updateDraftReturnPurchaseItemPrice(
                                            Number(expandedRow),
                                            newPrice,
                                        );
                                        updateDraftReturnPurchaseItemTotalPrice(
                                            Number(expandedRow),
                                            total,
                                        );
                                    }}
                                    onBlur={() =>
                                        setIsEditing({ isOpen: false, type: "" })
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === "Escape"
                                        )
                                            (
                                                e.target as HTMLInputElement
                                            ).blur();
                                    }}
                                />
                            ) : (
                                <div
                                    onClick={() =>
                                        setIsEditing({
                                            isOpen: true,
                                            type: "totalPrice",
                                        })
                                    }
                                    className="bg-white h-8 w-[35%] p-2 flex items-center justify-between gap-2 rounded-lg"
                                >
                                    Сумма:
                                    <FormattedNumber
                                        value={currentItem?.totalAmount ?? 0}
                                    />
                                </div>
                            )}

                            {/* O'chirish */}
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
    );
};

export default ReturnPurchaseTable;
